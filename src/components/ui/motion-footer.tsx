"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

.cf-root {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --pill-bg:          color-mix(in oklch, var(--foreground)  5%, transparent);
  --pill-border:      color-mix(in oklch, var(--foreground) 11%, transparent);
  --pill-shadow:      color-mix(in oklch, var(--foreground)  8%, transparent);
  --pill-highlight:   color-mix(in oklch, var(--foreground) 13%, transparent);

  --pill-bg-hover:    color-mix(in oklch, var(--foreground) 11%, transparent);
  --pill-border-hover:color-mix(in oklch, var(--foreground) 24%, transparent);
}

/* ── Keyframes ─────────────────────────────────────────────────── */
@keyframes cf-breathe {
  from { transform: translate(-50%,-50%) scale(1);   opacity: .35; }
  to   { transform: translate(-50%,-50%) scale(1.12); opacity: .65; }
}
@keyframes cf-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes cf-heartbeat {
  0%,100%  { transform:scale(1);    filter:drop-shadow(0 0 4px rgba(239,68,68,.45)); }
  18%,42%  { transform:scale(1.28); filter:drop-shadow(0 0 12px rgba(239,68,68,.85)); }
  30%      { transform:scale(1); }
}
@keyframes cf-spin-slow { to { transform:rotate(360deg); } }
@keyframes cf-float {
  0%,100% { transform:translateY(0); }
  50%     { transform:translateY(-8px); }
}
@keyframes cf-line-grow {
  from { transform:scaleX(0); }
  to   { transform:scaleX(1); }
}

/* ── Utility classes ────────────────────────────────────────────── */
.cf-breathe  { animation: cf-breathe  9s ease-in-out infinite alternate; }
.cf-marquee  { animation: cf-marquee  38s linear infinite; }
.cf-heartbeat{ animation: cf-heartbeat 2.1s cubic-bezier(.25,1,.5,1) infinite; }
.cf-float    { animation: cf-float    4s ease-in-out infinite; }

/* Background grid */
.cf-grid {
  background-size: 54px 54px;
  background-image:
    linear-gradient(to right,  color-mix(in oklch,var(--foreground) 5%,transparent) 1px,transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch,var(--foreground) 5%,transparent) 1px,transparent 1px);
  mask-image: linear-gradient(to bottom,transparent,black 22%,black 78%,transparent);
  -webkit-mask-image: linear-gradient(to bottom,transparent,black 22%,black 78%,transparent);
}

