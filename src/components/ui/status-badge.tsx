/**
 * StatusBadge Component
 * 
 * Reusable status indicator badge with consistent styling across the application.
 * Supports multiple status variants with appropriate colors and icons.
 */

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusVariant =
  | "success"
  | "error"
  | "pending"
  | "warning"
  | "info"
  | "loading"
  | "draft"
  | "approved"
  | "published";

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<
  StatusVariant,
  {
    icon: typeof CheckCircle;
    className: string;
    defaultLabel: string;
  }
> = {
  success: {
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    defaultLabel: "Success",
  },
  error: {
    icon: XCircle,
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    defaultLabel: "Error",
  },
  pending: {
    icon: Clock,
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    defaultLabel: "Pending",
  },
  warning: {
    icon: AlertCircle,
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    defaultLabel: "Warning",
  },
  info: {
    icon: AlertCircle,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    defaultLabel: "Info",
  },
  loading: {
    icon: Loader2,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    defaultLabel: "Loading",
  },
  draft: {
    icon: Clock,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    defaultLabel: "Draft",
  },
  approved: {
    icon: CheckCircle,
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    defaultLabel: "Approved",
  },
  published: {
    icon: CheckCircle,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    defaultLabel: "Published",
  },
};

const sizeConfig = {
  sm: {
    badge: "px-1.5 py-0.5 text-xs",
    icon: "h-2.5 w-2.5",
  },
  md: {
    badge: "px-2 py-1 text-xs",
    icon: "h-3 w-3",
  },
  lg: {
    badge: "px-2.5 py-1.5 text-sm",
    icon: "h-4 w-4",
  },
};

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = "md",
  className,
}: StatusBadgeProps) {
  // Normalize status to lowercase for lookup
  const normalizedStatus = status.toLowerCase() as StatusVariant;
  
  // Get config or use default for unknown statuses
  const config = statusConfig[normalizedStatus] || {
    icon: AlertCircle,
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    defaultLabel: status,
  };

  const Icon = config.icon;
  const sizeClasses = sizeConfig[size];
  const displayLabel = label || config.defaultLabel;
  const isLoading = normalizedStatus === "loading";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeClasses.badge,
        config.className,
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(sizeClasses.icon, isLoading && "animate-spin")}
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  );
}

/**
 * Mapping helper for common status transformations
 */
export function mapToStatusVariant(
  status: string
): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    completed: "success",
    complete: "success",
    passed: "success",
    active: "success",
    failed: "error",
    failure: "error",
    rejected: "error",
    in_progress: "loading",
    "in-progress": "loading",
    processing: "loading",
    running: "loading",
    awaiting_approval: "pending",
    review: "pending",
    revisions_requested: "warning",
  };

  return statusMap[status.toLowerCase()] || (status as StatusVariant);
}

