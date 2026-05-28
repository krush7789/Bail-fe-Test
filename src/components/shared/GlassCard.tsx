import React from "react";

type GlowColor = "orange" | "navy" | "cyan" | "none";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: GlowColor;
  onClick?: () => void;
}

const glowMap: Record<GlowColor, string> = {
  orange: "0 0 40px rgba(237,130,28,0.15)",
  navy: "0 0 40px rgba(61,69,168,0.2)",
  cyan: "0 0 40px rgba(0,212,255,0.15)",
  none: "none",
};

const glowHoverMap: Record<GlowColor, string> = {
  orange: "0 0 60px rgba(237,130,28,0.3)",
  navy: "0 0 60px rgba(61,69,168,0.35)",
  cyan: "0 0 60px rgba(0,212,255,0.3)",
  none: "none",
};

export default function GlassCard({
  children,
  className = "",
  glowColor = "none",
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 ${className}`}
      style={{ boxShadow: glowMap[glowColor] }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = glowHoverMap[glowColor];
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = glowMap[glowColor];
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
