"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { useStats } from "@/lib/hooks/use-stats";

// Dynamically import the Globe component with no SSR
const Globe = dynamic(() => import("@/components/ui/globe/Globe"), {
  ssr: false,
});

export default function GlobalProjectActivities() {
  const { data, isLoading } = useStats();

  return (
    <div className="flex h-screen w-full flex-col p-4 md:p-6">
      <Card className="flex flex-1 flex-col overflow-hidden border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center font-normal text-base">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Global Project Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="relative flex flex-1 p-0">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
              <div className="flex flex-col items-center">
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-muted-foreground text-sm">
                  Loading visualization...
                </p>
              </div>
            </div>
          )}
          
          <div className="relative flex w-full flex-1 overflow-hidden">
            <Globe points={data?.projectActivities || []} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}