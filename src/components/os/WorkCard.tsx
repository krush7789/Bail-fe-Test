"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { Work } from "./works";
import { DummyScreen } from "./MediaFrame";
import { useScene } from "./store";

// Tall "vault" card: hover lifts + tilts it, lights the accent and plays the loop.
export default function WorkCard({ work, index }: { work: Work; index: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  return (
    <Link href={`/work/${work.slug}`} className="group block" style={{ perspective: 1200, ["--accent" as string]: work.accent }}>
      <motion.article
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
        }}
        onMouseEnter={() => { video.current?.play().catch(() => {}); useScene.setState({ workAccent: work.accent }); }}
        onMouseLeave={() => { rx.set(0); ry.set(0); video.current?.pause(); useScene.setState({ workAccent: "#ed821c" }); }}
        whileHover={{ y: -6 }}
        style={{ rotateX: rx, rotateY: ry }}
        className="relative aspect-[3/4] overflow-hidden os-card transition-[border-color,box-shadow] duration-500 group-hover:border-[var(--accent)] group-hover:shadow-[0_30px_80px_-30px_var(--accent)]"
      >
        {/* cover */}
        <div className="absolute inset-0">
          {work.cover ? (
            <video ref={video} src={work.cover} poster={work.image} muted loop playsInline className="h-full w-full object-cover opacity-80" />
          ) : work.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={work.image} alt="" className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-x-6 top-10 aspect-[16/10] origin-top -rotate-3 border border-white/[0.06] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105">
              <DummyScreen />
            </div>
          )}
          <div
            className="absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `linear-gradient(to top, #0a0a0a 35%, transparent 75%), radial-gradient(80% 50% at 50% 100%, color-mix(in srgb, ${work.accent} 22%, transparent), transparent)` }}
          />
        </div>

        {/* text */}
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-center gap-2">
            <span className="os-label">{String(index + 1).padStart(2, "0")} · {work.kind}</span>
            {work.sample && <span className="os-label rounded-full border border-white/15 px-2 !text-[9px]">sample</span>}
          </div>
          <h3 className="os-display mt-3 text-[32px] leading-none">
            {work.title}<span className="text-[var(--accent)]">.</span>
          </h3>
          <p className="mt-2 text-sm text-[var(--os-dim)]">{work.result}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {work.tags.map((t) => (
              <span key={t} className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/50">{t}</span>
            ))}
          </div>
        </div>

        <span className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-black">
          →
        </span>
      </motion.article>
    </Link>
  );
}
