"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useStats() {
  const data = useQuery(api.stats.getStats);

  return {
    data,
    isLoading: data === undefined,
    error: null,
    refetch: () => {
      /* Convex automatically handles real-time updates. */
    },
  };
}
