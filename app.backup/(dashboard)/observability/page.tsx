"use client";

import { useState } from "react";
import { PlaygroundTile } from "@/app/components/observability/PlaygroundTile";
import { EventTimeline } from "@/app/components/observability/EventTimeline";
import { SquadronPanel } from "@/app/components/observability/SquadronPanel";
import { NeuralNetworkViz } from "@/app/components/observability/NeuralNetworkViz";
import { CostTracker } from "@/app/components/observability/CostTracker";
import { FilterPanel, type FilterState } from "@/app/components/observability/FilterPanel";

/**
 * ALIAS Hivemind V3 Observability Dashboard
 *
 * Real-time multi-agent observability for BIG 3 SUPER AGENT:
 * - Voice Controller (OpenAI Realtime API)
 * - Browser Validator (Gemini 2.5 Flash)
 * - Multi-LLM Router (OpenAI, Gemini, Claude)
 *
 * Features:
 * - Real-time event timeline (auto-scroll chat-style feed)
 * - Squadron status (27 agents across 3 squadrons)
 * - UCE neural network visualization (35 neurons)
 * - LLM cost tracking and breakdown
 * - Comprehensive filtering controls
 *
 * Layout inspired by LiveKit agents-playground multi-panel design.
 */

export default function ObservabilityDashboard() {
  const [filters, setFilters] = useState<FilterState>({});

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              🧠 ALIAS Hivemind V3 Observability
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Real-time monitoring for BIG 3 SUPER AGENT (Voice + Browser + Multi-LLM)
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4">
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>
      </header>

      {/* Main Content - 3-Column Layout (LiveKit Pattern) */}
      <main className="flex-1 overflow-hidden p-6 gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Event Timeline + Cost Tracker */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <PlaygroundTile
            title="Event Timeline"
            subtitle="Real-time event stream"
            className="flex-1"
          >
            <EventTimeline
              sessionId={filters.sessionId}
              sourceApp={filters.sourceApp}
              eventType={filters.eventType}
              squadron={filters.squadron}
              status={filters.status}
              limit={100}
            />
          </PlaygroundTile>

          <PlaygroundTile title="Cost Tracking" subtitle="LLM cost breakdown" className="h-96">
            <CostTracker sessionId={filters.sessionId} />
          </PlaygroundTile>
        </div>

        {/* Middle Column: Squadron Status */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <PlaygroundTile
            title="Squadron Status"
            subtitle="27 agents across 3 squadrons"
            className="flex-1"
          >
            <SquadronPanel />
          </PlaygroundTile>
        </div>

        {/* Right Column: Neural Network Visualization */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <PlaygroundTile
            title="UCE Neural Network"
            subtitle="35 neurons across 6 layers"
            className="flex-1"
          >
            <NeuralNetworkViz sessionId={filters.sessionId} />
          </PlaygroundTile>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-6">
            <span>💡 Multi-LLM routing saves 70% on costs</span>
            <span>🚀 27 agents coordinated across 3 squadrons</span>
            <span>🧠 35 UCE neurons for intelligent orchestration</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a
              href="https://www.convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Convex
            </a>
            <span>+</span>
            <a
              href="https://reaviz.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              Reaviz
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
