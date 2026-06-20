"use client";

import { useEffect, useRef, useState } from "react";
import { formatCompact } from "@/utils/helper";

/** Count-up number that respects prefers-reduced-motion. */
export function AnimatedNumber({
  value,
  compact = false,
  duration = 900,
}: {
  value: number;
  compact?: boolean;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const frame = useRef<number>(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce || duration <= 0) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(Math.round(from + (value - from) * eased));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {compact ? formatCompact(display) : display.toLocaleString("en")}
    </span>
  );
}
