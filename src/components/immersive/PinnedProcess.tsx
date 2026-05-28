"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { process } from "@/content/catalog";

// ----- Reduced-motion fallback: simple vertical list -----
function StaticProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="process"
      ref={ref}
      className="bg-[var(--ink)] py-28 px-6"
      aria-labelledby="process-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange mb-3 block">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            From scope to live system in weeks
          </h2>
        </div>
        <div className="flex flex-col gap-16">
          {process.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.55, delay: i * 0.15, ease: "easeOut" }}
              className="flex flex-col gap-4 relative pl-8"
            >
              <div className="w-12 h-0.5 bg-bail-orange rounded-full absolute left-0 top-3" />
              <span className="text-7xl font-bold text-white/5 leading-none select-none absolute -top-4 left-0">
                {step.number}
              </span>
              <h3 className="text-3xl font-bold text-white mt-8">{step.title}</h3>
              <p className="text-lg text-white/60 max-w-xl leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----- GSAP pinned section -----
export default function PinnedProcess() {
  const prefersReduced = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];

      // Set all panels to initial state
      gsap.set(panels, { opacity: 0, y: 60 });
      gsap.set(panels[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: stickyRef.current,
          pinSpacing: false,
          anticipatePin: 1,
        },
      });

      tlRef.current = tl;

      // Step 0 → 1
      tl.to(panels[0], { opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, 0.1)
        .to(panels[1], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.3);

      // Step 1 → 2
      tl.to(panels[1], { opacity: 0, y: -60, duration: 0.4, ease: "power2.in" }, 0.6)
        .to(panels[2], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.8);
    }, outerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReduced]);

  if (prefersReduced) {
    return <StaticProcess />;
  }

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="bg-[var(--ink)]"
    >
      {/* Tall outer wrapper — 300vh for scroll travel */}
      <div ref={outerRef} style={{ height: "300vh", position: "relative" }}>
        {/* Sticky container — pinned to screen height */}
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        >
          {/* Background aurora blobs */}
          <div
            className="aurora-blob absolute top-[-20%] right-[-10%] w-[600px] h-[600px]"
            style={{ background: "rgba(237,130,28,0.10)", animationDelay: "-2s" }}
            aria-hidden="true"
          />
          <div
            className="aurora-blob absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px]"
            style={{ background: "rgba(61,69,168,0.18)", animationDelay: "-6s" }}
            aria-hidden="true"
          />

          {/* Section label */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center z-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange">
              Our Process
            </span>
          </div>

          {/* Progress indicator */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10 hidden lg:flex">
            {process.map((step) => (
              <div
                key={step.number}
                className="w-1.5 h-1.5 rounded-full bg-white/20"
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Step panels — absolutely stacked */}
          <div className="relative w-full max-w-4xl mx-auto px-8 md:px-16">
            {process.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { panelsRef.current[i] = el; }}
                className="absolute inset-0 flex flex-col justify-center will-change-transform"
                style={{ position: i === 0 ? "relative" : "absolute", top: 0, left: 0, right: 0 }}
              >
                {/* Giant background number */}
                <span
                  className="absolute -top-8 -left-4 md:-left-8 text-[clamp(8rem,20vw,18rem)] font-bold leading-none select-none"
                  style={{ color: "rgba(255,255,255,0.03)" }}
                  aria-hidden="true"
                >
                  {step.number}
                </span>

                {/* Content */}
                <div className="relative z-10 flex flex-col gap-6">
                  {/* Orange accent line */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-0.5 bg-bail-orange rounded-full" />
                    <span className="text-bail-orange font-mono text-sm font-bold tracking-widest">
                      {step.number}
                    </span>
                  </div>

                  <h2
                    id={i === 0 ? "process-heading" : undefined}
                    className="text-5xl md:text-7xl font-bold text-white leading-tight"
                  >
                    {step.title}
                  </h2>

                  <p className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
