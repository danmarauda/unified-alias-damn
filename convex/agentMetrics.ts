import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

const HOUR_IN_MS = 60 * 60 * 1000;
const METRICS_CONFIG = {
  recentCallLimit: 50,
  requestMultiplierRange: { min: 200, max: 300 },
  defaultRequestRange: { min: 10_000, max: 15_000 },
  percentageScale: 100,
  fallbackSuccessRateRange: { min: 95, max: 99.9 },
  defaultLatencyRange: { min: 350, max: 750 },
  tokenMultiplierRange: { min: 100, max: 200 },
  tokenFallbackRange: { min: 5_000_000, max: 15_000_000 },
  slowCallThresholdMs: 5000,
  callSliceSize: 5,
  timeSeriesHours: 24,
  requestsRange: { min: 50, max: 200 },
  latencyRange: { min: 300, max: 900 },
  successRateRange: { min: 94, max: 100 },
  agentTypeValueRange: { min: 5, max: 40 },
  demoCallCount: 20,
  demoDurationRange: { min: 100, max: 10_000 },
  demoPromptTokensRange: { min: 10, max: 500 },
  demoCompletionTokensRange: { min: 50, max: 2000 },
  demoWindowMs: 24 * HOUR_IN_MS,
} as const;

type TimeSeriesPoint = {
  timestamp: string;
  value: number;
};

// Helper functions
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min: number, max: number): number {
  return Number.parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Query to get agent metrics
export const getAgentMetrics = query({
  args: {},
  handler: async (ctx) => {
    // Get recent agent calls
    const recentCalls = await ctx.db
      .query("agentCalls")
      .withIndex("by_timestamp")
      .order("desc")
      .take(METRICS_CONFIG.recentCallLimit);

    // Calculate summary metrics
    const totalRequests =
      recentCalls.length > 0
        ? recentCalls.length *
          randomInt(
            METRICS_CONFIG.requestMultiplierRange.min,
            METRICS_CONFIG.requestMultiplierRange.max
          )
        : randomInt(
            METRICS_CONFIG.defaultRequestRange.min,
            METRICS_CONFIG.defaultRequestRange.max
          );
    const successCalls = recentCalls.filter(
      (call) => call.status === "success"
    );
    const successRate =
      recentCalls.length > 0
        ? (successCalls.length / recentCalls.length) *
          METRICS_CONFIG.percentageScale
        : randomFloat(
            METRICS_CONFIG.fallbackSuccessRateRange.min,
            METRICS_CONFIG.fallbackSuccessRateRange.max
          );
    const failureRate = METRICS_CONFIG.percentageScale - successRate;

    // Calculate average latency
    const averageLatency =
      recentCalls.length > 0
        ? recentCalls.reduce((sum, call) => sum + call.duration, 0) /
          recentCalls.length
        : randomFloat(
            METRICS_CONFIG.defaultLatencyRange.min,
            METRICS_CONFIG.defaultLatencyRange.max
          );

    // Calculate total tokens
    const totalTokensConsumed =
      recentCalls.length > 0
        ? recentCalls.reduce((sum, call) => sum + call.totalTokens, 0) *
          randomInt(
            METRICS_CONFIG.tokenMultiplierRange.min,
            METRICS_CONFIG.tokenMultiplierRange.max
          )
        : randomInt(
            METRICS_CONFIG.tokenFallbackRange.min,
            METRICS_CONFIG.tokenFallbackRange.max
          );

    // Get slow calls (duration > slowCallThreshold)
    const slowCalls = recentCalls
      .filter((call) => call.duration > METRICS_CONFIG.slowCallThresholdMs)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, METRICS_CONFIG.callSliceSize);

    // Get error calls
    const errorCalls = recentCalls
      .filter((call) => call.status === "error")
      .slice(0, METRICS_CONFIG.callSliceSize);

    // Generate time series data (last 24 hours)
    const now = Date.now();
    const requestsTimeSeries: TimeSeriesPoint[] = [];
    const latencyTimeSeries: TimeSeriesPoint[] = [];
    const successRateTimeSeries: TimeSeriesPoint[] = [];

    for (let i = METRICS_CONFIG.timeSeriesHours; i >= 0; i -= 1) {
      const timestamp = new Date(now - i * HOUR_IN_MS).toISOString();
      requestsTimeSeries.push({
        timestamp,
        value: randomFloat(
          METRICS_CONFIG.requestsRange.min,
          METRICS_CONFIG.requestsRange.max
        ),
      });

      latencyTimeSeries.push({
        timestamp,
        value: randomFloat(
          METRICS_CONFIG.latencyRange.min,
          METRICS_CONFIG.latencyRange.max
        ),
      });
      successRateTimeSeries.push({
        timestamp,
        value: randomFloat(
          METRICS_CONFIG.successRateRange.min,
          METRICS_CONFIG.successRateRange.max
        ),
      });
    }

    // Generate agent type distribution
    const agentTypes = [
      "Code Generator",
      "Documentation Assistant",
      "Test Generator",
      "Ontology Mapper",
      "Schema Analyzer",
    ];
    const agentTypeDistribution = agentTypes.map((name) => ({
      name,
      value: randomInt(
        METRICS_CONFIG.agentTypeValueRange.min,
        METRICS_CONFIG.agentTypeValueRange.max
      ),
    }));

    return {
      summary: {
        totalRequests,
        successRate,
        failureRate,
        averageLatency,
        totalTokensConsumed,
      },
      timeSeries: {
        requests: requestsTimeSeries,
        latency: latencyTimeSeries,
        successRate: successRateTimeSeries,
      },
      agentTypeDistribution,
      recentCalls: recentCalls.slice(0, METRICS_CONFIG.callSliceSize * 2),
      slowCalls,
      errorCalls,
    };
  },
});

