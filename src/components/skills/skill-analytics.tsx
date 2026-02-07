"use client";

import { useQuery } from "convex/react";
import {
  Activity,
  BarChart3,
  CheckCircle,
  Clock,
  FileX,
  PenTool,
  RefreshCw,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "../../../convex/_generated/api";

export function SkillAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");

  // Fetch analytics data from Convex
  const analytics = useQuery(api.skills.getSkillAnalytics);
  const isLoading = analytics === undefined;

  // Calculate derived metrics
  const totalSkills = analytics?.totalSkills ?? 0;
  const statusCounts = analytics?.statusCounts ?? {
    ready: 0,
    processing: 0,
    scraping: 0,
    error: 0,
    draft: 0,
  };
  const totalPages = analytics?.totalPages ?? 0;

  // Calculate success rate (ready / total * 100)
  const successRate =
    totalSkills > 0 ? Math.round((statusCounts.ready / totalSkills) * 100) : 0;

  // Build status data array for rendering
  const statusData = [
    {
      status: "Ready",
      count: statusCounts.ready,
      percentage:
        totalSkills > 0
          ? Math.round((statusCounts.ready / totalSkills) * 100)
          : 0,
      color: "text-green-600",
      icon: CheckCircle,
    },
    {
      status: "Processing",
      count: statusCounts.processing,
      percentage:
        totalSkills > 0
          ? Math.round((statusCounts.processing / totalSkills) * 100)
          : 0,
      color: "text-blue-600",
      icon: RefreshCw,
    },
    {
      status: "Scraping",
      count: statusCounts.scraping,
      percentage:
        totalSkills > 0
          ? Math.round((statusCounts.scraping / totalSkills) * 100)
          : 0,
      color: "text-yellow-600",
      icon: Clock,
    },
    {
      status: "Error",
      count: statusCounts.error,
      percentage:
        totalSkills > 0
          ? Math.round((statusCounts.error / totalSkills) * 100)
          : 0,
      color: "text-red-600",
      icon: XCircle,
    },
    {
      status: "Draft",
      count: statusCounts.draft,
      percentage:
        totalSkills > 0
          ? Math.round((statusCounts.draft / totalSkills) * 100)
          : 0,
      color: "text-gray-600",
      icon: PenTool,
    },
  ];

  // Build category distribution chart data from real data
  const categoryCounts = analytics?.categoryCounts ?? [];
  const categoryDistribution = {
    labels: categoryCounts.map((c) => c.category),
    datasets: [
      {
        data: categoryCounts.map((c) => c.count),
        backgroundColor: [
          "rgb(59, 130, 246)",
          "rgb(34, 197, 94)",
          "rgb(251, 146, 60)",
          "rgb(239, 68, 68)",
          "rgb(147, 51, 234)",
          "rgb(236, 72, 153)",
          "rgb(20, 184, 166)",
          "rgb(245, 158, 11)",
        ],
      },
    ],
  };

  // Placeholder trend data (would need historical tracking for real data)
  const skillCreationData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Skills Created",
        data: [0, 0, 0, 0, 0, 0, totalSkills > 0 ? 1 : 0], // Show minimal activity
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  // Recent activity from Convex
  const recentActivity = analytics?.recentActivity ?? [];

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Skills Analytics</h2>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              onClick={() => setTimeRange(range)}
              size="sm"
              variant={timeRange === range ? "default" : "outline"}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Skills</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="font-bold text-2xl">{totalSkills}</div>
                <p className="text-muted-foreground text-xs">
                  Across all categories
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="font-bold text-2xl">{successRate}%</div>
                <p className="text-muted-foreground text-xs">
                  Skills in ready state
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Categories</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="font-bold text-2xl">{categoryCounts.length}</div>
                <p className="text-muted-foreground text-xs">
                  Unique categories
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Pages Scraped</CardTitle>
            <FileX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="font-bold text-2xl">
                  {totalPages.toLocaleString()}
                </div>
                <p className="text-muted-foreground text-xs">
                  Total documentation pages
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skill Creation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Creation Trend</CardTitle>
            <CardDescription>Skills created over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : totalSkills === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No trend data"
                description="Skill creation trends will appear once skills are created."
                variant="compact"
              />
            ) : (
              <div className="h-64">
                <Line data={skillCreationData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Skills by category</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : categoryCounts.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No categories"
                description="Category distribution will appear once skills are categorized."
                variant="compact"
              />
            ) : (
              <div className="h-64">
                <Doughnut data={categoryDistribution} options={doughnutOptions} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Status Breakdown</CardTitle>
          <CardDescription>Current status of all skills</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton className="h-32 w-full" key={i} />
              ))}
            </div>
          ) : totalSkills === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="No status data"
              description="Status breakdown will appear once skills are created."
              variant="compact"
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {statusData.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    className="rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800"
                    key={item.status}
                  >
                    <Icon className={`mx-auto mb-2 h-8 w-8 ${item.color}`} />
                    <div className="font-bold text-2xl">{item.count}</div>
                    <div className="text-muted-foreground text-sm">
                      {item.status}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {item.percentage}%
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest skill operations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton className="h-10 w-full" key={i} />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Recent skill activity will appear here."
              variant="compact"
            />
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  className="flex items-center justify-between border-b py-2 last:border-0"
                  key={index}
                >
                  <div className="flex items-center space-x-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {activity.skillName} - {activity.action}
                    </span>
                  </div>
                  <Badge
                    className="text-xs"
                    variant={
                      activity.status === "error" ? "destructive" : "secondary"
                    }
                  >
                    {formatRelativeTime(activity.timestamp)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
