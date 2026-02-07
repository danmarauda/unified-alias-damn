import { cn } from "@/lib/utils";

/**
 * PlaygroundTile - Reusable container component
 *
 * Inspired by LiveKit agents-playground tile pattern.
 * Provides consistent styling for all observability visualizations.
 *
 * Features:
 * - Rounded corners with subtle shadows
 * - Responsive padding
 * - Flexible layout via className
 * - Dark/light mode support
 */

interface PlaygroundTileProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export function PlaygroundTile({
  children,
  className,
  title,
  subtitle,
  headerAction,
}: PlaygroundTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl bg-white dark:bg-gray-900",
        "border border-gray-200 dark:border-gray-800",
        "shadow-sm hover:shadow-md transition-shadow duration-200",
        "overflow-hidden",
        className
      )}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}

      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
