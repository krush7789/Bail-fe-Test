"use client";

import React, { useState, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { process } from "@/content/catalog";

export default function PinnedProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scrollable animated: maps scroll position to active step (faster response with less scrolling required)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActiveStep(0);
    } else if (latest < 0.65) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }
  });

  return (
    <section
      ref={containerRef}
      id="process"
      aria-labelledby="process-heading"
      className="bg-[var(--ink-2)] py-20 px-6 overflow-hidden relative text-white"
    >
      {/* Background Aurora Blobs */}
      <div
        className="aurora-blob absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "rgba(237,130,28,0.12)", animationDelay: "-2s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: "rgba(61,69,168,0.20)", animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bail-orange)] mb-3 block">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            A different way to build AI.
          </h2>
        </div>

        {/* Steps List */}
        <div className="flex flex-col">
          {process.map((step, i) => {
            const isActive = activeStep === i;
            const isLast = i === process.length - 1;

            return (
              <div
                key={step.number}
                onClick={() => setActiveStep(i)}
                className="flex gap-8 group cursor-pointer"
              >
                {/* Left column: node + connector */}
                <div className="flex flex-col items-center flex-shrink-0 w-14">
                  {/* Outer Ring + Center Dot */}
                  <div
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-500 relative ${
                      isActive
                        ? "border-2 border-[var(--bail-orange)] bg-[var(--bail-orange)]/15 shadow-[0_0_30px_rgba(237,130,28,0.8)] scale-110"
                        : "border border-white/40 bg-white/10 shadow-none scale-100"
                    }`}
                  >
                    {/* Pulsing Aura Ring when Active */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border border-[var(--bail-orange)] animate-ping opacity-40 pointer-events-none" />
                    )}

                    {/* Center Brand Orange Dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-500 ${
                        isActive
                          ? "bg-[var(--bail-orange)] shadow-[0_0_15px_#ed821c] scale-125"
                          : "bg-white/60 scale-100"
                      }`}
                    />
                  </div>

                  {/* Vertical Line Connector */}
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[3rem] my-1 transition-all duration-500 ${
                        isActive ? "bg-[var(--bail-orange)]/70" : "bg-white/30"
                      }`}
                    />
                  )}
                </div>

                {/* Right column: Content (Softer / Less Faded Text - 1 to 2 shades lighter) */}
                <div
                  className={`pt-1 transition-all duration-500 ${
                    !isLast ? "pb-10" : ""
                  } ${isActive ? "opacity-100 translate-y-0" : "opacity-80 translate-y-0"}`}
                >
                  <p className="text-xs font-mono font-bold text-[var(--bail-orange)] mb-1 tracking-widest">
                    {step.number}
                  </p>
                  <h3
                    className={`text-3xl md:text-4xl font-bold mb-3 tracking-tight transition-colors duration-500 ${
                      isActive ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-base sm:text-lg max-w-lg leading-relaxed transition-colors duration-500 ${
                      isActive ? "text-white/95 font-medium" : "text-slate-300"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Tagline Quote */}
        <p className="mt-20 text-center text-white/70 italic text-lg">
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </p>
      </div>
    </section>
  );
}
