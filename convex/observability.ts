import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * ALIAS Hivemind V3 Observability - Convex Mutations & Queries
 *
 * Real-time multi-agent observability for BIG 3 SUPER AGENT:
 * - Voice Controller (OpenAI Realtime API)
 * - Browser Validator (Gemini 2.5 Flash)
 * - Multi-LLM Router (OpenAI, Gemini, Claude)
 *
 * Tracks:
 * - 27 agents across 3 squadrons (Data, Knowledge, Validation)
 * - 35 UCE neural network activations
 * - LLM costs and performance metrics
 */

// ============================================================================
// MUTATIONS - Event Ingestion
// ============================================================================

/**
 * Ingest single observability event
 * Used by Claude Code hooks and Hivemind V3 orchestrator
 */
// Type definitions for observability events
const sourceAppValidator = v.union(
  v.literal("hivemind-v3"),
  v.literal("voice-controller"),
  v.literal("browser-validator"),
  v.literal("llm-router"),
  v.literal("claude-code"),
  v.literal("agent-orchestrator"),
);

const eventTypeValidator = v.union(
  v.literal("VoiceCommand"),
  v.literal("BrowserAction"),
  v.literal("LLMRoute"),
  v.literal("AgentSpawn"),
  v.literal("NeuralActivation"),
  v.literal("ToolCall"),
  v.literal("Error"),
  v.literal("Metric"),
);

const squadronValidator = v.union(
  v.literal("data"),
  v.literal("knowledge"),
  v.literal("validation"),
);

const llmProviderValidator = v.union(
  v.literal("openai"),
  v.literal("anthropic"),
  v.literal("google"),
  v.literal("cerebras"),
  v.literal("groq"),
  v.literal("mistral"),
  v.literal("deepseek"),
  v.literal("cohere"),
  v.literal("perplexity"),
  v.literal("xai"),
  v.literal("azure"),
  v.literal("bedrock"),
  v.literal("vertex"),
);

