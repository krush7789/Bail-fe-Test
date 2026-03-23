"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We dig into your goals, workflows, and data. Together we scope exactly what to build and what success looks like.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "Fast, iterative development. You see working software early and often — not just slides and promises.",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "We ship to production, monitor performance, and optimize. You own everything — code, models, infrastructure.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="py-28 px-6 bg-[#f8f8f8]">
      <div className="max-w-6xl mx-auto">
        <div ref={sectionRef} className="fade-up text-center mb-16">
          <span className="text-xs font-medium tracking-widest uppercase text-[#ed821c]">
            How it works
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
            Simple process,<br />real results.
          </h2>
        </div>

        <div className="relative">
          {/* Connector line (desktop) — top-16 = p-8 padding (32px) + half circle height (32px) = center of circles */}
          <div className="hidden md:block absolute top-16 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-gradient-to-r from-[#ed821c]/40 via-[#2e337a]/40 to-[#ed821c]/40" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
}: {
  step: { number: string; title: string; description: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delays = ["delay-100", "delay-200", "delay-300"];
  const circleColors = [
    "bg-[#ed821c] shadow-[#ed821c]/25",
    "bg-[#2e337a] shadow-[#2e337a]/25",
    "bg-[#ed821c] shadow-[#ed821c]/25",
  ];

  return (
    <div
      ref={ref}
      className={`fade-up ${delays[index]} flex flex-col items-center text-center p-8`}
    >
      <div className="relative mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${circleColors[index]}`}>
          <span className="text-white font-bold text-lg">{step.number}</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-[#0a0a0a] mb-3 tracking-tight">
        {step.title}
      </h3>
      <p className="text-sm text-[#6b7280] leading-relaxed max-w-xs">
        {step.description}
      </p>
    </div>
  );
}
