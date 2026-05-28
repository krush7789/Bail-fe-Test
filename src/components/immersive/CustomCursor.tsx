"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

export default function CustomCursor() {
  const prefersReduced = useReducedMotion();

  // Raw mouse position (inner dot — no lag)
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  // Spring-lagged outer ring
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const ringX = useSpring(dotX, springConfig);
  const ringY = useSpring(dotY, springConfig);

  const ringScaleX = useMotionValue(1);
  const ringScale = useSpring(ringScaleX, { stiffness: 200, damping: 20 });

  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (prefersReduced) return;

    // Hide on touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    function onMouseMove(e: MouseEvent) {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a[href], button, [role="button"], [data-cursor-expand]');
      ringScaleX.set(isInteractive ? 1.5 : 1);
    }

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    const cleanup = () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.body.style.cursor = "";
    };
    cleanupRef.current = cleanup;
    return cleanup;
  }, [prefersReduced, dotX, dotY, ringScaleX]);

  if (prefersReduced) return null;

  return (
    <>
      {/* Outer ring — spring-lagged */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
          zIndex: 9999,
          pointerEvents: "none",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid rgba(237,130,28,0.5)",
          mixBlendMode: "screen",
        }}
        className="cursor-ring"
      />

      {/* Inner dot — no lag */}
      <motion.div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 10000,
          pointerEvents: "none",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--bail-orange)",
        }}
        className="cursor-dot"
      />
    </>
  );
}
