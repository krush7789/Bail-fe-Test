"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Shell, { HOME } from "./Shell";
import { FILTERS, PILLARS, WORKS, type Pillar } from "./works";
import WorkCard from "./WorkCard";
import { clearPortal, peekPortal } from "./portal";
import { useScene } from "./store";

const VaultBackdrop = dynamic(() => import("./world/VaultBackdrop"), { ssr: false });

type Filter = (typeof FILTERS)[number];

export default function WorkPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = filter === "all" ? WORKS : WORKS.filter((w) => w.tags.includes(filter));

  // arriving through the orb: start flooded with light, then let it drain away
  // (read during render so the very first frame is already lit — no flash)
  const [arrived] = useState(peekPortal);
  useEffect(clearPortal, []);
  useEffect(() => { useScene.setState({ workAccent: "#ed821c" }); }, []);

  return (
    <Shell>
      <VaultBackdrop />
      {arrived && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "radial-gradient(circle at 50% 50%, #fff4e6 0%, #ed821c 35%, #08090a 75%)" }}
        />
      )}
      <main className="relative z-10 px-4 sm:px-8 pt-40 pb-32">
        <div aria-hidden className="os-grid pointer-events-none absolute inset-x-0 top-0 h-[80vh]" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className="os-label">the vault · {WORKS.length} projects</p>
              <h1 className="os-display mt-4 text-[clamp(64px,12vw,160px)] leading-[0.85]">
                work<span className="text-[var(--accent)]">.</span>
              </h1>
            </div>
            <p className="max-w-sm text-[var(--os-dim)]">
              Our products, and the custom systems we&apos;ve built for clients — voice agents, automations and integrations.
            </p>
          </motion.div>

          {/* filter chips — the highlight slides between them */}
          <LayoutGroup>
            <div className="mt-14 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={`relative rounded-lg px-4 py-2 text-sm transition-colors ${filter === f ? "text-black" : "text-white/55 hover:text-white"}`}
                >
                  {filter === f && (
                    <motion.span layoutId="chip" className="absolute inset-0 rounded-lg bg-[var(--accent)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{f}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>

          {/* pillar selected: show what we offer under it (from SERVICES.md) */}
          <AnimatePresence mode="wait">
            {filter in PILLARS && (
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="os-card mt-6 p-5"
              >
                <p className="text-[15px] text-white/85">{PILLARS[filter as Pillar].line}.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PILLARS[filter as Pillar].services.map((sv) => (
                    <span key={sv} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[13px] text-white/60">{sv}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((w, i) => (
                <motion.div
                  key={w.slug}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
                  // middle column sits lower for a staggered rhythm (margin, since layout anims own `transform`)
                  className={i % 3 === 1 ? "lg:mt-16" : ""}
                >
                  <WorkCard work={w} index={WORKS.indexOf(w)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {shown.length === 0 && (
            <p className="mt-4 text-[var(--os-dim)]">
              No case studies here yet — but these are services we build today.{" "}
              <a href={`${HOME}#contact`} className="text-white underline underline-offset-4">Get a quote ▸</a>
            </p>
          )}

          <div className="mt-40 flex flex-col items-center text-center">
            <p className="os-display text-[clamp(36px,5vw,64px)] leading-none">have something in mind?</p>
            <a href={`${HOME}#contact`} className="os-btn mt-8">let&apos;s build it ▸</a>
          </div>
        </div>
      </main>
    </Shell>
  );
}