/* Aurora */
.cf-aurora {
  background: radial-gradient(ellipse at 50% 55%,
    color-mix(in oklch,#ed821c 12%,transparent) 0%,
    color-mix(in oklch,#2e337a 12%,transparent) 44%,
    transparent 70%);
}

/* Pill glass */
.cf-pill {
  background: var(--pill-bg);
  border: 1px solid var(--pill-border);
  box-shadow: 0 6px 20px -6px var(--pill-shadow), inset 0 1px 1px var(--pill-highlight);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: background .34s cubic-bezier(.16,1,.3,1),
              border-color .34s cubic-bezier(.16,1,.3,1),
              box-shadow .34s cubic-bezier(.16,1,.3,1);
}
.cf-pill:hover {
  background: var(--pill-bg-hover);
  border-color: var(--pill-border-hover);
  box-shadow: 0 14px 32px -8px var(--pill-shadow), inset 0 1px 1px var(--pill-highlight);
}

/* Giant BG text */
.cf-bg-word {
  font-family: 'Syne', sans-serif;
  font-size: clamp(120px,22vw,320px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch,var(--foreground) 7%,transparent);
  background: linear-gradient(180deg,
    color-mix(in oklch,var(--foreground) 14%,transparent) 0%,
    transparent 55%);
  -webkit-background-clip: text;
  background-clip: text;
  user-select: none;
  pointer-events: none;
}

/* Heading font */
.cf-heading {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 0.92;
}

/* Word reveal wrapper — GSAP clips into this */
.cf-word-wrap {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
}
.cf-word {
  display: inline-block;
  will-change: transform, opacity;
}

/* Orange accent word */
.cf-word-accent {
  background: linear-gradient(120deg,#ed821c 0%,#f5a83d 55%,#ed821c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* CTA primary */
.cf-cta {
  background: linear-gradient(130deg,#ed821c 0%,#f5a340 50%,#ed821c 100%);
  background-size: 200% 200%;
  transition: box-shadow .35s ease, transform .22s ease;
}
.cf-cta:hover {
  box-shadow: 0 14px 36px -8px rgba(237,130,28,.55);
  transform: translateY(-2px) scale(1.01);
}

/* Stat card */
.cf-stat-card {
  background: color-mix(in oklch,var(--foreground) 3.5%,transparent);
  border: 1px solid color-mix(in oklch,var(--foreground) 9%,transparent);
  transition: background .3s, border-color .3s;
}
.cf-stat-card:hover {
  background: color-mix(in oklch,var(--foreground) 7%,transparent);
  border-color: color-mix(in oklch,#ed821c 35%,transparent);
}

/* Divider line */
.cf-divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    color-mix(in oklch,var(--foreground) 14%,transparent) 40%,
    color-mix(in oklch,#ed821c 30%,transparent) 60%,
    transparent 100%);
  transform-origin: center;
  transform: scaleX(0);
}

/* Orbit ring */
.cf-orbit {
  border-radius: 50%;
  border: 1px dashed color-mix(in oklch,var(--foreground) 9%,transparent);
  animation: cf-spin-slow 22s linear infinite;
}
`;

// ---------------------------------------------------------------------------
// MAGNETIC BUTTON
// ---------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as?: React.ElementType };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, fRef) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      const el = ref.current;
      if (!el || typeof window === "undefined") return;
      const ctx = gsap.context(() => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top  - r.height / 2;
          gsap.to(el, { x: x*.4, y: y*.4, rotationX: -y*.12, rotationY: x*.12, scale: 1.05, ease:"power2.out", duration:.36 });
        };
        const leave = () =>
          gsap.to(el, { x:0, y:0, rotationX:0, rotationY:0, scale:1, ease:"elastic.out(1,.3)", duration:1.1 });
        el.addEventListener("mousemove", move as any);
        el.addEventListener("mouseleave", leave);
        return () => { el.removeEventListener("mousemove", move as any); el.removeEventListener("mouseleave", leave); };
      }, el);
      return () => ctx.revert();
    }, []);

    const C = Component as any;
    return (
      <C
        ref={(n: HTMLElement) => {
          (ref as any).current = n;
          if (typeof fRef === "function") fRef(n);
          else if (fRef) (fRef as any).current = n;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </C>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// ---------------------------------------------------------------------------
// MARQUEE ROW
// ---------------------------------------------------------------------------
const MarqueeRow = () => (
  <div className="flex items-center gap-12 px-8 text-[11px] font-bold tracking-[0.3em] uppercase whitespace-nowrap">
    <span>AI Chatbots</span>
    <span className="text-[#ed821c]/60">✦</span>
    <span>Voice AI Agents</span>
    <span className="text-[#2e337a]/60">✦</span>
    <span>Business Automation</span>
    <span className="text-[#ed821c]/60">✦</span>
    <span>RAG Systems</span>
    <span className="text-[#2e337a]/60">✦</span>
    <span>SaaS Development</span>
    <span className="text-[#ed821c]/60">✦</span>
    <span>Performance Marketing</span>
    <span className="text-[#2e337a]/60">✦</span>
    <span>30 Services</span>
    <span className="text-[#ed821c]/60">✦</span>
    <span>Delivered in 2 Weeks</span>
    <span className="text-[#2e337a]/60">✦</span>
  </div>
);

// ---------------------------------------------------------------------------
// STATS
// ---------------------------------------------------------------------------
const STATS = [
  { value: "30+",    label: "AI Services",       sub: "across 4 verticals" },
  { value: "2 wks",  label: "Delivery Speed",    sub: "from brief to live" },
  { value: "100%",   label: "Fully Managed",     sub: "we own the outcome" },
];

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
export function CinematicFooter() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const bgWordRef   = useRef<HTMLDivElement>(null);
  const dividerRef  = useRef<HTMLDivElement>(null);
  const word1Ref    = useRef<HTMLSpanElement>(null);
  const word2Ref    = useRef<HTMLSpanElement>(null);
  const word3Ref    = useRef<HTMLSpanElement>(null);
  const word4Ref    = useRef<HTMLSpanElement>(null);
  const taglineRef  = useRef<HTMLParagraphElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const ctasRef     = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLDivElement>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const orbitRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;

    // Refresh once so fixed+clip-path layout is measured correctly
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      const trigger = wrapperRef.current!;

      // ── 1. BG word: dramatic parallax from below ────────────────────
      gsap.fromTo(bgWordRef.current,
        { y: "18vh", scale: .78, opacity: 0 },
        { y: "-4vh",  scale: 1.04, opacity: 1, ease: "none",
          scrollTrigger: { trigger, start: "top 100%", end: "bottom bottom", scrub: 1.6 } }
      );

      // ── 2. Divider line grows from center ───────────────────────────
      gsap.to(dividerRef.current,
        { scaleX: 1, duration: 1.2, ease: "power3.inOut",
          scrollTrigger: { trigger, start: "top 65%", toggleActions: "play none none reverse" } }
      );

      // ── 3. Heading words: clip-path slide-up reveal ─────────────────
      const words = [word1Ref.current, word2Ref.current, word3Ref.current, word4Ref.current];
      gsap.fromTo(words,
        { y: "110%", opacity: 0, rotateX: -18, transformOrigin: "50% 0%" },
        { y: "0%",   opacity: 1, rotateX: 0,
          stagger: { amount: .45 },
          duration: .9, ease: "power4.out",
          scrollTrigger: { trigger, start: "top 60%", toggleActions: "play none none reverse" } }
      );

      // ── 4. Tagline ───────────────────────────────────────────────────
      gsap.fromTo(taglineRef.current,
        { y: 28, opacity: 0, filter: "blur(6px)" },
        { y: 0,  opacity: 1, filter: "blur(0px)", duration: .85, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 55%", toggleActions: "play none none reverse" } }
      );

      // ── 5. Stat cards: pop in with stagger ─────────────────────────
      if (statsRef.current) {
        gsap.fromTo(statsRef.current.children,
          { y: 36, opacity: 0, scale: .88 },
          { y: 0,  opacity: 1, scale: 1,
            stagger: { amount: .35 },
            duration: .75, ease: "back.out(1.4)",
            scrollTrigger: { trigger, start: "top 50%", toggleActions: "play none none reverse" } }
        );
      }

      // ── 6. CTAs ──────────────────────────────────────────────────────
      gsap.fromTo(ctasRef.current,
        { y: 32, opacity: 0 },
        { y: 0,  opacity: 1, duration: .7, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 45%", toggleActions: "play none none reverse" } }
      );

      // ── 7. Nav links ─────────────────────────────────────────────────
      if (navRef.current) {
        gsap.fromTo(navRef.current.children,
          { y: 22, opacity: 0 },
          { y: 0,  opacity: 1,
            stagger: { amount: .28 },
            duration: .55, ease: "power2.out",
            scrollTrigger: { trigger, start: "top 40%", toggleActions: "play none none reverse" } }
        );
      }

      // ── 8. Bottom bar slides up ───────────────────────────────────────
      gsap.fromTo(bottomRef.current,
        { y: 24, opacity: 0 },
        { y: 0,  opacity: 1, duration: .7, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 35%", toggleActions: "play none none reverse" } }
      );

      // ── 9. Orbit ring slow grow ───────────────────────────────────────
      gsap.fromTo(orbitRef.current,
        { scale: .4, opacity: 0 },
        { scale: 1,  opacity: 1, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger, start: "top 65%", toggleActions: "play none none reverse" } }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/*
        CURTAIN REVEAL WRAPPER
        clip-path keeps the fixed footer hidden until this wrapper
        scrolls into view — the footer "rises" as you scroll down.
      */}
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="cf-root fixed bottom-0 left-0 h-screen w-full overflow-hidden bg-background text-foreground flex flex-col">

          {/* Ambient glow */}
          <div className="cf-aurora cf-breathe absolute left-1/2 top-1/2 h-[70vh] w-[85vw] rounded-[50%] blur-[100px] pointer-events-none z-0" />

          {/* Grid */}
          <div className="cf-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Decorative orbit ring */}
          <div
            ref={orbitRef}
            className="cf-orbit absolute right-[8%] top-[18%] w-[280px] h-[280px] opacity-0 hidden lg:block z-0 pointer-events-none"
          />

          {/* Giant BG word */}
          <div
            ref={bgWordRef}
            className="cf-bg-word absolute -bottom-[3vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 select-none opacity-0"
          >
            BITS
          </div>

          {/* ── Marquee ─────────────────────────────────────────────── */}
          <div className="absolute top-0 left-0 w-full overflow-hidden border-b border-foreground/[0.06] bg-background/80 backdrop-blur-md py-3.5 z-10 shadow-sm">
            <div className="cf-marquee flex w-max text-muted-foreground">
              <MarqueeRow />
              <MarqueeRow />
            </div>
          </div>

          {/* ── Main content ─────────────────────────────────────────── */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pt-16 pb-4 w-full max-w-4xl mx-auto gap-8">

            {/* Divider */}
            <div ref={dividerRef} className="cf-divider w-full max-w-xs" />

            {/* Heading — word-by-word reveal */}
            <h2 className="cf-heading text-[clamp(3rem,9vw,7rem)] text-center leading-none perspective-[600px]">
              <span className="cf-word-wrap">
                <span ref={word1Ref} className="cf-word inline-block mr-[0.18em]">Build</span>
              </span>
              <span className="cf-word-wrap">
                <span ref={word2Ref} className="cf-word cf-word-accent inline-block">Smarter.</span>
              </span>
              <br />
              <span className="cf-word-wrap">
                <span ref={word3Ref} className="cf-word inline-block mr-[0.18em]">Grow</span>
              </span>
              <span className="cf-word-wrap">
                <span ref={word4Ref} className="cf-word cf-word-accent inline-block">Faster.</span>
              </span>
            </h2>

            {/* Tagline */}
            <p ref={taglineRef} className="text-muted-foreground text-sm md:text-base font-medium text-center max-w-md leading-relaxed opacity-0">
              30 AI services. Delivered in weeks.<br className="hidden md:block" /> Fully managed — we own the outcome.
            </p>

            {/* Stats row */}
            <div ref={statsRef} className="flex flex-wrap justify-center gap-3 w-full">
              {STATS.map((s) => (
                <div key={s.label} className="cf-stat-card rounded-2xl px-6 py-4 flex flex-col items-center gap-0.5 min-w-[120px]">
                  <span className="font-bold text-xl md:text-2xl text-foreground" style={{ fontFamily: "'Syne',sans-serif" }}>
                    {s.value}
                  </span>
                  <span className="text-xs font-semibold text-foreground/70 uppercase tracking-widest">{s.label}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</span>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div ref={ctasRef} className="flex flex-wrap justify-center gap-3 opacity-0">
              <MagneticButton
                as="a"
                href="#contact"
                className="cf-cta px-9 py-3.5 rounded-full text-white font-bold text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Start a Project
              </MagneticButton>

              <MagneticButton
                as="a"
                href="#services"
                className="cf-pill px-9 py-3.5 rounded-full text-foreground font-semibold text-sm flex items-center gap-2 group"
              >
                <svg className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-[#ed821c] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Explore Services
              </MagneticButton>
            </div>

            {/* Nav links */}
            <nav ref={navRef} className="flex flex-wrap justify-center gap-2">
              {["Services", "Process", "About Us", "Contact"].map((l) => (
                <MagneticButton
                  key={l}
                  as="a"
                  href={`#${l.toLowerCase().replace(" ", "")}`}
                  className="cf-pill px-4 py-2 rounded-full text-muted-foreground text-xs font-medium hover:text-foreground"
                >
                  {l}
                </MagneticButton>
              ))}
            </nav>
          </div>

          {/* ── Bottom bar ───────────────────────────────────────────── */}
          <div
            ref={bottomRef}
            className="relative z-20 w-full px-6 md:px-12 pb-7 pt-3 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-foreground/[0.06] opacity-0"
          >
            <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase order-2 md:order-1">
              © 2026 Bits AI Lab. All rights reserved.
            </p>

            <div className="cf-pill px-5 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default">
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Crafted with</span>
              <span className="cf-heartbeat text-sm text-[#ef4444]">❤</span>
              <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">in India</span>
            </div>

            <MagneticButton
              as="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="cf-pill w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground group order-3"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-y-1.5 transition-transform duration-300"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </MagneticButton>
          </div>

        </footer>
      </div>
    </>
  );
}