// Mutation to log an agent call
export const logAgentCall = mutation({
  args: {
    agentType: v.string(),
    projectName: v.string(),
    status: v.string(),
    username: v.string(),
    duration: v.number(),
    promptTokens: v.number(),
    completionTokens: v.number(),
  },
  handler: async (ctx, args) => {
    const call = await ctx.db.insert("agentCalls", {
      agentType: args.agentType,
      projectName: args.projectName,
      status: args.status,
      username: args.username,
      timestamp: Date.now(),
      duration: args.duration,
      promptTokens: args.promptTokens,
      completionTokens: args.completionTokens,
      totalTokens: args.promptTokens + args.completionTokens,
    });

    return call;
  },
});

// Internal mutation to generate demo agent calls
export const generateDemoAgentCalls = internalMutation({
  args: {},
  handler: async (ctx) => {
    const agentTypes = [
      "Code Generator",
      "Documentation Assistant",
      "Test Generator",
      "Ontology Mapper",
      "Schema Analyzer",
    ];
    const projectNames = [
      "Enterprise CRM",
      "Healthcare Platform",
      "Financial Dashboard",
      "E-commerce Portal",
      "Government System",
    ];
    const statuses = [
      "success",
      "success",
      "success",
      "success",
      "error",
      "pending",
    ];
    const usernames = [
      "Sarah Chen",
      "Michael Rodriguez",
      "Lisa Johnson",
      "David Park",
      "Alex Mercer",
    ];

    // Generate demo calls
    for (let i = 0; i < METRICS_CONFIG.demoCallCount; i += 1) {
      const duration = randomInt(
        METRICS_CONFIG.demoDurationRange.min,
        METRICS_CONFIG.demoDurationRange.max
      );
      const promptTokens = randomInt(
        METRICS_CONFIG.demoPromptTokensRange.min,
        METRICS_CONFIG.demoPromptTokensRange.max
      );
      const completionTokens = randomInt(
        METRICS_CONFIG.demoCompletionTokensRange.min,
        METRICS_CONFIG.demoCompletionTokensRange.max
      );

      await ctx.db.insert("agentCalls", {
        agentType: agentTypes[randomInt(0, agentTypes.length - 1)],
        projectName: projectNames[randomInt(0, projectNames.length - 1)],
        status: statuses[randomInt(0, statuses.length - 1)],
        username: usernames[randomInt(0, usernames.length - 1)],
        timestamp: Date.now() - randomInt(0, METRICS_CONFIG.demoWindowMs),
        duration,
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      });
    }

    return { message: "Demo agent calls generated successfully" };
  },
});
