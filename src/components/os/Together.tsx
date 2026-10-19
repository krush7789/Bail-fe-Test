"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PRODUCTS } from "./products";
import { useScene } from "./store";

// One story that crosses all three products, so they read as one system.
const STORY: Record<string, { event: string; detail: string }> = {
  hr: { event: "Rohan joins Design", detail: "onboarding starts, payroll profile created" },
  inventory: { event: "laptop + ID card issued", detail: "pulled from stock, reorder queued" },
  referral: { event: "bonus paid to Meera", detail: "she referred Rohan — ₹10,000 released" },
};

export default function Together() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-25%" });
  const [step, setStep] = useState(-1);

  // play through the chain while on screen, pause on the last step, loop
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setStep((s) => (s + 1) % (PRODUCTS.length + 1)), 1600);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => { useScene.setState({ togetherStep: inView ? step : -1 }); }, [step, inView]);

  const pos = Math.max(0, Math.min(step, PRODUCTS.length - 1));

  return (
    <section id="together" className="px-4 sm:px-8 py-32 min-h-[100svh] flex items-end">
      <div ref={ref} className="mx-auto w-full max-w-6xl">
        <div className="os-glass inline-block max-w-xl p-7">
        <p className="os-label">one system</p>
        <h2 className="os-display mt-4 text-[clamp(40px,6vw,72px)] leading-none">
          built to work <em>together</em>.
        </h2>
        <p className="mt-5 max-w-lg text-[var(--os-dim)]">
          Each product is great alone. Connected, one event in HR ripples through the business — no one re-types anything.
        </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:gap-10">
          {PRODUCTS.map((p, i) => {
            const on = step >= i;
            return (
              <div
                key={p.id}
                className="os-card p-6 transition-all duration-700"
                style={{
                  borderColor: on ? p.accent : "rgba(255,255,255,0.08)",
                  boxShadow: on ? `0 0 60px -20px ${p.accent}` : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="os-label" style={{ color: on ? p.accent : undefined }}>{p.name}</span>
                  <span className="os-label">{p.index}</span>
                </div>
                <p className={`os-display mt-8 text-3xl transition-opacity duration-700 ${on ? "opacity-100" : "opacity-25"}`}>
                  {STORY[p.id].event}
                </p>
                <p className={`mt-2 text-sm transition-opacity duration-700 ${on ? "text-[var(--os-dim)]" : "text-white/15"}`}>
                  {STORY[p.id].detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* timeline track under the tiles: a pulse hops tile to tile (desktop) */}
        <div aria-hidden className="relative mx-[16.6%] mt-10 hidden h-px bg-white/10 md:block">
          {PRODUCTS.map((p, i) => (
            <span key={p.id} className="absolute -top-[2px] h-[5px] w-[5px] -translate-x-1/2 rounded-full transition-colors duration-700"
              style={{ left: `${i * 50}%`, background: step >= i ? p.accent : "rgba(255,255,255,0.2)" }} />
          ))}
          <motion.span
            className="absolute -top-[5px] h-[11px] w-[11px] -translate-x-1/2 rounded-full"
            animate={{ left: `${pos * 50}%`, backgroundColor: PRODUCTS[pos].accent, opacity: step < 0 ? 0 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </section>
  );
}
