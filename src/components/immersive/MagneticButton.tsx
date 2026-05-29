"use client";

import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.4,
  className = "",
}: MagneticButtonProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      // Clamp to ±20px
      rawX.set(Math.max(-20, Math.min(20, dx)));
      rawY.set(Math.max(-20, Math.min(20, dy)));
    },
    [prefersReduced, strength, rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x, y }}>
        {children}
      </motion.div>
    </div>
  );
}
