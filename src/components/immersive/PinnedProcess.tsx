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

const NODE_THRESHOLDS: [number, number, number][] = [
  [0,    0.18, 0.35],  // Discover
  [0.3,  0.48, 0.62],  // Build
  [0.58, 0.75, 0.9 ],  // Deploy
];

// ─── Static fallback ────────────────────────────────────────────────────────
function StaticProcess() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="bg-[#f5f6f9] py-32 px-6 overflow-hidden relative"
    >
      <div
        className="aurora-blob absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "rgba(237,130,28,0.12)", animationDelay: "-2s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: "rgba(61,69,168,0.10)", animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange mb-3 block">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
          >
            A different way to build AI.
          </h2>
        </div>

        <div className="flex flex-col">
          {process.map((step, i) => {
            const isLast = i === process.length - 1;
            return (
              <div key={step.number} className="flex gap-8">
                {/* Left column: node + connector */}
                <div className="flex flex-col items-center flex-shrink-0 w-14">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full border border-bail-orange/30 bg-white relative">
                    <div
                      className="w-3 h-3 rounded-full bg-bail-orange"
                      style={{ boxShadow: "0 0 12px rgba(237,130,28,0.7)" }}
                    />
                  </div>
                  {/* Connector stops here — not rendered on last step */}
                  {!isLast && (
                    <div className="w-px flex-1 bg-gray-200 mt-1" aria-hidden="true" />
                  )}
                </div>

                {/* Right column: content */}
                <div className={`pt-3 ${!isLast ? "pb-16" : ""}`}>
                  <p className="text-xs font-mono text-bail-orange/70 mb-1 tracking-widest">
                    {step.number}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-lg max-w-lg">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-20 text-center text-gray-400 italic text-lg">
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </p>
      </div>
    </section>
  );
}

// ─── Animated step ───────────────────────────────────────────────────────────
function ProcessStep({
  step,
  nodeOpacity,
  ringBorderColor,
  dotBoxShadow,
  isLast,
}: {
  step: (typeof process)[number];
  nodeOpacity: MotionValue<number>;
  ringBorderColor: MotionValue<string>;
  dotBoxShadow: MotionValue<string>;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-8">
      {/* Left column: node + connector */}
      <div className="flex flex-col items-center flex-shrink-0 w-14">
        <motion.div
          className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full border border-bail-orange/30 bg-white relative"
          style={{ opacity: nodeOpacity }}
        >
          <motion.div
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: ringBorderColor }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-bail-orange"
            style={{ boxShadow: dotBoxShadow }}
          />
        </motion.div>
        {/* Connector — absent on last step */}
        {!isLast && (
          <div className="w-px flex-1 bg-gray-200 mt-1" aria-hidden="true" />
        )}
      </div>

      {/* Right column: content */}
      <motion.div
        className={`pt-3 ${!isLast ? "pb-16" : ""}`}
        style={{ opacity: nodeOpacity }}
      >
        <p className="text-xs font-mono text-bail-orange/70 mb-1 tracking-widest">
          {step.number}
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {step.title}
        </h3>
        <p className="text-gray-500 leading-relaxed text-lg max-w-lg">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

// ─── Per-step motion values ──────────────────────────────────────────────────
function useStepValues(
  smoothProgress: MotionValue<number>,
  thresholds: [number, number, number]
) {
  const nodeOpacity = useTransform(smoothProgress, thresholds, [0.3, 1, 1]);
  const ringBorderColor = useTransform(smoothProgress, thresholds, [
    "rgba(237,130,28,0)",
    "rgba(237,130,28,0.5)",
    "rgba(237,130,28,0.5)",
  ]);
  const dotBoxShadow = useTransform(smoothProgress, thresholds, [
    "0 0 4px rgba(237,130,28,0.3)",
    "0 0 16px rgba(237,130,28,0.9)",
    "0 0 16px rgba(237,130,28,0.9)",
  ]);
  return { nodeOpacity, ringBorderColor, dotBoxShadow };
}

// ─── Animated main ───────────────────────────────────────────────────────────
function AnimatedProcess() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.7", "end 0.45"],
  });

  const smoothProgress = useSpring(scrollYProgress, { damping: 30, stiffness: 80 });

  const step0 = useStepValues(smoothProgress, NODE_THRESHOLDS[0]);
  const step1 = useStepValues(smoothProgress, NODE_THRESHOLDS[1]);
  const step2 = useStepValues(smoothProgress, NODE_THRESHOLDS[2]);
  const stepValues = [step0, step1, step2];

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      className="bg-[#f5f6f9] py-32 px-6 overflow-hidden relative"
    >
      <div
        className="aurora-blob absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "rgba(237,130,28,0.12)", animationDelay: "-2s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-0 left-0 w-[350px] h-[350px] pointer-events-none"
        style={{ background: "rgba(61,69,168,0.10)", animationDelay: "-6s" }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange mb-3 block">
            Our Process
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
          >
            A different way to build AI.
          </h2>
        </div>

        <div className="flex flex-col">
          {process.map((step, i) => (
            <ProcessStep
              key={step.number}
              step={step}
              isLast={i === process.length - 1}
              nodeOpacity={stepValues[i].nodeOpacity}
              ringBorderColor={stepValues[i].ringBorderColor}
              dotBoxShadow={stepValues[i].dotBoxShadow}
            />
          ))}
        </div>

        <p className="mt-20 text-center text-gray-400 italic text-lg">
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </p>
      </div>
    </section>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export default function PinnedProcess() {
  const prefersReduced = useReducedMotion();
  return prefersReduced ? <StaticProcess /> : <AnimatedProcess />;
}
