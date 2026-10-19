"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import { PRODUCTS, type DemoKind } from "./products";
import AppIcon from "./AppIcon";
import { useScene } from "./store";
import SplitWords from "./ui/SplitWords";
import Magnetic from "./ui/Magnetic";

// Pinned hero copy over the fixed 3D world (World.tsx). Scroll progress feeds
// the camera; the overlay is pointer-transparent so the orb stays clickable.
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const orbHover = useScene((s) => s.orbHover);
  const armed = useScene((s) => s.armed);
  const diving = useScene((s) => s.diving);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  const introOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const introY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const outroOpacity = useTransform(scrollYProgress, [0.45, 0.65, 0.9, 1], [0, 1, 1, 0]);

  // cursor label follows the pointer (the canvas underneath gets the events)
  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  const showLabel = (orbHover || armed) && !diving;

  return (
    <section id="hero" ref={section} className="pointer-events-none relative h-[220vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* phase 1: headline + product dock */}
        <motion.div
          style={{ opacity: introOpacity, y: introY }}
          className="absolute inset-x-0 bottom-[8svh] flex flex-col items-center px-4 text-center"
        >
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="os-pill">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
            bits ai lab · AI-native business systems
          </motion.span>
          <h1 className="os-display mt-5 text-[clamp(44px,7.5vw,104px)] leading-[0.95]">
            <SplitWords text="three systems." delay={1.5} />
            <br />
            <em><SplitWords text="zero" delay={1.64} /></em> <SplitWords text="busywork." delay={1.72} />
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2 }}
            className="pointer-events-auto mt-8 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-black/40 p-2 backdrop-blur-xl"
          >
            {PRODUCTS.map((p) => (
              <Magnetic key={p.id} strength={0.2}>
              <a href={`#${p.id}`} className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.06]">
                <AppIcon id={p.id as DemoKind} accent={p.accent} size={36} />
                <span className="hidden text-left text-[13px] leading-tight sm:block">
                  <span className="block text-white">{p.name}</span>
                  <span className="block text-white/40">{p.tagline.split(" ").slice(0, 3).join(" ")}…</span>
                </span>
              </a>
              </Magnetic>
            ))}
          </motion.div>
        </motion.div>

        {/* phase 2: as the camera closes in, invite the click */}
        <motion.div
          style={{ opacity: outroOpacity }}
          className="absolute inset-x-0 bottom-[10svh] flex flex-col items-center px-4 text-center"
        >
          <p className="os-label">the core runs everything</p>
          <p className="os-display mt-3 text-[clamp(28px,4vw,48px)] leading-tight">
            click the orb to <em>enter the lab</em>.
          </p>
          <p className="mt-3 text-sm text-[var(--os-dim)]">or keep scrolling to meet the systems ↓</p>
        </motion.div>

        <p className="os-label absolute bottom-4 left-1/2 hidden -translate-x-1/2 md:block">scroll</p>
      </div>

      {/* cursor label while hovering the orb (desktop) / armed hint (touch) */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-30 -translate-x-1/2 -translate-y-[calc(100%+18px)] whitespace-nowrap rounded-full bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-black shadow-[0_10px_30px_-8px_var(--accent)]"
            style={armed && !orbHover ? { left: "50%", top: "40%" } : { left: mx, top: my }}
          >
            {armed && !orbHover ? "tap the orb again to enter ↗" : "enter the lab ↗"}
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
