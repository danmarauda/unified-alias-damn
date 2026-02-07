/**
 * LineChart Component
 * 
 * Canvas-based line chart for time series data visualization.
 * Lightweight alternative to heavy charting libraries.
 */

"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface DataPoint {
  timestamp: string | number;
  value: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  fillOpacity?: number;
  lineWidth?: number;
  showArea?: boolean;
  className?: string;
  emptyMessage?: string;
}

export function LineChart({
  data,
  height = 120,
  color = "#3060D1",
  fillOpacity = 0.125,
  lineWidth = 2,
  showArea = true,
  className,
  emptyMessage = "No data available",
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Reset canvas dimensions for CSS
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;

    const width = rect.width;
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    // Padding for the chart area
    const padding = { top: 10, bottom: 10, left: 0, right: 0 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate points
    const points = data.map((point, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const normalizedValue = (point.value - min) / range;
      const y = padding.top + chartHeight - normalizedValue * chartHeight;
      return { x, y };
    });

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    points.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();

    // Draw area under the line
    if (showArea && points.length > 0) {
      ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
      ctx.lineTo(points[0].x, height - padding.bottom);
      ctx.closePath();

      // Convert hex color to rgba for fill
      const hexToRgba = (hex: string, alpha: number) => {
        const r = Number.parseInt(hex.slice(1, 3), 16);
        const g = Number.parseInt(hex.slice(3, 5), 16);
        const b = Number.parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      ctx.fillStyle = hexToRgba(color, fillOpacity);
      ctx.fill();
    }
  }, [data, height, color, fillOpacity, lineWidth, showArea]);

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

  return (
    <canvas
      ref={canvasRef}
      className={cn("w-full", className)}
      style={{ height }}
    />
  );
}

export default LineChart;

