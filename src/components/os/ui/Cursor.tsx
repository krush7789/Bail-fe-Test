"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useScene } from "../store";

const INTERACTIVE = "a, button, [role=button], [role=tab], input, textarea, select, label, [data-cursor]";

// A soft ring that trails the pointer and swells over anything clickable.
// The native cursor stays (text fields, accessibility); this sits on top.
// Mouse/trackpad only — the media query hides it on touch screens.
export default function Cursor() {
  const [over, setOver] = useState(false);
  const [down, setDown] = useState(false);
  const orb = useScene((s) => s.orbHover);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      setOver(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const press = () => setDown(true), release = () => setDown(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
    };
  }, [x, y]);

  const size = orb ? 0 : over ? 46 : 22; // the orb shows its own label instead
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden rounded-full border mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:block"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: size, height: size,
        borderColor: over ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
        backgroundColor: over ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0)",
        scale: down ? 0.8 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />
  );
}
