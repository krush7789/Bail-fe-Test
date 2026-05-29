"use client";

import React from "react";

type GlowColor = "orange" | "navy" | "cyan" | "none";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: GlowColor;
  onClick?: () => void;
  ariaExpanded?: boolean;
}

const glowMap: Record<GlowColor, string> = {
  orange: "none",
  navy: "none",
  cyan: "none",
  none: "none",
};

const glowHoverMap: Record<GlowColor, string> = {
  orange: "none",
  navy: "none",
  cyan: "none",
  none: "none",
};

export default function GlassCard({
  children,
  className = "",
  glowColor = "none",
  onClick,
  ariaExpanded,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{ boxShadow: glowMap[glowColor] }}
      aria-expanded={ariaExpanded !== undefined ? ariaExpanded : undefined}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = glowHoverMap[glowColor];
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = glowMap[glowColor];
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
