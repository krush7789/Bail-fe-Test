"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const timer = setTimeout(() => el.classList.add("visible"), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden fade-up"
    >
      {/* Video placeholder — uncomment <video> when ready */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-[#f8f8ff] to-[#eef0ff]"
        data-video-section="hero"
      >
        {/* <video autoPlay muted loop playsInline src="/videos/hero.mp4" className="w-full h-full object-cover" /> */}
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0a0a0a 1px, transparent 1px), linear-gradient(90deg, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        {/* Eyebrow */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5158e9]/30 bg-[#5158e9]/5 text-[#5158e9] text-xs font-medium tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5158e9] animate-pulse" />
          AI Agency
        </span>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0a0a0a] leading-[1.08]">
          We build the AI that<br />
          <span className="text-[#5158e9]">builds your business.</span>
        </h1>

        {/* Sub */}
        <p className="max-w-xl text-lg text-[#6b7280] leading-relaxed">
          From intelligent automation to custom AI products — Bit AI Lab turns ambitious ideas into production-grade systems.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <a
            href="#contact"
            className="px-7 py-3 rounded-full bg-[#5158e9] text-white font-medium text-sm hover:bg-[#4048d4] transition-colors duration-200 shadow-lg shadow-[#5158e9]/20"
          >
            Start a project
          </a>
          <a
            href="#services"
            className="px-7 py-3 rounded-full border border-[#e8e8e8] text-[#0a0a0a] font-medium text-sm hover:border-[#0a0a0a]/30 hover:bg-[#f8f8f8] transition-colors duration-200"
          >
            See our work →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-[#6b7280] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#6b7280] to-transparent" />
      </div>
    </section>
  );
}
