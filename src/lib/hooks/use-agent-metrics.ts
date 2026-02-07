"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useAgentMetrics() {
  const data = useQuery(api.agentMetrics.getAgentMetrics);

  return {
    data,
    isLoading: data === undefined,
    error: null,
  };
}
