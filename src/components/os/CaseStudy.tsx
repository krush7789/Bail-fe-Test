"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Shell from "./Shell";
import { WORKS, workBySlug } from "./works";
import { DummyScreen, Placeholder } from "./MediaFrame";
import VoiceDemo from "./demos/VoiceDemo";
import { useScene } from "./store";

const VaultBackdrop = dynamic(() => import("./world/VaultBackdrop"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;
const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15%" },
  transition: { duration: 1, ease },
};

export default function CaseStudy({ slug }: { slug: string }) {
  const work = workBySlug(slug)!;
  const next = WORKS[(WORKS.indexOf(work) + 1) % WORKS.length];
  useEffect(() => { useScene.setState({ workAccent: work.accent }); }, [work.accent]); // tunnel takes this project's colour

  return (
    <Shell>
      <VaultBackdrop />
      <main className="relative z-10" style={{ ["--accent" as string]: work.accent }}>
        {/* ── hero ── */}
        <section className="px-4 sm:px-8 pt-36">
          <div className="mx-auto max-w-6xl">
            <Link href="/work" className="os-label hover:!text-white transition-colors">← all work</Link>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>
              <div className="mt-10 flex items-center gap-3">
                <span className="os-label">{work.kind} · {work.tags.join(" · ")}</span>
                {work.sample && <span className="os-label rounded-full border border-white/15 px-2 !text-[9px]">sample content</span>}
              </div>
              <h1 className="os-display mt-4 text-[clamp(56px,10vw,140px)] leading-[0.88]">
                {work.title}<span className="text-[var(--accent)]">.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-2xl sm:text-3xl text-white/80">{work.result}</p>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="mx-auto mt-16 max-w-7xl px-4 sm:px-8"
        >
          <div className="relative aspect-[4/5] sm:aspect-video overflow-hidden os-card">
            <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 50% 100%, color-mix(in srgb, ${work.accent} 14%, transparent), transparent)` }} />
            {work.cover ? (
              <video src={work.cover} poster={work.image} autoPlay muted loop playsInline className="relative h-full w-full object-cover" />
            ) : (
              <Placeholder title="hero video goes here" hint="15–30s walkthrough or loop · 1080p+" file={`/public/work/${work.slug}.mp4`} />
            )}
          </div>
        </motion.section>

        {/* ── live demo (voice only) ── */}
        {work.demo === "voice" && (
          <section className="px-4 sm:px-8 pt-32">
            <motion.div {...reveal} className="mx-auto max-w-3xl os-card">
              <p className="os-label border-b border-white/[0.06] px-6 py-4">hear it for yourself</p>
              <div className="h-[420px]"><VoiceDemo /></div>
            </motion.div>
          </section>
        )}

        {/* ── problem ── */}
        <section className="px-4 sm:px-8 py-32">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
            <motion.div {...reveal}>
              <p className="os-label">the problem</p>
              <p className="mt-5 text-lg leading-relaxed text-[var(--os-dim)]">{work.problem}</p>
            </motion.div>
            <motion.blockquote {...reveal} className="os-display text-[clamp(32px,4.5vw,56px)] leading-[1.05]">
              <span className="text-[var(--accent)]">“</span>{work.quote}<span className="text-[var(--accent)]">”</span>
            </motion.blockquote>
          </div>
        </section>

        {/* ── what we built: three tilted screens ── */}
        <section className="px-4 sm:px-8 pb-32">
          <div className="mx-auto max-w-6xl">
            <motion.p {...reveal} className="os-label">what we built</motion.p>
            <div className="mt-10 grid gap-8 md:grid-cols-3" style={{ perspective: 1400 }}>
              {work.built.map((caption, i) => (
                <motion.figure
                  key={caption}
                  initial={{ opacity: 0, y: 80, rotateY: i === 0 ? 14 : i === 2 ? -14 : 0, rotateX: 8 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: i === 0 ? 6 : i === 2 ? -6 : 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1.1, ease, delay: i * 0.12 }}
                >
                  <div className="aspect-[16/10] overflow-hidden os-card">
                    {work.screens[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={work.screens[i]} alt={caption} className="h-full w-full object-cover" />
                    ) : (
                      <DummyScreen />
                    )}
                  </div>
                  <figcaption className="mt-4 flex gap-3 text-[15px]">
                    <span className="os-label pt-1">0{i + 1}</span>
                    {caption}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* ── results ── */}
        <section className="border-y border-white/[0.06] px-4 sm:px-8 py-24">
          <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-3">
            {work.results.map((r) => (
              <motion.div key={r.label} {...reveal}>
                <CountUp value={r.value} />
                <p className="mt-3 text-[var(--os-dim)]">{r.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── stack ── */}
        <section className="px-4 sm:px-8 py-24">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
            <span className="os-label mr-4">built with</span>
            {work.stack.map((s) => (
              <span key={s} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">{s}</span>
            ))}
          </div>
        </section>

        {/* ── next project ── */}
        <section className="px-4 sm:px-8 pb-32">
          <Link href={`/work/${next.slug}`} className="group mx-auto block max-w-6xl" style={{ ["--next" as string]: next.accent }}>
            <div className="relative overflow-hidden os-card p-8 sm:p-14 transition-colors duration-500 group-hover:border-[var(--next)]">
              <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: `radial-gradient(60% 80% at 100% 50%, color-mix(in srgb, ${next.accent} 14%, transparent), transparent)` }} />
              <p className="os-label relative">next project</p>
              <div className="relative mt-4 flex items-end justify-between gap-6">
                <h2 className="os-display text-[clamp(44px,8vw,110px)] leading-[0.9]">
                  {next.title}<span style={{ color: next.accent }}>.</span>
                </h2>
                <span className="mb-3 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl transition-all duration-500 group-hover:translate-x-2 group-hover:border-[var(--next)] group-hover:bg-[var(--next)] group-hover:text-black">
                  →
                </span>
              </div>
            </div>
          </Link>
        </section>
      </main>
    </Shell>
  );
}

// "70%" → counts 0→70 and keeps the suffix; non-numeric values ("24/7") render as-is.
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const m = value.match(/^(\d+)(\D*)$/);
  const [n, setN] = useState(m ? 0 : null);

  useEffect(() => {
    if (!inView || !m) return;
    const target = +m[1];
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <p ref={ref} className="os-display text-[clamp(64px,8vw,110px)] leading-none tabular-nums">
      {n === null ? value : `${n}${m![2]}`}
    </p>
  );
}