const statusValidator = v.union(
  v.literal("pending"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("failed"),
);

const payloadValidator = v.optional(
  v.object({
    input: v.optional(v.string()),
    output: v.optional(v.string()),
    toolName: v.optional(v.string()),
    parameters: v.optional(v.record(v.string(), v.string())),
    error: v.optional(v.string()),
    context: v.optional(v.string()),
  }),
);

const metadataValidator = v.optional(
  v.object({
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    requestId: v.optional(v.string()),
    parentEventId: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }),
);

export const ingestEvent = mutation({
  args: {
    sessionId: v.string(),
    sourceApp: sourceAppValidator,
    eventType: eventTypeValidator,
    action: v.string(),
    payload: payloadValidator,

    // Optional fields
    agentName: v.optional(v.string()),
    squadron: v.optional(squadronValidator),
    llmProvider: v.optional(llmProviderValidator),
    llmModel: v.optional(v.string()),
    tokensUsed: v.optional(v.number()),
    costEstimate: v.optional(v.number()),
    status: v.optional(statusValidator),
    duration: v.optional(v.number()),
    metadata: metadataValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("observabilityEvents", {
      ...args,
      status: args.status || "pending",
      timestamp: Date.now(),
    });
  },
});

/**
 * Batch event ingestion for high-throughput scenarios
 * Optimized for Claude Code hooks that emit multiple events
 */
export const ingestEventsBatch = mutation({
  args: {
    events: v.array(
      v.object({
        sessionId: v.string(),
        sourceApp: sourceAppValidator,
        eventType: eventTypeValidator,
        action: v.string(),
        payload: payloadValidator,
        agentName: v.optional(v.string()),
        squadron: v.optional(squadronValidator),
        llmProvider: v.optional(llmProviderValidator),
        llmModel: v.optional(v.string()),
        tokensUsed: v.optional(v.number()),
        costEstimate: v.optional(v.number()),
        status: v.optional(statusValidator),
        duration: v.optional(v.number()),
        metadata: metadataValidator,
        timestamp: v.optional(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const event of args.events) {
      await ctx.db.insert("observabilityEvents", {
        ...event,
        status: event.status || "pending",
        timestamp: event.timestamp || Date.now(),
      });
    }
  },
});

/**
 * Record UCE neural network activation
 * Tracks all 35 neurons across voice, browser, and LLM routing
 */
export const recordNeuralActivation = mutation({
  args: {
    sessionId: v.string(),
    neuronId: v.string(), // "uce-01" to "uce-35"
    neuronName: v.string(), // "voice-intent-recognition", "browser-state-tracking", etc.
    activationLevel: v.number(), // 0.0 - 1.0
    weight: v.number(),
    context: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("uceNeuralActivations", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

/**
 * Batch neural activation recording
 * Used when multiple neurons fire simultaneously
 */
export const recordNeuralActivationsBatch = mutation({
  args: {
    activations: v.array(
      v.object({
        sessionId: v.string(),
        neuronId: v.string(),
        neuronName: v.string(),
        activationLevel: v.number(),
        weight: v.number(),
        context: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const activation of args.activations) {
      await ctx.db.insert("uceNeuralActivations", {
        ...activation,
        timestamp: Date.now(),
      });
    }
  },
});

/**
 * Update squadron status (3 squadrons: Data, Knowledge, Validation)
 * Each squadron has 9 agents (27 total agents)
 */
export const updateSquadronStatus = mutation({
  args: {
    squadronName: v.string(), // "data", "knowledge", "validation"
    activeAgents: v.number(),
    totalAgents: v.number(), // Always 9 per squadron
    currentTasks: v.array(v.string()),
    performanceScore: v.number(), // 0-100
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("squadronStatus", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

/**
 * Update event status (e.g., mark as completed/failed)
 * Used when async tasks finish
 */
export const updateEventStatus = mutation({
  args: {
    eventId: v.id("observabilityEvents"),
    status: statusValidator,
    duration: v.optional(v.number()),
    metadata: metadataValidator,
  },
  handler: async (ctx, args) => {
    const { eventId, duration, metadata } = args;
    // Cast status to the expected type since validator ensures correctness
    const status = args.status as
      | "pending"
      | "in_progress"
      | "completed"
      | "failed";
    await ctx.db.patch(eventId, {
      status,
      ...(duration !== undefined && { duration }),
      ...(metadata !== undefined && { metadata }),
    });
  },
});

// ============================================================================
// QUERIES - Real-time Data Retrieval
// ============================================================================

/**
 * Get recent events with filtering and pagination
 * Powers the EventTimeline component (auto-scroll chat-style feed)
 */
export const getRecentEvents = query({
  args: {
    orgId: v.optional(v.id("orgs")),
    limit: v.optional(v.number()),
    sessionId: v.optional(v.string()),
    sourceApp: v.optional(sourceAppValidator),
    eventType: v.optional(eventTypeValidator),
    squadron: v.optional(squadronValidator),
    status: v.optional(statusValidator),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    const queryEvents = async () => {
      if (args.orgId) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
          .order("desc")
          .take(limit);
      }
      if (args.sessionId) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_session", (q) =>
            q.eq("sessionId", args.sessionId as string),
          )
          .order("desc")
          .take(limit);
      }
      if (args.sourceApp) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_source", (q) =>
            q.eq("sourceApp", args.sourceApp as typeof args.sourceApp & string),
          )
          .order("desc")
          .take(limit);
      }
      if (args.eventType) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_type", (q) =>
            q.eq("eventType", args.eventType as typeof args.eventType & string),
          )
          .order("desc")
          .take(limit);
      }
      if (args.squadron) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_squadron", (q) =>
            q.eq("squadron", args.squadron as typeof args.squadron & string),
          )
          .order("desc")
          .take(limit);
      }
      return ctx.db
        .query("observabilityEvents")
        .withIndex("by_timestamp")
        .order("desc")
        .take(limit);
    };

    let events = await queryEvents();

    // Post-filter by other criteria when using org index
    if (args.orgId) {
      if (args.sessionId) {
        events = events.filter((e) => e.sessionId === args.sessionId);
      }
      if (args.sourceApp) {
        events = events.filter((e) => e.sourceApp === args.sourceApp);
      }
      if (args.eventType) {
        events = events.filter((e) => e.eventType === args.eventType);
      }
      if (args.squadron) {
        events = events.filter((e) => e.squadron === args.squadron);
      }
    }

    if (args.startTime !== undefined || args.endTime !== undefined) {
      events = events.filter((event) => {
        if (args.startTime !== undefined && event.timestamp < args.startTime)
          return false;
        if (args.endTime !== undefined && event.timestamp > args.endTime)
          return false;
        return true;
      });
    }

    if (args.status) {
      events = events.filter((event) => event.status === args.status);
    }

    return events;
  },
});

/**
 * Get filter options for dropdown menus
 * Returns unique values for sessionId, sourceApp, eventType, squadron
 *
 * Optimized: Uses indexed queries with limited batch sizes and early termination
 * to avoid scanning too many documents.
 */
export const getFilterOptions = query({
  args: {
    orgId: v.optional(v.id("orgs")),
    maxSessions: v.optional(v.number()), // Limit unique sessions (default: 50)
  },
  handler: async (ctx, args) => {
    const maxSessions = args.maxSessions || 50;

    // Use static values for typed enums (sourceApp, eventType, status, squadron)
    // These are known from schema, no need to scan documents
    const sourceApps = [
      "hivemind-v3",
      "voice-controller",
      "browser-validator",
      "llm-router",
      "claude-code",
      "agent-orchestrator",
    ];

    const eventTypes = [
      "VoiceCommand",
      "BrowserAction",
      "LLMRoute",
      "AgentSpawn",
      "NeuralActivation",
      "ToolCall",
      "Error",
      "Metric",
    ];

    const squadrons = ["data", "knowledge", "validation"];

    const statuses = ["pending", "in_progress", "completed", "failed"];

    // Only query for dynamic values (sessionIds) with pagination
    // Query recent events to get unique session IDs
    const fetchRecentEvents = async () => {
      if (args.orgId) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
          .order("desc")
          .take(500);
      }
      return ctx.db
        .query("observabilityEvents")
        .withIndex("by_timestamp")
        .order("desc")
        .take(500);
    };

    const recentEvents = await fetchRecentEvents();

    const sessionIds = new Set<string>();
    for (const event of recentEvents) {
      sessionIds.add(event.sessionId);
      // Early termination once we have enough unique sessions
      if (sessionIds.size >= maxSessions) break;
    }

    return {
      sessionIds: Array.from(sessionIds).sort(),
      sourceApps,
      eventTypes,
      squadrons,
      statuses,
    };
  },
});

/**
 * Get UCE neural network state (35 neurons)
 * Powers the NeuralNetworkViz Heatmap component
 *
 * Note: uceNeuralActivations table doesn't have orgId yet.
 * For now, orgId is accepted but filtering is done via sessionId lookup.
 */
export const getNeuralNetworkState = query({
  args: {
    orgId: v.optional(v.id("orgs")),
    sessionId: v.optional(v.string()),
    neuronId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;

    const fetchActivations = async () => {
      if (args.sessionId) {
        return ctx.db
          .query("uceNeuralActivations")
          .withIndex("by_session", (q) =>
            q.eq("sessionId", args.sessionId as string),
          )
          .order("desc")
          .take(limit);
      }
      if (args.neuronId) {
        return ctx.db
          .query("uceNeuralActivations")
          .withIndex("by_neuron", (q) =>
            q.eq("neuronId", args.neuronId as string),
          )
          .order("desc")
          .take(limit);
      }
      return ctx.db
        .query("uceNeuralActivations")
        .withIndex("by_timestamp")
        .order("desc")
        .take(limit);
    };

    const activations = await fetchActivations();

    // Aggregate latest activation per neuron
    const neuronMap = new Map<string, (typeof activations)[0]>();

    for (const activation of activations) {
      if (!neuronMap.has(activation.neuronId)) {
        neuronMap.set(activation.neuronId, activation);
      }
    }

    return {
      activations: Array.from(neuronMap.values()),
      totalNeurons: 35,
      activeNeurons: neuronMap.size,
    };
  },
});

/**
 * Get squadron metrics (3 squadrons × 9 agents each = 27 total)
 * Powers the SquadronPanel RadialGauge component
 */
export const getSquadronMetrics = query({
  args: {
    orgId: v.optional(v.id("orgs")),
    squadronName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const fetchStatuses = async () => {
      if (args.squadronName) {
        return ctx.db
          .query("squadronStatus")
          .withIndex("by_squadron", (q) =>
            q.eq("squadronName", args.squadronName as string),
          )
          .order("desc")
          .take(100);
      }
      return ctx.db
        .query("squadronStatus")
        .withIndex("by_timestamp")
        .order("desc")
        .take(100);
    };

    const statuses = await fetchStatuses();

    const squadronMap = new Map<string, (typeof statuses)[0]>();

    for (const status of statuses) {
      if (!squadronMap.has(status.squadronName)) {
        squadronMap.set(status.squadronName, status);
      }
    }

    const squadrons = Array.from(squadronMap.values());

    return {
      squadrons,
      totalSquadrons: 3,
      totalAgents: squadrons.reduce((sum, s) => sum + s.totalAgents, 0),
      activeAgents: squadrons.reduce((sum, s) => sum + s.activeAgents, 0),
      avgPerformanceScore:
        squadrons.length > 0
          ? squadrons.reduce((sum, s) => sum + s.performanceScore, 0) /
            squadrons.length
          : 0,
    };
  },
});

/**
 * Get LLM cost metrics breakdown
 * Powers the CostTracker BarChart component
 */
export const getLLMCostMetrics = query({
  args: {
    orgId: v.optional(v.id("orgs")),
    sessionId: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const fetchEvents = async () => {
      if (args.orgId) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
          .order("desc")
          .take(1000);
      }
      if (args.sessionId) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_session", (q) =>
            q.eq("sessionId", args.sessionId as string),
          )
          .take(1000);
      }
      return ctx.db
        .query("observabilityEvents")
        .withIndex("by_timestamp")
        .take(1000);
    };

    let events = await fetchEvents();

    // Filter by time range
    if (args.startTime !== undefined || args.endTime !== undefined) {
      events = events.filter((event) => {
        if (args.startTime !== undefined && event.timestamp < args.startTime)
          return false;
        if (args.endTime !== undefined && event.timestamp > args.endTime)
          return false;
        return true;
      });
    }

    // Filter to only events with LLM data
    const llmEvents = events.filter(
      (e): e is typeof e & { llmProvider: string; tokensUsed: number } =>
        e.llmProvider !== undefined && e.tokensUsed !== undefined,
    );

    // Aggregate by provider
    const providerStats = new Map<
      string,
      {
        provider: string;
        totalTokens: number;
        totalCost: number;
        requestCount: number;
        avgTokensPerRequest: number;
      }
    >();

    for (const event of llmEvents) {
      const provider = event.llmProvider;

      if (!providerStats.has(provider)) {
        providerStats.set(provider, {
          provider,
          totalTokens: 0,
          totalCost: 0,
          requestCount: 0,
          avgTokensPerRequest: 0,
        });
      }

      const stats = providerStats.get(provider);
      if (stats) {
        stats.totalTokens += event.tokensUsed;
        stats.totalCost += event.costEstimate || 0;
        stats.requestCount += 1;
      }
    }

    // Calculate averages
    for (const stats of providerStats.values()) {
      stats.avgTokensPerRequest = stats.totalTokens / stats.requestCount;
    }

    const breakdown = Array.from(providerStats.values());

    return {
      breakdown,
      totalCost: breakdown.reduce((sum, s) => sum + s.totalCost, 0),
      totalTokens: breakdown.reduce((sum, s) => sum + s.totalTokens, 0),
      totalRequests: breakdown.reduce((sum, s) => sum + s.requestCount, 0),
    };
  },
});

/**
 * Get session summary for a specific session
 * Useful for session replay and debugging
 */
export const getSessionSummary = query({
  args: {
    orgId: v.optional(v.id("orgs")),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const fetchEvents = async () => {
      if (args.orgId) {
        const orgEvents = await ctx.db
          .query("observabilityEvents")
          .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
          .collect();
        return orgEvents.filter((e) => e.sessionId === args.sessionId);
      }
      return ctx.db
        .query("observabilityEvents")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    };

    const events = await fetchEvents();

    const neuralActivations = await ctx.db
      .query("uceNeuralActivations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    const eventsByType = new Map<string, number>();
    const eventsByStatus = new Map<string, number>();
    let totalDuration = 0;
    let totalCost = 0;
    let totalTokens = 0;

    for (const event of events) {
      eventsByType.set(
        event.eventType,
        (eventsByType.get(event.eventType) || 0) + 1,
      );
      eventsByStatus.set(
        event.status,
        (eventsByStatus.get(event.status) || 0) + 1,
      );

      if (event.duration) totalDuration += event.duration;
      if (event.costEstimate) totalCost += event.costEstimate;
      if (event.tokensUsed) totalTokens += event.tokensUsed;
    }

    return {
      sessionId: args.sessionId,
      totalEvents: events.length,
      eventsByType: Object.fromEntries(eventsByType),
      eventsByStatus: Object.fromEntries(eventsByStatus),
      neuralActivations: neuralActivations.length,
      uniqueNeurons: new Set(neuralActivations.map((a) => a.neuronId)).size,
      totalDuration,
      totalCost,
      totalTokens,
      startTime:
        events.length > 0 ? Math.min(...events.map((e) => e.timestamp)) : null,
      endTime:
        events.length > 0 ? Math.max(...events.map((e) => e.timestamp)) : null,
    };
  },
});

/**
 * Get active sessions (sessions with events in last 5 minutes)
 * Powers the session selector dropdown
 */
export const getActiveSessions = query({
  args: {
    orgId: v.optional(v.id("orgs")),
  },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const fetchRecentEvents = async () => {
      if (args.orgId) {
        return ctx.db
          .query("observabilityEvents")
          .withIndex("by_org_ts", (q) => q.eq("orgId", args.orgId))
          .order("desc")
          .take(1000);
      }
      return ctx.db
        .query("observabilityEvents")
        .withIndex("by_timestamp")
        .order("desc")
        .take(1000);
    };

    const recentEvents = await fetchRecentEvents();

    const activeSessionIds = new Set<string>();

    for (const event of recentEvents) {
      if (event.timestamp >= fiveMinutesAgo) {
        activeSessionIds.add(event.sessionId);
      }
    }

    return Array.from(activeSessionIds).sort();
  },
});
