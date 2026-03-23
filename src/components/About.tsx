"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function About() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div ref={leftRef} className="fade-up">
          <span className="text-xs font-medium tracking-widest uppercase text-[#5158e9]">
            About
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a] leading-tight">
            Intelligence,<br />engineered.
          </h2>
          <p className="mt-6 text-[#6b7280] leading-relaxed">
            Bit AI Lab is an AI agency built by engineers and product thinkers who believe every business deserves access to powerful, practical AI.
          </p>
          <p className="mt-4 text-[#6b7280] leading-relaxed">
            We don&apos;t sell buzzwords. We build systems that actually run, scale, and deliver measurable value — from day one.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="px-5 py-3 rounded-xl bg-[#f8f8f8] border border-[#e8e8e8]">
              <div className="text-2xl font-bold text-[#0a0a0a]">2+</div>
              <div className="text-xs text-[#6b7280] mt-0.5">Years in AI</div>
            </div>
            <div className="px-5 py-3 rounded-xl bg-[#f8f8f8] border border-[#e8e8e8]">
              <div className="text-2xl font-bold text-[#0a0a0a]">15+</div>
              <div className="text-xs text-[#6b7280] mt-0.5">Projects shipped</div>
            </div>
            <div className="px-5 py-3 rounded-xl bg-[#f8f8f8] border border-[#e8e8e8]">
              <div className="text-2xl font-bold text-[#0a0a0a]">100%</div>
              <div className="text-xs text-[#6b7280] mt-0.5">Client ownership</div>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div
          ref={rightRef}
          className="fade-up delay-200 relative flex items-center justify-center"
        >
          {/* Video placeholder */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            data-video-section="about"
          >
            {/* <video autoPlay muted loop playsInline src="/videos/about.mp4" className="w-full h-full object-cover" /> */}
          </div>

          {/* Logo visual */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5158e9]/5 to-[#5158e9]/10 border border-[#5158e9]/10" />
            <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-white to-[#f8f8ff] border border-[#e8e8e8]" />
            <Image
              src="/logo.svg"
              alt="Bit AI Lab"
              width={140}
              height={72}
              className="relative z-10 opacity-90"
            />
          </div>

          {/* Floating accent */}
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-[#5158e9]/8 border border-[#5158e9]/15 backdrop-blur-sm" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl bg-[#ed821c]/8 border border-[#ed821c]/15" />
        </div>
      </div>
    </section>
  );
}
