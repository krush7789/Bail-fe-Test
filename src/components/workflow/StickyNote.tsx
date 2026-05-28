// src/components/workflow/StickyNote.tsx
import React from "react";

interface StickyNoteProps {
  title: string;
  body: string;
  x: number;  // world x center
  y: number;  // world y center
  rotate?: number;
}

export default function StickyNote({ title, body, x, y, rotate = 0 }: StickyNoteProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 110,
        top: y - 70,
        width: 220,
        minHeight: 140,
        background: "rgba(237,130,28,0.08)",
        border: "1px solid rgba(237,130,28,0.2)",
        borderRadius: 4,
        padding: "12px 14px",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "none",
        pointerEvents: "none",
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--bail-orange)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
