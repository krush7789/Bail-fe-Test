"use client";

import { useEffect, useRef } from "react";

const reasons = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#5158e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Fast delivery",
    description: "Working product in weeks, not months. We move fast without cutting corners.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#5158e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="#5158e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Production quality",
    description: "Engineered to scale, not just prototype. Every system is built to handle real load.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="#5158e9" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="#5158e9" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="#5158e9" strokeWidth="1.5"/>
        <path d="M14 17.5h7M17.5 14v7" stroke="#5158e9" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Full AI stack",
    description: "From model selection to frontend to cloud deployment — we handle the entire system.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" stroke="#5158e9" strokeWidth="1.5"/>
        <path d="M12 7v5l3 3" stroke="#5158e9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Transparent process",
    description: "Clear milestones, no black boxes. You always know what's being built and why.",
  },
];

function ReasonCard({
  reason,
  delay,
}: {
  reason: { icon: React.ReactNode; title: string; description: string };
  delay: string;
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

  return (
    <div
      ref={ref}
      className={`fade-up ${delay} p-8 rounded-2xl border border-[#e8e8e8] bg-white`}
    >
      <div className="w-10 h-10 rounded-lg bg-[#5158e9]/5 flex items-center justify-center mb-4">
        {reason.icon}
      </div>
      <h3 className="text-[16px] font-semibold text-[#0a0a0a] mb-2 tracking-tight">
        {reason.title}
      </h3>
      <p className="text-sm text-[#6b7280] leading-relaxed">{reason.description}</p>
    </div>
  );
}

export default function WhyBail() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="fade-up text-center mb-16">
          <span className="text-xs font-medium tracking-widest uppercase text-[#5158e9]">
            Why us
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
            Why Bit AI Lab
          </h2>
          <p className="mt-4 text-[#6b7280] max-w-md mx-auto">
            We&apos;re not a general-purpose agency. We do one thing and we do it well — build intelligent systems that work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reasons.map((r, i) => (
            <ReasonCard
              key={r.title}
              reason={r}
              delay={`delay-${(i + 1) * 100}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
