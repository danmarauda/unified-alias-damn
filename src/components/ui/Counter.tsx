"use client";

import { useEffect, useState } from "react";

interface CounterProps {
  value: number;
  end?: number;
  decimalPlaces?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function Counter({
  value,
  end,
  decimalPlaces = 0,
  duration = 1000,
  suffix = "",
  prefix = "",
  className = "",
}: CounterProps) {
  const [count, setCount] = useState(0);
  const targetValue = end !== undefined ? end : value;

  useEffect(() => {
    // If the component just mounted or the value is 0, set the count immediately
    if (count === 0 && targetValue === 0) {
      setCount(0);
      return;
    }

    // Calculate step size
    const steps = 30;
    const increment = targetValue / steps;
    let current = 0;

    // Use a timeout to animate the counter
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  // Format the number with the specified decimal places
  const formattedNumber =
    decimalPlaces > 0
      ? count.toFixed(decimalPlaces)
      : Math.round(count).toString();

  return (
    <span className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
