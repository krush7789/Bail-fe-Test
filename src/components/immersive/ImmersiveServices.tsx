"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { pillars, onRequest } from "@/content/catalog";

type ServiceType = (typeof pillars)[0]["services"][0];

function SpotlightCard({
  service,
  index,
  accentColor,
}: {
  service: ServiceType;
  index: number;
  accentColor: "orange" | "cyan";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const spotlightGradient =
    accentColor === "orange"
      ? "radial-gradient(300px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), rgba(237,130,28,0.08), transparent 70%)"
      : "radial-gradient(300px circle at var(--mouse-x, -9999px) var(--mouse-y, -9999px), rgba(0,212,255,0.07), transparent 70%)";

  const hookColor =
    accentColor === "orange" ? "text-bail-orange" : "text-[var(--glow-cyan)]";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--mouse-x", "-9999px");
    e.currentTarget.style.setProperty("--mouse-y", "-9999px");
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    >
      <div
        className="relative rounded-2xl border border-white/[0.08] bg-[var(--ink-3)] overflow-hidden cursor-default transition-colors duration-300 hover:border-white/[0.15] group min-h-[180px] p-6"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Spotlight layer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
          style={{ background: spotlightGradient }}
        />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Service number */}
          <span className="font-mono text-xs text-white/25 mb-3 block">
            {String(service.id).padStart(2, "0")}
          </span>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 leading-snug">
            {service.title}
          </h3>

          {/* Hook */}
          <p className={`text-sm font-medium mb-4 leading-snug ${hookColor}`}>
            {service.hook}
          </p>

          {/* whatWeBuild chips */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {service.whatWeBuild.map((item, i) => (
              <span
                key={i}
                className="bg-white/5 border border-white/[0.08] px-2 py-0.5 text-[10px] text-white/50 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ImmersiveServices() {
  return (
    <section
      id="services"
      className="py-28 px-6 bg-[var(--ink)]"
      aria-labelledby="services-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="mb-16">
          <SectionHeading
            id="services-heading"
            eyebrow="What We Build"
            title={
              <>
                Eight AI services.
                <br />
                All production-grade.
              </>
            }
            subtitle="Two pillars. Zero fluff. Every engagement built and run by our team — you own all of it."
            align="left"
          />
        </div>

        {/* Pillars loop */}
        {pillars.map((pillar, pi) => {
          const accentColor: "orange" | "cyan" = pi === 0 ? "orange" : "cyan";
          const accentLineColor =
            pi === 0 ? "var(--bail-orange)" : "var(--glow-cyan)";
          const accentTextColor =
            pi === 0 ? "text-bail-orange" : "text-[var(--glow-cyan)]";

          return (
            <div key={pillar.id} className={pi > 0 ? "mt-20" : ""}>
              {/* Pillar divider */}
              <div className="flex items-center gap-4 mb-8">
                <span
                  className="block w-8 h-px flex-shrink-0"
                  style={{ background: accentLineColor }}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-bold uppercase tracking-[0.18em] ${accentTextColor}`}
                >
                  {pillar.label}
                </span>
                <span className="hidden sm:block text-white/30 text-sm">
                  —&nbsp;{pillar.tagline}
                </span>
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pillar.services.map((service, si) => (
                  <SpotlightCard
                    key={service.id}
                    service={service}
                    index={si}
                    accentColor={accentColor}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* On Request strip */}
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/30 mb-3">Also available on request:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {onRequest.map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/50 bg-white/[0.03]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
