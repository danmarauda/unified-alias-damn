"use client";

import { Activity, ArrowRight, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/lib/hooks/use-stats";

// Dynamically import the Globe component with no SSR
const Globe = dynamic(() => import("@/components/ui/globe/Globe"), {
  ssr: false,
});

export function LiveFeed() {
  const { data, isLoading, error } = useStats();
  const [isGlobeLoading, setIsGlobeLoading] = useState(true);

  // Handle Globe loaded event
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlobeLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Prepare activity points data for the Globe
  const activityPoints = data?.projectActivities || [];

  return (
    <Card className="h-full overflow-hidden border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Global Project Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-0">
        {(isLoading || isGlobeLoading) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
            <div className="flex flex-col items-center">
              <RefreshCw className="mb-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">
                Loading visualization...
              </p>
            </div>
          </div>
        )}

        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Globe points={activityPoints} />
        </div>

        <div className="border-border border-t p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-sm">Recent Activities</h4>
            <p className="flex items-center text-muted-foreground text-xs">
              <RefreshCw className="mr-1 h-3 w-3" /> Live updates
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton className="h-6 w-full" key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(data?.recentActivities || [])
                .slice(0, 3)
                .map((activity, idx) => (
                  <div
                    className="flex items-center justify-between text-xs"
                    key={idx}
                  >
                    <span className="flex items-center">
                      <span
                        className="mr-2 h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            activity.type === "development"
                              ? "var(--primary)"
                              : activity.type === "testing"
                                ? "var(--chart-2)"
                                : activity.type === "deployment"
                                  ? "var(--chart-3)"
                                  : "var(--chart-4)",
                        }}
                      />
                      {activity.action}
                    </span>
                    <span className="text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-4 text-right">
            <Link
              className="flex items-center justify-end text-primary text-xs hover:underline"
              href="/projects/activities"
            >
              View all activities <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
