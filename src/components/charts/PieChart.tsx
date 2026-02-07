/**
 * PieChart / DonutChart Component
 * 
 * Canvas-based pie/donut chart for distribution data visualization.
 * Lightweight alternative to heavy charting libraries.
 */

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface PieSlice {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieSlice[];
  height?: number;
  colors?: string[];
  donutRatio?: number; // 0 = pie, 0.6 = donut
  showLegend?: boolean;
  className?: string;
  emptyMessage?: string;
}

const DEFAULT_COLORS = [
  "#3060D1", // Primary blue
  "#5A7DE9", // Lighter blue
  "#50C878", // Green
  "#F9A826", // Orange
  "#FF6B6B", // Red
  "#9B59B6", // Purple
  "#1ABC9C", // Teal
  "#E74C3C", // Crimson
];

export function PieChart({
  data,
  height = 120,
  colors = DEFAULT_COLORS,
  donutRatio = 0.6,
  showLegend = false,
  className,
  emptyMessage = "No data available",
}: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const size = Math.min(canvas.parentElement?.clientWidth || height, height);

    // Set canvas size
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size / 2) - 10;
    let startAngle = -Math.PI / 2; // Start from top

    // Draw pie sections
    data.forEach((slice, i) => {
      const sliceAngle = (slice.value / total) * 2 * Math.PI;
      const sliceColor = slice.color || colors[i % colors.length];

      ctx.beginPath();
      ctx.fillStyle = sliceColor;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      startAngle += sliceAngle;
    });

    // Draw center circle for donut effect
    if (donutRatio > 0) {
      ctx.beginPath();
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim() || "#ffffff";
      ctx.arc(centerX, centerY, radius * donutRatio, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [data, height, colors, donutRatio]);

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-background/50",
          className
        )}
        style={{ height }}
      >
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    );
  }

  if (showLegend) {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <canvas ref={canvasRef} style={{ height, width: height }} />
        <div className="space-y-1">
          {data.map((slice, i) => (
            <div key={slice.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: slice.color || colors[i % colors.length] }}
              />
              <span className="text-muted-foreground">{slice.name}</span>
              <span className="font-medium">{slice.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("mx-auto", className)}
      style={{ height, width: height }}
    />
  );
}

export default PieChart;

