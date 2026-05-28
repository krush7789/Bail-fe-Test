"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import { pillars, onRequest } from "@/content/catalog";

function ServiceCard({ service, index }: { service: (typeof pillars)[0]["services"][0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <GlassCard
        glowColor="orange"
        className="h-full cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-col gap-3 h-full">
          {/* Service number */}
          <span className="text-xs font-bold text-bail-orange/60 tracking-widest uppercase">
            {String(service.id).padStart(2, "0")}
          </span>

          {/* Title */}
          <h3 className="text-base font-bold text-white leading-snug">
            {service.title}
          </h3>

          {/* Hook */}
          <p className="text-sm text-white/60 leading-relaxed flex-1">
            {service.hook}
          </p>

          {/* Expand toggle */}
          <div className="flex items-center gap-1.5 text-xs text-bail-orange/70 font-medium mt-auto pt-2">
            <span>{expanded ? "Hide details" : "What we build"}</span>
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

          {/* Expandable: whatWeBuild list */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.ul
                key="details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden flex flex-col gap-1.5 pt-2 border-t border-white/10"
              >
                {service.whatWeBuild.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--bail-orange)" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function BalancedServices() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 px-6 bg-ink" aria-labelledby="services-heading">
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
            title="8 Services. Two Pillars."
            subtitle="Every engagement is built and operated by our team — you own the output."
          />
        </motion.div>

        {/* Pillars */}
        {pillars.map((pillar, pi) => (
          <div key={pillar.id} className={`${pi > 0 ? "mt-16" : ""}`}>
            {/* Pillar header */}
            <div className="flex items-center gap-4 mb-8">
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
                style={{
                  borderColor: pi === 0 ? "rgba(237,130,28,0.4)" : "rgba(61,69,168,0.5)",
                  color: pi === 0 ? "var(--bail-orange)" : "var(--glow-navy)",
                  background: pi === 0 ? "rgba(237,130,28,0.08)" : "rgba(61,69,168,0.08)",
                }}
              >
                {pillar.label}
              </span>
              <p className="text-white/40 text-sm">{pillar.tagline}</p>
            </div>

            {/* Services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pillar.services.map((service, si) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={si}
                />
              ))}
            </div>
          </div>
        ))}

        {/* On Request */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-white/40 mb-4">Also available on request:</p>
          <div className="flex flex-wrap gap-2">
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
