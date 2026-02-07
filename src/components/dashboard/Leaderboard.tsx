// biome-ignore lint/style/useFilenamingConvention: Dashboard components follow existing naming.
"use client";

import { ArrowDown, ArrowUp, BarChart2, Minus, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStats } from "@/lib/hooks/use-stats";

export function Leaderboard() {
  const { data, isLoading } = useStats();

  // Use real data only - no mock fallbacks
  const projects = data?.projectPerformance || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "positive":
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card className="overflow-hidden border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center font-normal text-base">
          <BarChart2 className="mr-2 h-5 w-5 text-primary" />
          Project Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="w-[40px] text-center">#</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-center">Velocity</TableHead>
                <TableHead className="text-center">Quality Score</TableHead>
                <TableHead className="text-center">Budget</TableHead>
                <TableHead className="text-center">Timeline</TableHead>
                <TableHead className="text-center">Satisfaction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow className="border-border" key={index}>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-6 w-6 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-40" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-5 w-12" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-5 w-12" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-5 w-16" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-5 w-16" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="mx-auto h-5 w-10" />
                      </TableCell>
                    </TableRow>
                  ))
                : projects.length === 0
                  ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32">
                          <EmptyState
                            icon={BarChart2}
                            title="No project data"
                            description="Project performance metrics will appear here once projects are tracked."
                            variant="compact"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  : projects.map((project, index) => (
                    <TableRow
                      className="border-border hover:bg-background/50"
                      key={project._id}
                    >
                      <TableCell className="text-center">
                        {index === 0 ? (
                          <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                            <Trophy className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground">
                            {index + 1}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <div className="mr-2 inline-block h-2 w-12 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${project.velocity}%` }}
                            />
                          </div>
                          <span>{project.velocity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {project.qualityScore}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {getStatusIcon(project.budgetStatus)}
                          <span className="ml-1">{project.budget}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {getStatusIcon(project.timelineStatus)}
                          <span className="ml-1">{project.timeline}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <span className="mr-1 text-yellow-500">★</span>
                          <span>{project.stakeholderSatisfaction}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
