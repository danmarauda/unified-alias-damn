"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Heatmap, HeatmapSeries, HeatmapCell } from "reaviz";
import chroma from "chroma-js";

/**
 * NeuralNetworkViz - UCE Neural Network Heatmap
 *
 * Visualizes all 35 UCE neurons across the neural layer:
 * - Rows: Neuron categories (Voice, Browser, LLM, Core)
 * - Columns: Individual neurons within each category
 * - Color intensity: Activation level (0.0 - 1.0)
 * - Real-time updates via Convex subscriptions
 */

interface NeuralNetworkVizProps {
  sessionId?: string;
}

// UCE Neuron Organization (35 total neurons)
const NEURON_CATEGORIES = {
  Voice: [
    { id: "uce-01", name: "voice-intent-recognition" },
    { id: "uce-02", name: "speech-to-text-quality" },
    { id: "uce-03", name: "voice-command-parsing" },
    { id: "uce-04", name: "audio-noise-filtering" },
    { id: "uce-05", name: "voice-emotion-detection" },
  ],
  Browser: [
    { id: "uce-06", name: "browser-state-tracking" },
    { id: "uce-07", name: "dom-manipulation-safety" },
    { id: "uce-08", name: "screenshot-analysis" },
    { id: "uce-09", name: "element-detection" },
    { id: "uce-10", name: "page-load-timing" },
  ],
  LLM: [
    { id: "uce-11", name: "multi-llm-coordination" },
    { id: "uce-12", name: "cost-optimization" },
    { id: "uce-13", name: "latency-monitoring" },
    { id: "uce-14", name: "context-window-management" },
    { id: "uce-15", name: "response-quality-scoring" },
  ],
  Agents: [
    { id: "uce-16", name: "agent-lifecycle-management" },
    { id: "uce-17", name: "task-decomposition" },
    { id: "uce-18", name: "squadron-coordination" },
    { id: "uce-19", name: "memory-sharing" },
    { id: "uce-20", name: "conflict-resolution" },
  ],
  Core: [
    { id: "uce-21", name: "pattern-recognition" },
    { id: "uce-22", name: "error-detection" },
    { id: "uce-23", name: "performance-monitoring" },
    { id: "uce-24", name: "security-validation" },
    { id: "uce-25", name: "data-flow-tracking" },
    { id: "uce-26", name: "adaptive-learning" },
    { id: "uce-27", name: "context-maintenance" },
    { id: "uce-28", name: "task-prioritization" },
    { id: "uce-29", name: "resource-allocation" },
  ],
  Integration: [
    { id: "uce-30", name: "cross-system-sync" },
    { id: "uce-31", name: "event-correlation" },
    { id: "uce-32", name: "metric-aggregation" },
    { id: "uce-33", name: "anomaly-detection" },
    { id: "uce-34", name: "feedback-loop-processing" },
    { id: "uce-35", name: "orchestration-control" },
  ],
};

export function NeuralNetworkViz({ sessionId }: NeuralNetworkVizProps) {
  // Subscribe to real-time neural network state
  const neuralState = useQuery(api.observability.getNeuralNetworkState, {
    sessionId,
    limit: 200,
  });

  if (!neuralState) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading neural network...
      </div>
    );
  }

  // Build activation map
  const activationMap = new Map<string, number>();
  neuralState.activations.forEach((activation) => {
    activationMap.set(activation.neuronId, activation.activationLevel);
  });

  // Transform data for heatmap
  const heatmapData = Object.entries(NEURON_CATEGORIES).flatMap(
    ([category, neurons]) =>
      neurons.map((neuron) => ({
        key: neuron.id,
        data: activationMap.get(neuron.id) || 0,
        metadata: {
          category,
          name: neuron.name,
        },
      }))
  );

  // Color scale: blue (inactive) to red (highly active)
  const colorScale = chroma.scale(["#3b82f6", "#10b981", "#eab308", "#ef4444"]).colors(10);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Neurons"
          value={neuralState.totalNeurons}
          icon="🧠"
          color="blue"
        />
        <StatCard
          label="Active Neurons"
          value={neuralState.activeNeurons}
          icon="⚡"
          color="green"
        />
        <StatCard
          label="Activation Rate"
          value={`${((neuralState.activeNeurons / neuralState.totalNeurons) * 100).toFixed(1)}%`}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Neural Network Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(NEURON_CATEGORIES).map(([category, neurons]) => (
            <div
              key={category}
              className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {category} Layer ({neurons.length} neurons)
              </h4>

              <div className="space-y-2">
                {neurons.map((neuron) => {
                  const activation = activationMap.get(neuron.id) || 0;
                  const colorIndex = Math.min(
                    Math.floor(activation * 10),
                    colorScale.length - 1
                  );
                  const bgColor = colorScale[colorIndex];

                  return (
                    <div
                      key={neuron.id}
                      className="flex items-center gap-2"
                      title={`${neuron.name}: ${(activation * 100).toFixed(1)}%`}
                    >
                      <div
                        className="w-16 h-6 rounded flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: bgColor }}
                      >
                        {(activation * 100).toFixed(0)}%
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {neuron.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale[0] }} />
          <span>Inactive (0%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale[4] }} />
          <span>Low (40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale[7] }} />
          <span>Medium (70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colorScale[9] }} />
          <span>High (100%)</span>
        </div>
      </div>
    </div>
  );
}

/**
 * StatCard - Metric display card
 */
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: "blue" | "green" | "purple";
}) {
  const colors = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className={`text-3xl p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      <div className="flex flex-col">
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </div>
  );
}
