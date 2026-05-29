// src/components/workflow/DotGridBackground.tsx
// Simple absolute full-fill div with the dot-grid CSS class
import React from "react";
import NoiseOverlay from "@/components/shared/NoiseOverlay";

export default function DotGridBackground({ w, h }: { w: number; h: number }) {
  return (
    <>
      <div
        className="dot-grid"
        style={{ position: "absolute", top: 0, left: 0, width: w, height: h, zIndex: 0 }}
        aria-hidden="true"
      />
      <NoiseOverlay opacity={0.025} />
    </>
  );
}
