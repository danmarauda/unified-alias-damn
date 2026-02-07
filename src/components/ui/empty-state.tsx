"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Inbox,
  FileQuestion,
  Users,
  BarChart3,
  Activity,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

const iconMap: Record<string, LucideIcon> = {
  inbox: Inbox,
  file: FileQuestion,
  users: Users,
  chart: BarChart3,
  activity: Activity,
  folder: FolderOpen,
};

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon: Icon = Inbox,
      title,
      description,
      action,
      className,
      variant = "default",
    },
    ref
  ) => {
    const variantStyles = {
      default: "py-12 px-6",
      compact: "py-6 px-4",
      inline: "py-4 px-3",
    };

    const iconSizes = {
      default: "h-12 w-12",
      compact: "h-8 w-8",
      inline: "h-6 w-6",
    };

    const titleSizes = {
      default: "text-lg",
      compact: "text-base",
      inline: "text-sm",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          variantStyles[variant],
          className
        )}
      >
        <div
          className={cn(
            "mb-4 rounded-full bg-muted p-3",
            variant === "inline" && "mb-2 p-2"
          )}
        >
          <Icon
            className={cn(
              "text-muted-foreground",
              iconSizes[variant]
            )}
          />
        </div>
        <h3
          className={cn(
            "font-medium text-foreground",
            titleSizes[variant]
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              "mt-1 max-w-sm text-muted-foreground",
              variant === "default" ? "text-sm" : "text-xs"
            )}
          >
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

export { EmptyState, iconMap };
export type { EmptyStateProps };
