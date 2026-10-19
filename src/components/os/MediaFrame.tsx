"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import type { Product } from "./products";

type Mode = "try" | "watch" | number; // number = screenshot index

// Tilting product frame. "try" shows the interactive demo, "watch" the loop
// video, and the thumbs below show screenshots. Missing assets render a
// labelled placeholder so it's obvious what to drop in.
export default function MediaFrame({ product, live = true, children }: { product: Product; live?: boolean; children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("try");

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 });
  const sheen = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);

  // Tilt only in "watch"/screens — the demos need a steady target to drag/click.
  const tilt = mode !== "try";

  return (
    <div className="w-full" style={{ perspective: 1400 }}>
      <motion.div
        onMouseMove={(e) => {
          if (!tilt) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
        style={tilt ? { rotateX: rotX, rotateY: rotY } : undefined}
        className={`os-card os-sweep overflow-hidden ${live ? "is-in" : ""}`}
      >
        {/* window bar */}
        <div className="flex items-center justify-between px-4 h-10 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full" style={{ background: product.accent }} />
          </div>
          <div className="flex gap-1 text-[12px]" role="tablist">
            {(["try", "watch"] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1 transition-colors ${mode === m ? "bg-white/10 text-white" : "text-white/40 hover:text-white/70"}`}
              >
                {m === "try" ? "try it" : "watch"}
              </button>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/5] sm:aspect-[16/10]">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(mode)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              {mode === "try" && children}
              {mode === "watch" && <Video product={product} />}
              {typeof mode === "number" && <Screen src={product.screens[mode]} n={mode + 1} />}
            </motion.div>
          </AnimatePresence>

          {tilt && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                backgroundSize: "250% 100%",
                backgroundPositionX: sheen,
              }}
            />
          )}
        </div>
      </motion.div>

      {/* screenshot thumbs */}
      <div className="mt-4 flex gap-3">
        {product.screens.map((src, i) => (
          <button
            key={i}
            onClick={() => setMode(i)}
            aria-label={`Screenshot ${i + 1}`}
            className={`relative w-20 aspect-[16/10] overflow-hidden rounded-md border transition-colors ${
              mode === i ? "border-[var(--accent)]" : "border-white/10 hover:border-white/30"
            }`}
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : (
              <DummyScreen mini />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Video({ product }: { product: Product }) {
  if (product.video) {
    return (
      <video
        src={product.video}
        poster={product.poster}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <Placeholder title="video goes here" hint={product.videoHint} file={`/public/os/${product.id}.mp4`} />
  );
}

function Screen({ src, n }: { src?: string; n: number }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`Screenshot ${n}`} className="h-full w-full object-cover" />;
  }
  return (
    <div className="relative h-full">
      <DummyScreen />
      <span className="os-label absolute bottom-3 right-4">dummy screen {n}</span>
    </div>
  );
}

export function Placeholder({ title, hint, file }: { title: string; hint: string; file: string }) {
  return (
    <div className="relative h-full flex flex-col items-center justify-center gap-3 text-center px-6">
      <div className="absolute inset-4 rounded-lg border border-dashed border-white/10" />
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/50">▶</span>
      <p className="os-display text-2xl text-white/80">{title}</p>
      <p className="text-sm text-white/40 max-w-xs">{hint}</p>
      <p className="os-label">{file}</p>
    </div>
  );
}

// Abstract dashboard skeleton, tinted by the section accent.
export function DummyScreen({ mini = false }: { mini?: boolean }) {
  const g = mini ? "gap-0.5 p-1" : "gap-3 p-5";
  return (
    <div className={`flex h-full w-full ${g}`}>
      <div className="os-skel w-[18%]" />
      <div className={`flex flex-1 flex-col ${mini ? "gap-0.5" : "gap-3"}`}>
        <div className={`flex ${mini ? "gap-0.5" : "gap-3"} h-[28%]`}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="os-skel flex-1 relative overflow-hidden">
              {!mini && <div className="absolute left-3 top-3 h-2 w-10 bg-white/10" />}
              {!mini && <div className="absolute left-3 bottom-3 h-4 w-16" style={{ background: "var(--accent)", opacity: 0.5 }} />}
            </div>
          ))}
        </div>
        <div className="os-skel flex-1 relative overflow-hidden">
          {!mini && (
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3/4 w-full">
              <path d="M0 35 L15 28 L30 30 L45 18 L60 22 L75 10 L100 6" fill="none" stroke="var(--accent)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
