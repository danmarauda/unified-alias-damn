// biome-ignore lint/style/useFilenamingConvention: Dashboard components follow existing naming.
"use client";

import { Activity, AlertCircle, Bot, Brain, Check, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useStats } from "@/lib/hooks/use-stats";

export function AgentActivities() {
  const { data, isLoading } = useStats();

  // Use real data only - no mock fallbacks
  const activities = data?.agentActivities || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          Agent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton className="h-12 w-full" key={i} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No agent activity"
            description="Agent activities will appear here once agents start working."
            variant="compact"
          />
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => (
              <div
                className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-background"
                key={activity._id}
              >
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="mr-2 font-medium text-sm">
                        {activity.agent}
                      </span>
                      {getStatusIcon(activity.status)}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {activity.action}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs">
                    {activity.timestamp}
                  </p>
                  <p className="text-xs">{activity.project}</p>
                </div>
              </div>
            ))}

            <div className="mt-3 border-border border-t pt-3">
              <Link
                className="text-primary text-xs hover:underline"
                href="/agents"
              >
                View all agent activities
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
