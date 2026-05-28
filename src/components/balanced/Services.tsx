"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import { pillars, onRequest } from "@/content/catalog";

type ServiceType = (typeof pillars)[0]["services"][0];

function ServiceCard({
  service,
  index,
  glowColor,
}: {
  service: ServiceType;
  index: number;
  glowColor: "orange" | "cyan";
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="h-full"
    >
      <GlassCard
        glowColor={glowColor}
        className="h-full cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-col gap-3 h-full">
          {/* Service number */}
          <span className="text-xs font-mono text-white/30 mb-2">
            {String(service.id).padStart(2, "0")}
          </span>

          {/* Title */}
          <h3 className="text-lg font-bold text-white leading-snug mb-1">
            {service.title}
          </h3>

          {/* Hook */}
          <p className="text-sm text-bail-orange mb-3 leading-snug font-medium">
            {service.hook}
          </p>

          {/* whatWeBuild pills */}
          <div className="flex flex-wrap gap-1.5 flex-1">
            {service.whatWeBuild.map((item, i) => (
              <span
                key={i}
                className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-white/60"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Expand toggle */}
          <div className="flex items-center gap-1.5 text-xs text-bail-orange/70 font-medium mt-auto pt-3 border-t border-white/5">
            <span>{expanded ? "Hide details" : "See more"}</span>
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 9l6 6 6-6" />
            </motion.svg>
          </div>

          {/* Expandable content */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3 flex flex-col gap-2">
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Problem</p>
                    <p className="text-xs text-white/70 leading-relaxed">{service.problem}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Solution</p>
                    <p className="text-xs text-white/70 leading-relaxed">{service.solution}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Outcome</p>
                    <p className="text-xs text-white/70 leading-relaxed">{service.outcome}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function Services() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-28 px-6 bg-[var(--ink)]" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <SectionHeading
            eyebrow="What We Build"
            title="AI services that actually ship"
            subtitle="Two capability pillars, eight productized services. Every engagement is built and run by our team — you own the output."
            align="left"
          />
        </motion.div>

        {/* Pillars */}
        {pillars.map((pillar, pi) => (
          <div key={pillar.id} className={pi > 0 ? "mt-20" : ""}>
            {/* Pillar header */}
            <div className="flex items-center gap-4 mb-8">
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
                style={{
                  borderColor: pi === 0 ? "rgba(237,130,28,0.4)" : "rgba(0,212,255,0.3)",
                  color: pi === 0 ? "var(--bail-orange)" : "var(--glow-cyan)",
                  background: pi === 0 ? "rgba(237,130,28,0.08)" : "rgba(0,212,255,0.06)",
                }}
              >
                {pillar.label}
              </span>
              <p className="text-white/40 text-sm">{pillar.tagline}</p>
            </div>

            {/* Services grid */}
            <div
              className={
                pi === 0
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                  : "grid grid-cols-1 md:grid-cols-2 gap-4"
              }
            >
              {pillar.services.map((service, si) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={si}
                  glowColor={pi === 0 ? "orange" : "cyan"}
                />
              ))}
            </div>
          </div>
        ))}

        {/* On Request strip */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-white/40 mb-3">Also available on request:</p>
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
