"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RadialGauge, RadialGaugeSeries } from "reaviz";

/**
 * SquadronPanel - Squadron status visualization
 *
 * Displays 3 squadrons (Data, Knowledge, Validation) with:
 * - RadialGauge for performance score (0-100)
 * - Active agents count (out of 9 per squadron)
 * - Current tasks list
 * - Real-time updates via Convex subscriptions
 */

interface SquadronPanelProps {
  squadronName?: string;
}

export function SquadronPanel({ squadronName }: SquadronPanelProps) {
  // Subscribe to real-time squadron metrics
  const metrics = useQuery(api.observability.getSquadronMetrics, {
    squadronName,
  });

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading squadron metrics...
      </div>
    );
  }

  if (metrics.squadrons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
        <div className="text-4xl">🚀</div>
        <p className="text-sm">No squadron data yet</p>
      </div>
    );
  }

  const squadronColors: Record<string, string> = {
    data: "#3b82f6", // blue
    knowledge: "#8b5cf6", // purple
    validation: "#10b981", // green
  };

  const squadronIcons: Record<string, string> = {
    data: "📊",
    knowledge: "🧠",
    validation: "✅",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {metrics.squadrons.map((squadron) => (
        <SquadronCard
          key={squadron.squadronName}
          squadron={squadron}
          color={squadronColors[squadron.squadronName] || "#6b7280"}
          icon={squadronIcons[squadron.squadronName] || "🤖"}
        />
      ))}
    </div>
  );
}

/**
 * SquadronCard - Individual squadron visualization
 */
function SquadronCard({
  squadron,
  color,
  icon,
}: {
  squadron: any;
  color: string;
  icon: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h4 className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100">
            {squadron.squadronName}
          </h4>
        </div>
        <div className="flex flex-col items-end text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {squadron.activeAgents}/{squadron.totalAgents}
          </span>
          <span>agents active</span>
        </div>
      </div>

      {/* RadialGauge for Performance Score */}
      <div className="flex items-center justify-center h-48">
        <RadialGauge
          height={180}
          width={180}
          data={[{ key: "score", data: squadron.performanceScore }]}
          minValue={0}
          maxValue={100}
          series={
            <RadialGaugeSeries
              colorScheme={[color]}
              arcWidth={20}
              animated
            />
          }
        />
      </div>

      {/* Performance Score Label */}
      <div className="text-center">
        <div className="text-3xl font-bold" style={{ color }}>
          {squadron.performanceScore.toFixed(1)}%
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Performance Score
        </div>
      </div>

      {/* Current Tasks */}
      {squadron.currentTasks && squadron.currentTasks.length > 0 && (
        <div className="mt-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Tasks:
          </h5>
          <div className="flex flex-wrap gap-1">
            {squadron.currentTasks.map((task: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {task}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
        Updated {new Date(squadron.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
