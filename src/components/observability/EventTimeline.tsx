"use client";

import type { Id } from "../../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  orgId?: Id<"orgs">;
  sessionId?: string;
  sourceApp?: string;
  eventType?: string;
  squadron?: string;
  status?: string;
  limit?: number;
}

export function EventTimeline({
  orgId,
  sessionId,
  sourceApp,
  eventType,
  squadron,
  status,
  limit = 100,
}: EventTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time events
  const events = useQuery(api.observability.getRecentEvents, {
    orgId,
    sessionId,
    sourceApp: sourceApp as
      | "hivemind-v3"
      | "voice-controller"
      | "browser-validator"
      | "llm-router"
      | "claude-code"
      | "agent-orchestrator"
      | undefined,
    eventType: eventType as
      | "VoiceCommand"
      | "BrowserAction"
      | "LLMRoute"
      | "AgentSpawn"
      | "NeuralActivation"
      | "ToolCall"
      | "Error"
      | "Metric"
      | undefined,
    squadron: squadron as "data" | "knowledge" | "validation" | undefined,
    status: status as
      | "pending"
      | "in_progress"
      | "completed"
      | "failed"
      | undefined,
    limit,
  });

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  if (!events) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading events...
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
        <div className="text-4xl">📡</div>
        <p className="text-sm">No events yet</p>
        <p className="text-xs text-gray-400">
          Events will appear here in real-time
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto space-y-2"
      style={{ scrollBehavior: "smooth" }}
    >
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}

/**
 * EventCard - Individual event display
 */
function EventCard({ event }: { event: any }) {
  const eventTypeColors: Record<string, string> = {
    VoiceCommand: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    BrowserAction: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    LLMRoute: "bg-green-500/10 text-green-600 dark:text-green-400",
    AgentSpawn: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    NeuralActivation: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    ToolUse: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    SessionStart: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    SessionEnd: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  };

  const statusIcons: Record<string, string> = {
    pending: "⏳",
    in_progress: "⚙️",
    completed: "✅",
    failed: "❌",
  };

  const llmProviderColors: Record<string, string> = {
    openai: "bg-green-500 text-white",
    gemini: "bg-blue-500 text-white",
    claude: "bg-purple-500 text-white",
  };

  const timestamp = new Date(event.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Event Type Badge */}
          <span
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap",
              eventTypeColors[event.eventType] ||
                "bg-gray-500/10 text-gray-600",
            )}
          >
            {event.eventType}
          </span>

          {/* Squadron Badge */}
          {event.squadron && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
              {event.squadron}
            </span>
          )}

          {/* LLM Provider Badge */}
          {event.llmProvider && (
            <span
              className={cn(
                "px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap",
                llmProviderColors[event.llmProvider] ||
                  "bg-gray-500 text-white",
              )}
            >
              {event.llmProvider}
              {event.llmModel && ` ${event.llmModel.split("-").pop()}`}
            </span>
          )}
        </div>

        {/* Status and Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          <span>{statusIcons[event.status] || "❓"}</span>
          <span>{timestamp}</span>
        </div>
      </div>

      {/* Action */}
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {event.agentName && (
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {event.agentName}:{" "}
          </span>
        )}
        {event.action}
      </div>

      {/* Metrics */}
      {(event.duration || event.tokensUsed || event.costEstimate) && (
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          {event.duration && <span>⏱️ {event.duration}ms</span>}
          {event.tokensUsed && (
            <span>🔤 {event.tokensUsed.toLocaleString()} tokens</span>
          )}
          {event.costEstimate && (
            <span>💰 ${event.costEstimate.toFixed(4)}</span>
          )}
        </div>
      )}
    </div>
  );
}
