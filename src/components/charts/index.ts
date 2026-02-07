/**
 * Chart Components Index
 * 
 * Centralized exports for all chart components.
 * Use these lightweight canvas-based charts instead of heavy libraries
 * for simple data visualization needs.
 */

export { LineChart, type DataPoint } from "./LineChart";
export { PieChart, type PieSlice } from "./PieChart";

// Chart color palette - consistent across the application
export const CHART_COLORS = {
  primary: "#3060D1",
  secondary: "#5A7DE9",
  success: "#50C878",
  warning: "#F9A826",
  danger: "#FF6B6B",
  purple: "#9B59B6",
  teal: "#1ABC9C",
  crimson: "#E74C3C",
} as const;

// Default color array for multi-series charts
export const DEFAULT_CHART_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.danger,
  CHART_COLORS.purple,
  CHART_COLORS.teal,
  CHART_COLORS.crimson,
];

