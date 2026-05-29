"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  label: string;
  className?: string;
}

function parseValue(value: string): { numeric: number; suffix: string } | null {
  const match = value.match(/^(\d+)(.*)/);
  if (!match) return null;
  return { numeric: parseInt(match[1], 10), suffix: match[2] };
}

export default function AnimatedCounter({
  value,
  label,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayed, setDisplayed] = useState<string>(value);
  const hasAnimated = useRef(false);

  const parsed = useMemo(() => parseValue(value), [value]);

  useEffect(() => {
    if (!isInView || hasAnimated.current || !parsed) return;

    // Check prefers-reduced-motion — displayed is already initialised to value,
    // so no setState call is needed; just mark as animated and skip the rAF loop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    const target = parsed.numeric;
    const suffix = parsed.suffix;
    const duration = 1500; // ms
    const startTime = performance.now();
    let rafId: number;

    function easeOut(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOut(progress) * target);
      setDisplayed(`${current}${suffix}`);
      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, parsed, value]);

  return (
    <div ref={ref} className={`flex flex-col items-center ${className}`}>
      <span className="text-4xl md:text-5xl font-bold glow-text-orange">
        {displayed}
      </span>
      <span className="text-sm text-white/50 mt-2">{label}</span>
    </div>
  );
}
