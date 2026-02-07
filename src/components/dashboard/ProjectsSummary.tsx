"use client";

import { AlertTriangle, BarChart3, CheckCircle, Clock, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useStats } from "@/lib/hooks/use-stats";

export function ProjectsSummary() {
  const { data, isLoading, error } = useStats();

  // Use real data only - no mock fallbacks
  const projects = {
    active: isLoading ? 0 : (data?.projects?.active ?? 0),
    completed: isLoading ? 0 : (data?.projects?.completed ?? 0),
    pending: isLoading ? 0 : (data?.projects?.pending ?? 0),
    issues: isLoading ? 0 : (data?.projects?.issues ?? 0),
  };

  // Calculate percentage for progress bar (handle division by zero)
  const total = projects.active + projects.completed + projects.pending;
  const hasData = total > 0;
  const completedPercentage = hasData ? (projects.completed / total) * 100 : 0;
  const activePercentage = hasData ? (projects.active / total) * 100 : 0;
  const pendingPercentage = hasData ? (projects.pending / total) * 100 : 0;

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
          Project Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-16 w-1/4" />
              <Skeleton className="h-16 w-1/4" />
              <Skeleton className="h-16 w-1/4" />
              <Skeleton className="h-16 w-1/4" />
            </div>
          </div>
        ) : !hasData ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects yet"
            description="Project summary will appear here once projects are created."
            variant="compact"
          />
        ) : (
          <>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="flex h-full">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${completedPercentage}%` }}
                />
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${activePercentage}%` }}
                />
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${pendingPercentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="flex flex-col items-center p-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="font-medium text-lg">{projects.active}</span>
                <span className="text-muted-foreground text-xs">Active</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span className="font-medium text-lg">
                  {projects.completed}
                </span>
                <span className="text-muted-foreground text-xs">Completed</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="font-medium text-lg">{projects.pending}</span>
                <span className="text-muted-foreground text-xs">Pending</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="font-medium text-lg">{projects.issues}</span>
                <span className="text-muted-foreground text-xs">Issues</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
