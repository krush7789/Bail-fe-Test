"use client";

import { useEffect, useRef } from "react";

const stats = [
  { value: "500+", label: "Hours automated per client" },
  { value: "3×", label: "Faster time to market" },
  { value: "10+", label: "AI systems shipped" },
];

export default function Showcase() {
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
    <section className="relative py-32 px-6 bg-[#0a0a0a] overflow-hidden">
      {/* Video placeholder — uncomment <video> when ready */}
      <div
        className="absolute inset-0 -z-10"
        data-video-section="showcase"
      >
        {/* <video autoPlay muted loop playsInline src="/videos/showcase.mp4" className="w-full h-full object-cover opacity-30" /> */}
      </div>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div ref={sectionRef} className="fade-up max-w-6xl mx-auto text-center">
        <span className="text-xs font-medium tracking-widest uppercase text-[#ed821c]">
          Impact
        </span>
        <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white">
          Numbers that speak.
        </h2>
        <p className="mt-4 text-[#6b7280] max-w-md mx-auto">
          Real outcomes delivered to real businesses — not prototypes, production systems.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <StatBlock key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatBlock({
  stat,
  index,
}: {
  stat: { value: string; label: string };
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

  return (
    <div
      ref={ref}
      className={`fade-up ${delays[index]} bg-white/5 backdrop-blur-sm px-8 py-12 flex flex-col items-center gap-2`}
    >
      <span className="text-5xl md:text-6xl font-bold text-white tracking-tight">
        {stat.value}
      </span>
      <span className="text-sm text-[#6b7280]">{stat.label}</span>
    </div>
  );
}
