"use client";

import React from "react";
import { motion } from "framer-motion";

const BAR_COUNT = 12;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 40;
const MID_HEIGHT = 20;

function getBarAnimation(index: number) {
  // Create a staggered sine-wave-like pattern using different heights per bar
  const heights = [
    MIN_HEIGHT,
    8,
    16,
    MAX_HEIGHT,
    28,
    12,
    MAX_HEIGHT,
    20,
    8,
    32,
    16,
    MIN_HEIGHT,
  ];

  return {
    animate: {
      height: [MIN_HEIGHT, heights[index % heights.length], MIN_HEIGHT],
    },
    transition: {
      duration: 0.8 + (index % 4) * 0.15,
      delay: index * 0.08,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };
}

interface VoiceWaveformProps {
  className?: string;
}

export default function VoiceWaveform({ className = "" }: VoiceWaveformProps) {
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Bars row */}
      <div className="flex items-center gap-2">
        {Array.from({ length: BAR_COUNT }).map((_, idx) => {
          if (prefersReducedMotion) {
            return (
              <div
                key={idx}
                className="w-1 rounded-full bg-bail-orange"
                style={{ height: MID_HEIGHT }}
              />
            );
          }

          const { animate, transition } = getBarAnimation(idx);

          return (
            <motion.div
              key={idx}
              className="w-1 rounded-full bg-bail-orange"
              animate={animate}
              transition={transition}
              style={{ height: MIN_HEIGHT }}
            />
          );
        })}
      </div>

      {/* Caption */}
      <p className="text-xs text-white/50 tracking-wide">
        AI Voice Agent · Live call in progress
      </p>
    </div>
  );
}
