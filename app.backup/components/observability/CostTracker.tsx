"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarChart, BarSeries, Bar } from "reaviz";

/**
 * CostTracker - LLM Cost Breakdown Visualization
 *
 * Displays cost metrics across OpenAI, Gemini, Claude:
 * - Total cost per provider (horizontal bar chart)
 * - Token usage statistics
 * - Request counts
 * - Cost per request averages
 * - Real-time updates via Convex subscriptions
 */

interface CostTrackerProps {
  sessionId?: string;
  startTime?: number;
  endTime?: number;
}

export function CostTracker({
  sessionId,
  startTime,
  endTime,
}: CostTrackerProps) {
  // Subscribe to real-time cost metrics
  const costMetrics = useQuery(api.observability.getLLMCostMetrics, {
    sessionId,
    startTime,
    endTime,
  });

  if (!costMetrics) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading cost metrics...
      </div>
    );
  }

  if (costMetrics.breakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
        <div className="text-4xl">💰</div>
        <p className="text-sm">No cost data yet</p>
        <p className="text-xs text-gray-400">LLM costs will appear here</p>
      </div>
    );
  }

  const providerColors: Record<string, string> = {
    openai: "#10b981", // green
    gemini: "#3b82f6", // blue
    claude: "#8b5cf6", // purple
  };

  const providerIcons: Record<string, string> = {
    openai: "🤖",
    gemini: "💎",
    claude: "🧠",
  };

  // Transform data for bar chart
  const chartData = costMetrics.breakdown.map((provider) => ({
    key: provider.provider,
    data: provider.totalCost,
  }));

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${costMetrics.totalCost.toFixed(4)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Cost</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {costMetrics.totalTokens.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total Tokens</div>
        </div>

        <div className="flex flex-col items-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {costMetrics.totalRequests}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Requests</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 flex items-center justify-center">
        <BarChart
          width={400}
          height={200}
          data={chartData}
          series={
            <BarSeries
              colorScheme={(data) => providerColors[data.key as string] || "#6b7280"}
              bar={<Bar gradient={false} />}
            />
          }
        />
      </div>

      {/* Provider Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Provider Breakdown
        </h4>

        {costMetrics.breakdown.map((provider) => (
          <div
            key={provider.provider}
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          >
            {/* Icon */}
            <div className="text-3xl">
              {providerIcons[provider.provider] || "🤖"}
            </div>

            {/* Provider Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {provider.provider}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ color: providerColors[provider.provider] }}
                >
                  ${provider.totalCost.toFixed(4)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>🔤 {provider.totalTokens.toLocaleString()} tokens</span>
                <span>📊 {provider.requestCount} requests</span>
                <span>⚡ {provider.avgTokensPerRequest.toFixed(0)} tokens/req</span>
              </div>
            </div>

            {/* Cost Bar */}
            <div className="w-32">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${(provider.totalCost / costMetrics.totalCost) * 100}%`,
                    backgroundColor: providerColors[provider.provider],
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">
                {((provider.totalCost / costMetrics.totalCost) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cost Insights */}
      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <span className="text-xl">💡</span>
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            <strong>Cost Optimization:</strong> Using multi-LLM routing can reduce costs
            by 70%. Route simple tasks to Gemini Flash ($1/M tokens) and complex tasks to
            GPT-4o or Claude.
          </div>
        </div>
      </div>
    </div>
  );
}
