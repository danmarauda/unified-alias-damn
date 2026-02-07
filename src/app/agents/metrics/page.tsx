"use client";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart2,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  DownloadCloud,
  Filter,
  Layers,
  RefreshCw,
  Settings,
  Terminal,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  type DataPoint,
  LineChart,
  PieChart,
  type PieSlice,
} from "@/components/charts";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatDate,
  formatDuration,
  formatNumber,
  formatTokens,
} from "@/lib/formatters";
import { useAgentMetrics } from "@/lib/hooks/use-agent-metrics";

// Type definitions for metrics data
interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

interface AgentTypeDistribution {
  name: string;
  value: number;
}

interface AgentCall {
  id: string;
  agentType: string;
  projectName: string;
  status: string;
  username: string;
  timestamp: string;
  duration: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

// Helper to convert TimeSeriesDataPoint to chart DataPoint
function toChartData(data: TimeSeriesDataPoint[]): DataPoint[] {
  return data.map((d) => ({ timestamp: d.timestamp, value: d.value }));
}

// Helper to convert AgentTypeDistribution to PieSlice
function toPieData(data: AgentTypeDistribution[]): PieSlice[] {
  return data.map((d) => ({ name: d.name, value: d.value }));
}

export default function AgentMetricsPage() {
  const { data: metricsData, isLoading } = useAgentMetrics();
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center">
            <Link href="/agents">
              <Button className="mr-2" size="icon" variant="ghost">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-normal text-2xl">Agent Metrics</h1>
              <p className="text-muted-foreground">
                Monitor performance and usage statistics for your AI agents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border bg-background p-1">
              <Button
                onClick={() => setTimeRange("24h")}
                size="sm"
                variant={timeRange === "24h" ? "secondary" : "ghost"}
              >
                24h
              </Button>
              <Button
                onClick={() => setTimeRange("7d")}
                size="sm"
                variant={timeRange === "7d" ? "secondary" : "ghost"}
              >
                7d
              </Button>
              <Button
                onClick={() => setTimeRange("30d")}
                size="sm"
                variant={timeRange === "30d" ? "secondary" : "ghost"}
              >
                30d
              </Button>
              <Button
                onClick={() => setTimeRange("custom")}
                size="sm"
                variant={timeRange === "custom" ? "secondary" : "ghost"}
              >
                <Calendar className="mr-1 h-4 w-4" />
                Custom
              </Button>
            </div>

            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="outline"
            >
              <RefreshCw
                className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button size="sm" variant="outline">
              <DownloadCloud className="mr-1 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-sm">Total Requests</h3>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </div>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <div className="font-semibold text-2xl">
                  {formatNumber(metricsData?.summary.totalRequests || 0)}
                </div>
              )}
              <p className="mt-1 text-muted-foreground text-xs">
                Last {timeRange}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-sm">Success Rate</h3>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <div className="font-semibold text-2xl">
                  {metricsData?.summary.successRate.toFixed(2) || 0}%
                </div>
              )}
              <p className="mt-1 text-muted-foreground text-xs">
                <span className="text-green-500">↑ 0.3%</span> from previous
                period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-sm">Avg. Latency</h3>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              {isLoading ? (
                <div className="h-8 w-20 animate-pulse rounded bg-muted" />
              ) : (
                <div className="font-semibold text-2xl">
                  {metricsData?.summary.averageLatency.toFixed(0) || 0}ms
                </div>
              )}
              <p className="mt-1 text-muted-foreground text-xs">
                <span className="text-red-500">↑ 12.5ms</span> from previous
                period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-sm">Tokens Consumed</h3>
                <Terminal className="h-4 w-4 text-muted-foreground" />
              </div>
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted" />
              ) : (
                <div className="font-semibold text-2xl">
                  {(metricsData?.summary.totalTokensConsumed || 0) / 1_000_000}M
                </div>
              )}
              <p className="mt-1 text-muted-foreground text-xs">
                <span className="text-green-500">↓ 2.1%</span> from previous
                period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-medium text-sm">Error Rate</h3>
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              {isLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              ) : (
                <div className="font-semibold text-2xl">
                  {metricsData?.summary.failureRate.toFixed(2) || 0}%
                </div>
              )}
              <p className="mt-1 text-muted-foreground text-xs">
                <span className="text-green-500">↓ 0.3%</span> from previous
                period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-normal text-base">
                <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[120px] animate-pulse rounded bg-muted" />
              ) : (
                <LineChart
                  color="#3060D1"
                  data={toChartData(metricsData?.timeSeries.requests || [])}
                />
              )}
              <div className="mt-2 text-center text-sm">
                Hourly request volume
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-normal text-base">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[120px] animate-pulse rounded bg-muted" />
              ) : (
                <LineChart
                  color="#F9A826"
                  data={toChartData(metricsData?.timeSeries.latency || [])}
                />
              )}
              <div className="mt-2 text-center text-sm">
                Average response time (ms)
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-normal text-base">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[120px] animate-pulse rounded bg-muted" />
              ) : (
                <LineChart
                  color="#50C878"
                  data={toChartData(metricsData?.timeSeries.successRate || [])}
                />
              )}
              <div className="mt-2 text-center text-sm">
                Percentage of successful requests
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Type Distribution */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-normal text-base">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                Agent Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {isLoading ? (
                  <div className="h-[120px] animate-pulse rounded bg-muted" />
                ) : (
                  <PieChart
                    data={toPieData(metricsData?.agentTypeDistribution || [])}
                  />
                )}

                <div className="space-y-2">
                  {isLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            className="h-5 animate-pulse rounded bg-muted"
                            key={i}
                          />
                        ))
                    : metricsData?.agentTypeDistribution.map((item, i) => (
                        <div
                          className="flex items-center justify-between"
                          key={i}
                        >
                          <div className="flex items-center">
                            <div
                              className="mr-2 h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: [
                                  "#3060D1",
                                  "#5A7DE9",
                                  "#50C878",
                                  "#F9A826",
                                  "#FF6B6B",
                                ][i % 5],
                              }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="text-sm">{item.value}%</span>
                        </div>
                      ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center font-normal text-base">
                <AlertCircle className="mr-2 h-5 w-5 text-primary" />
                Issues Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium text-sm">Slowest Calls</h3>
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          className="mb-2 h-8 animate-pulse rounded bg-muted"
                          key={i}
                        />
                      ))
                  ) : (
                    <div className="space-y-2">
                      {metricsData?.slowCalls.slice(0, 3).map((call) => (
                        <div
                          className="flex items-center justify-between border-border border-b pb-2 text-sm"
                          key={call._id}
                        >
                          <div className="max-w-[200px] truncate">
                            <span className="font-medium">
                              {call.agentType}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              • {call.projectName}
                            </span>
                          </div>
                          <div className="font-semibold text-yellow-500">
                            {formatDuration(call.duration)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 font-medium text-sm">Recent Errors</h3>
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          className="mb-2 h-8 animate-pulse rounded bg-muted"
                          key={i}
                        />
                      ))
                  ) : (
                    <div className="space-y-2">
                      {(metricsData?.errorCalls || []).length > 0 ? (
                        metricsData?.errorCalls.slice(0, 3).map((call) => (
                          <div
                            className="flex items-center justify-between border-border border-b pb-2 text-sm"
                            key={call._id}
                          >
                            <div className="max-w-[200px] truncate">
                              <span className="font-medium">
                                {call.agentType}
                              </span>
                              <span className="text-muted-foreground">
                                {" "}
                                • {call.projectName}
                              </span>
                            </div>
                            <div className="text-red-500">
                              {formatDate(call.timestamp)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-sm">
                          No recent errors
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calls Table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center font-normal text-base">
                <Layers className="mr-2 h-5 w-5 text-primary" />
                Recent Agent Calls
              </CardTitle>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Filter className="mr-1 h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="mr-1 h-4 w-4" />
                  Columns
                </Button>
                <Button size="sm" variant="outline">
                  <DownloadCloud className="mr-1 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-border border-b">
                    <th className="p-4 text-left font-medium text-sm">
                      Agent Type
                    </th>
                    <th className="p-4 text-left font-medium text-sm">
                      Project
                    </th>
                    <th className="p-4 text-left font-medium text-sm">
                      Status
                    </th>
                    <th className="p-4 text-left font-medium text-sm">User</th>
                    <th className="p-4 text-left font-medium text-sm">Time</th>
                    <th className="p-4 text-right font-medium text-sm">
                      Duration
                    </th>
                    <th className="p-4 text-right font-medium text-sm">
                      Tokens
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <tr className="border-border border-b" key={i}>
                            <td className="p-4" colSpan={7}>
                              <div className="h-6 animate-pulse rounded bg-muted" />
                            </td>
                          </tr>
                        ))
                    : metricsData?.recentCalls.map((call) => (
                        <tr
                          className="border-border border-b hover:bg-muted/20"
                          key={call._id}
                        >
                          <td className="p-4 text-sm">{call.agentType}</td>
                          <td className="p-4 text-sm">{call.projectName}</td>
                          <td className="p-4 text-sm">
                            <StatusBadge status={call.status} />
                          </td>
                          <td className="p-4 text-sm">{call.username}</td>
                          <td className="p-4 text-sm">
                            {formatDate(call.timestamp)}
                          </td>
                          <td className="p-4 text-right font-mono text-sm">
                            {formatDuration(call.duration)}
                          </td>
                          <td className="p-4 text-right font-mono text-sm">
                            {formatNumber(call.totalTokens)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-border border-t p-4">
              <div className="text-muted-foreground text-sm">
                Showing 1-{metricsData?.recentCalls.length || 0} of{" "}
                {metricsData?.summary.totalRequests || 0} calls
              </div>
              <div className="flex items-center gap-2">
                <Button disabled size="sm" variant="outline">
                  Previous
                </Button>
                <Button size="sm" variant="outline">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
