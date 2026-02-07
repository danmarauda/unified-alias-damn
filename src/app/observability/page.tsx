"use client";

import { useState } from "react";
import { PlaygroundTile } from "@/components/observability/PlaygroundTile";
import { EventTimeline } from "@/components/observability/EventTimeline";
import { SquadronPanel } from "@/components/observability/SquadronPanel";
import { NeuralNetworkViz } from "@/components/observability/NeuralNetworkViz";
import { CostTracker } from "@/components/observability/CostTracker";
import {
  FilterPanel,
  type FilterState,
} from "@/components/observability/FilterPanel";
import { useOrg } from "@/lib/contexts/org-context";

export default function ObservabilityDashboard() {
  const { orgId, orgName, isLoading } = useOrg();
  const [filters, setFilters] = useState<FilterState>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              🧠 ALIAS AEOS Observability
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {orgName
                ? `${orgName} - Real-time monitoring`
                : "Real-time monitoring for BIG 3 SUPER AGENT"}
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4">
            {orgName && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {orgName}
                </span>
              </div>
            )}
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
          <FilterPanel
            orgId={orgId ?? undefined}
            filters={filters}
            onChange={setFilters}
          />
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
              orgId={orgId ?? undefined}
              sessionId={filters.sessionId}
              sourceApp={filters.sourceApp}
              eventType={filters.eventType}
              squadron={filters.squadron}
              status={filters.status}
              limit={100}
            />
          </PlaygroundTile>

          <PlaygroundTile
            title="Cost Tracking"
            subtitle="LLM cost breakdown"
            className="h-96"
          >
            <CostTracker
              orgId={orgId ?? undefined}
              sessionId={filters.sessionId}
            />
          </PlaygroundTile>
        </div>

        {/* Middle Column: Squadron Status */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <PlaygroundTile
            title="Squadron Status"
            subtitle="27 agents across 3 squadrons"
            className="flex-1"
          >
            <SquadronPanel orgId={orgId ?? undefined} />
          </PlaygroundTile>
        </div>

        {/* Right Column: Neural Network Visualization */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <PlaygroundTile
            title="UCE Neural Network"
            subtitle="35 neurons across 6 layers"
            className="flex-1"
          >
            <NeuralNetworkViz
              orgId={orgId ?? undefined}
              sessionId={filters.sessionId}
            />
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
