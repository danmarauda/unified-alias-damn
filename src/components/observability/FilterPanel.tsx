"use client";

import type { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface FilterState {
  sessionId?: string;
  sourceApp?: string;
  eventType?: string;
  squadron?: string;
  status?: string;
}

interface FilterPanelProps {
  orgId?: Id<"orgs">;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function FilterPanel({ orgId, filters, onChange }: FilterPanelProps) {
  // Fetch available filter options
  const filterOptions = useQuery(api.observability.getFilterOptions, { orgId });
  const activeSessions = useQuery(api.observability.getActiveSessions, {
    orgId,
  });

  if (!filterOptions) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        Loading filters...
      </div>
    );
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Session ID Selector */}
      <FilterSelect
        label="Session"
        value={filters.sessionId || "all"}
        onChange={(value) => handleFilterChange("sessionId", value)}
        options={[
          { value: "all", label: "All Sessions" },
          ...(activeSessions || []).map((id) => ({
            value: id,
            label: id.slice(0, 12) + "...",
          })),
        ]}
        icon="🔗"
      />

      {/* Source App Filter */}
      <FilterSelect
        label="Source"
        value={filters.sourceApp || "all"}
        onChange={(value) => handleFilterChange("sourceApp", value)}
        options={[
          { value: "all", label: "All Sources" },
          ...filterOptions.sourceApps.map((app) => ({
            value: app,
            label: app.replace(/-/g, " "),
          })),
        ]}
        icon="📱"
      />

      {/* Event Type Filter */}
      <FilterSelect
        label="Event Type"
        value={filters.eventType || "all"}
        onChange={(value) => handleFilterChange("eventType", value)}
        options={[
          { value: "all", label: "All Types" },
          ...filterOptions.eventTypes.map((type) => ({
            value: type,
            label: type,
          })),
        ]}
        icon="🎯"
      />

      {/* Squadron Filter */}
      <FilterSelect
        label="Squadron"
        value={filters.squadron || "all"}
        onChange={(value) => handleFilterChange("squadron", value)}
        options={[
          { value: "all", label: "All Squadrons" },
          ...filterOptions.squadrons.map((squadron) => ({
            value: squadron,
            label: squadron.charAt(0).toUpperCase() + squadron.slice(1),
          })),
        ]}
        icon="🚀"
      />

      {/* Status Filter */}
      <FilterSelect
        label="Status"
        value={filters.status || "all"}
        onChange={(value) => handleFilterChange("status", value)}
        options={[
          { value: "all", label: "All Statuses" },
          ...filterOptions.statuses.map((status) => ({
            value: status,
            label: status.replace(/_/g, " "),
          })),
        ]}
        icon="📊"
      />

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}

/**
 * FilterSelect - Individual filter dropdown
 */
function FilterSelect({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
