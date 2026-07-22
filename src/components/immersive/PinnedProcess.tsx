"use client";

import React, { useState, useEffect } from "react";
import { process } from "@/content/catalog";

export default function PinnedProcess() {
  const [activeStep, setActiveStep] = useState(0);

  // Automatic sequential animation loop: Discover (0) -> Build (1) -> Deploy (2) -> repeat
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % process.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="bg-[var(--ink-2)] py-32 px-6 overflow-hidden relative text-white"
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
        <div className="mb-16">
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
              <div key={step.number} className="flex gap-8 group">
                {/* Left column: node + connector */}
                <div className="flex flex-col items-center flex-shrink-0 w-14">
                  {/* Outer Ring + Center Dot */}
                  <div
                    className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-700 relative ${
                      isActive
                        ? "border-2 border-[var(--bail-orange)] bg-[var(--bail-orange)]/15 shadow-[0_0_30px_rgba(237,130,28,0.8)] scale-110"
                        : "border border-white/20 bg-white/5 shadow-none scale-100"
                    }`}
                  >
                    {/* Pulsing Aura Ring when Active */}
                    {isActive && (
                      <span className="absolute inset-0 rounded-full border border-[var(--bail-orange)] animate-ping opacity-40 pointer-events-none" />
                    )}

                    {/* Center Brand Orange Dot */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-700 ${
                        isActive
                          ? "bg-[var(--bail-orange)] shadow-[0_0_15px_#ed821c] scale-125"
                          : "bg-white/30 scale-100"
                      }`}
                    />
                  </div>

                  {/* Vertical Line Connector */}
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[4rem] my-1 transition-all duration-700 ${
                        isActive ? "bg-[var(--bail-orange)]/70" : "bg-white/15"
                      }`}
                    />
                  )}
                </div>

                {/* Right column: Content */}
                <div
                  className={`pt-1 transition-all duration-700 ${
                    !isLast ? "pb-14" : ""
                  } ${isActive ? "opacity-100 translate-y-0" : "opacity-35 translate-y-1"}`}
                >
                  <p className="text-xs font-mono font-bold text-[var(--bail-orange)] mb-1 tracking-widest">
                    {step.number}
                  </p>
                  <h3
                    className={`text-3xl md:text-4xl font-bold mb-3 tracking-tight transition-colors duration-700 ${
                      isActive ? "text-white" : "text-white/40"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-base sm:text-lg max-w-lg leading-relaxed transition-colors duration-700 ${
                      isActive ? "text-white/80" : "text-white/30"
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
        <p className="mt-20 text-center text-white/50 italic text-lg">
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </p>
      </div>
    </section>
  );
}
