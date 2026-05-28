import React from "react";

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export default function NoiseOverlay({
  opacity = 0.035,
  className = "",
}: NoiseOverlayProps) {
  return (
    <div
      className={`noise-overlay z-10 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
