/**
 * Centralized formatting utilities for ALIAS AEOS
 *
 * Provides consistent formatting for dates, numbers, durations, and tokens
 * across the entire application.
 */

/**
 * Format a date/timestamp to a human-readable string
 * @param dateInput - Date object, timestamp number, or ISO string
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string (e.g., "Nov 27, 10:30 AM")
 */
export function formatDate(
  dateInput: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleString("en-US", options);
}

/**
 * Format a date to relative time (e.g., "2 hours ago", "in 3 days")
 * @param dateInput - Date object, timestamp number, or ISO string
 * @returns Relative time string
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;

  return formatDate(date, { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Format a duration in milliseconds to human-readable string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration (e.g., "250ms", "1.25s", "2m 30s")
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format a number with locale-aware thousand separators
 * @param num - Number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string (e.g., "1,234,567")
 */
export function formatNumber(
  num: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("en-US", options).format(num);
}

/**
 * Format a number as a percentage
 * @param value - Value (0-100 or 0-1 depending on isDecimal)
 * @param decimals - Number of decimal places
 * @param isDecimal - Whether value is already decimal (0-1)
 * @returns Formatted percentage string (e.g., "85.50%")
 */
export function formatPercent(
  value: number,
  decimals = 2,
  isDecimal = false,
): string {
  const percent = isDecimal ? value * 100 : value;
  return `${percent.toFixed(decimals)}%`;
}

/**
 * Format token count with appropriate suffix (K, M, B)
 * @param tokens - Number of tokens
 * @returns Formatted token string (e.g., "1.5M", "250K")
 */
export function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000_000) {
    return `${(tokens / 1_000_000_000).toFixed(1)}B`;
  }
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return formatNumber(tokens);
}

/**
 * Format currency amount
 * @param amount - Amount in cents or dollars
 * @param currency - Currency code (default: USD)
 * @param isCents - Whether amount is in cents
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(
  amount: number,
  currency = "USD",
  isCents = false,
): string {
  const dollars = isCents ? amount / 100 : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(dollars);
}

/**
 * Format bytes to human-readable size
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Truncate a string with ellipsis
 * @param str - String to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}
