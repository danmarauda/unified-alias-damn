import { Activity, ChevronRight, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ClientCardProps {
  client: {
    _id: string;
    name: string;
    industry: string;
    status?:
      | "active"
      | "prospect"
      | "inactive"
      | "moderate"
      | "low"
      | "dormant";
    riskLevel?: "low" | "medium" | "high" | "critical";
    lastUpdate?: string;
    engagementScore?: number;
    // Additional properties that might be passed from RecentProfiles
    location?: string;
    digitalScore?: number;
    lastUpdated?: string;
  };
  className?: string;
  onClick?: () => void;
}

export function ClientCard({ client, className, onClick }: ClientCardProps) {
  // Status mapping
  const statusMap = {
    active: { label: "Active", class: "success" },
    prospect: { label: "Prospect", class: "warning" },
    inactive: { label: "Inactive", class: "error" },
    moderate: { label: "Moderate", class: "warning" },
    low: { label: "Low", class: "success" },
    dormant: { label: "Dormant", class: "info" },
  } as const;

  const statusIndicatorClass: Record<string, string> = {
    active: "bg-green-500",
    prospect: "bg-yellow-500",
    inactive: "bg-red-500",
    moderate: "bg-yellow-500",
    low: "bg-green-500",
    dormant: "bg-blue-500",
  };

  // Risk level mapping
  const riskMap = {
    low: {
      label: "Low Risk",
      class:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    medium: {
      label: "Medium Risk",
      class:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    high: {
      label: "High Risk",
      class:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
    critical: {
      label: "Critical Risk",
      class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };

  const riskBarClass: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  const riskBarWidth: Record<string, string> = {
    low: "25%",
    medium: "50%",
    high: "75%",
    critical: "100%",
  };

  // Map the lastUpdated property to lastUpdate if it exists
  const lastUpdate = client.lastUpdate || client.lastUpdated || "N/A";

  // Map digitalScore to engagementScore if needed
  const engagementScore = client.engagementScore || client.digitalScore || 0;

  // Default to "active" status if none provided
  const status = client.status || "active";

  // Default to "low" risk if none provided
  const riskLevel = client.riskLevel || "low";

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg border bg-white p-5 transition-all duration-300 hover:border-blue-300 hover:shadow-lg dark:bg-gray-800",
        className
      )}
      onClick={onClick}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
            <div className="font-mono text-blue-600 text-lg dark:text-blue-400">
              {client.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {client.name}
            </h3>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              {client.industry}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              statusIndicatorClass[status] ?? "bg-gray-400"
            )}
          />
          <span className="text-gray-600 text-sm dark:text-gray-400">
            {statusMap[status].label}
          </span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* Only render risk level panel if client has that property */}
        <div className="rounded bg-gray-50 p-3 dark:bg-gray-700">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center text-gray-600 text-sm dark:text-gray-400">
              <Shield className="mr-1 h-3 w-3" /> Risk Level
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-xs",
                riskMap[riskLevel].class
              )}
            >
              {riskMap[riskLevel].label}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
            <div
              className={cn(
                "h-full rounded-full",
                riskBarClass[riskLevel] ?? "bg-gray-400"
              )}
              style={{ width: riskBarWidth[riskLevel] ?? "100%" }}
            />
          </div>
        </div>

        <div className="rounded bg-gray-50 p-3 dark:bg-gray-700">
          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center text-gray-600 text-sm dark:text-gray-400">
              <Activity className="mr-1 h-3 w-3" /> Engagement
            </span>
            <span className="font-medium text-gray-900 text-sm dark:text-white">
              {engagementScore}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${engagementScore}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-sm dark:text-gray-400">
          Last updated:{" "}
          <span className="text-gray-900 dark:text-white">{lastUpdate}</span>
        </span>
        <Link
          className="flex items-center font-medium text-blue-600 text-sm transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          href={`/client-profiles/${client._id}`}
        >
          View Profile <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
