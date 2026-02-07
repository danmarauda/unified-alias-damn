"use client";

import { BarChart, CircleUser, Code, Database, Server } from "lucide-react";
import { Counter } from "@/components/ui/Counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStats } from "@/lib/hooks/use-stats";

export function NetworkOverview() {
  const { data, isLoading } = useStats();

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <BarChart className="mr-2 h-5 w-5 text-primary" />
          System Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col items-center p-2">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CircleUser className="h-6 w-6" />
                </div>
                <Counter
                  className="font-medium text-xl"
                  value={data?.metrics?.activeUsers ?? 0}
                />
                <span className="mt-1 text-center text-muted-foreground text-xs">
                  Active Users
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col items-center p-2">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Database className="h-6 w-6" />
                </div>
                <Counter
                  className="font-medium text-xl"
                  value={data?.metrics?.ontologyEntities ?? 0}
                />
                <span className="mt-1 text-center text-muted-foreground text-xs">
                  Ontology Entities
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col items-center p-2">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Code className="h-6 w-6" />
                </div>
                <Counter
                  className="font-medium text-xl"
                  value={data?.metrics?.componentsGenerated ?? 0}
                />
                <span className="mt-1 text-center text-muted-foreground text-xs">
                  Components
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col items-center p-2">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Server className="h-6 w-6" />
                </div>
                <Counter
                  className="font-medium text-xl"
                  value={data?.metrics?.aiAgents ?? 0}
                />
                <span className="mt-1 text-center text-muted-foreground text-xs">
                  AI Agents
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
