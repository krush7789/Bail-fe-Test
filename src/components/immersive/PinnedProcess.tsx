"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";
import { process } from "@/content/catalog";

// Thresholds at which each node lights up
const NODE_THRESHOLDS: [number, number, number][] = [
  [0, 0.2, 0.4],
  [0.3, 0.5, 0.7],
  [0.6, 0.8, 1.0],
];

// Static fallback for reduced-motion preference
function StaticProcess() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="bg-[var(--ink)] py-32 px-6 overflow-hidden relative"
    >
      {/* Aurora blobs */}
      <div
        className="aurora-blob absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "rgba(237,130,28,0.10)", animationDelay: "-2s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: "rgba(61,69,168,0.15)", animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Heading */}
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange mb-3 block">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            A different way to build AI.
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Faint rail */}
          <div
            className="absolute left-[27px] top-0 bottom-0 w-px bg-white/8"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-20">
            {process.map((step) => (
              <div key={step.number} className="flex items-start gap-8 relative">
                {/* Node */}
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full border border-bail-orange/20 relative">
                  <div
                    className="w-3 h-3 rounded-full bg-bail-orange"
                    style={{ boxShadow: "0 0 12px rgba(237,130,28,0.8)" }}
                  />
                </div>
                {/* Content */}
                <div className="pt-3">
                  <p className="text-xs font-mono text-bail-orange/50 mb-1 tracking-widest">
                    {step.number}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-lg max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing line */}
        <p className="mt-20 text-center text-white/50 italic text-lg">
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </p>
      </div>
    </section>
  );
}

// Individual animated step — all derived MotionValues passed in from parent
function ProcessStep({
  step,
  nodeOpacity,
  ringBorderColor,
  dotBoxShadow,
}: {
  step: (typeof process)[number];
  nodeOpacity: MotionValue<number>;
  ringBorderColor: MotionValue<string>;
  dotBoxShadow: MotionValue<string>;
}) {
  return (
    <div className="flex items-start gap-8 relative">
      {/* Glowing node */}
      <motion.div
        className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full border border-bail-orange/20 relative"
        style={{ opacity: nodeOpacity }}
      >
        {/* Ring brightens as beam arrives */}
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: ringBorderColor }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-bail-orange"
          style={{ boxShadow: dotBoxShadow }}
        />
      </motion.div>

      {/* Content fades in with the node */}
      <motion.div className="pt-3" style={{ opacity: nodeOpacity }}>
        <p className="text-xs font-mono text-bail-orange/50 mb-1 tracking-widest">
          {step.number}
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
          {step.title}
        </h3>
        <p className="text-white/60 leading-relaxed text-lg max-w-lg">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

// All motion values for a single step, derived from a shared smoothProgress
function useStepValues(
  smoothProgress: MotionValue<number>,
  thresholds: [number, number, number]
): {
  nodeOpacity: MotionValue<number>;
  ringBorderColor: MotionValue<string>;
  dotBoxShadow: MotionValue<string>;
} {
  const nodeOpacity = useTransform(smoothProgress, thresholds, [0.3, 1, 1]);
  const ringBorderColor = useTransform(
    smoothProgress,
    thresholds,
    [
      "rgba(237,130,28,0)",
      "rgba(237,130,28,0.5)",
      "rgba(237,130,28,0.5)",
    ]
  );
  const dotBoxShadow = useTransform(
    smoothProgress,
    thresholds,
    [
      "0 0 4px rgba(237,130,28,0.3)",
      "0 0 16px rgba(237,130,28,0.9)",
      "0 0 16px rgba(237,130,28,0.9)",
    ]
  );
  return { nodeOpacity, ringBorderColor, dotBoxShadow };
}

// Main animated component
function AnimatedProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.3"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 80,
  });

  const beamHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Derive all per-step motion values at hook level (Rules of Hooks safe — fixed array)
  const step0 = useStepValues(smoothProgress, NODE_THRESHOLDS[0]);
  const step1 = useStepValues(smoothProgress, NODE_THRESHOLDS[1]);
  const step2 = useStepValues(smoothProgress, NODE_THRESHOLDS[2]);

  const stepValues = [step0, step1, step2];

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="bg-[var(--ink)] py-32 px-6 overflow-hidden relative"
    >
      {/* Aurora blobs */}
      <div
        className="aurora-blob absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "rgba(237,130,28,0.10)", animationDelay: "-2s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: "rgba(61,69,168,0.15)", animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Heading */}
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange mb-3 block">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-bold text-white leading-tight"
          >
            A different way to build AI.
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Faint full-height rail */}
          <div
            className="absolute left-[27px] top-0 bottom-0 w-px bg-white/8"
            aria-hidden="true"
          />

          {/* Animated glowing beam grows as section scrolls */}
          <motion.div
            className="absolute left-[27px] top-0 w-px"
            style={{
              height: beamHeight,
              background:
                "linear-gradient(to bottom, rgba(237,130,28,1), rgba(237,130,28,0))",
            }}
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="flex flex-col gap-20">
            {process.map((step, i) => (
              <ProcessStep
                key={step.number}
                step={step}
                nodeOpacity={stepValues[i].nodeOpacity}
                ringBorderColor={stepValues[i].ringBorderColor}
                dotBoxShadow={stepValues[i].dotBoxShadow}
              />
            ))}
          </div>
        </div>

        {/* Closing quote */}
        <p className="mt-20 text-center text-white/50 italic text-lg">
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </p>
      </div>
    </section>
  );
}

export default function PinnedProcess() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <StaticProcess />;
  }

  return <AnimatedProcess />;
}
