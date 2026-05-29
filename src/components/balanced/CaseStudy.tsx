"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import { caseStudy } from "@/content/catalog";

export default function CaseStudy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-[var(--ink)] py-28 px-6" aria-labelledby="casestudy-heading">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <SectionHeading id="casestudy-heading" eyebrow="Client Work" title={caseStudy.headline} align="center" />
        </motion.div>

        {/* Big metric (layered) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative flex flex-col items-center justify-center mb-12"
        >
          <span
            className="text-8xl md:text-[10rem] font-bold text-white/5 select-none leading-none"
            aria-hidden="true"
          >
            {caseStudy.metric.value}
          </span>
          <span className="absolute text-xl text-bail-orange font-semibold tracking-wide">
            {caseStudy.metric.label}
          </span>
        </motion.div>

        {/* Challenge + Solution cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.55, delay: 0.2, ease: "easeOut" }}
          >
            <GlassCard glowColor="none" className="h-full">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Challenge</p>
              <p className="text-sm text-white/70 leading-relaxed">{caseStudy.challenge}</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.55, delay: 0.3, ease: "easeOut" }}
          >
            <GlassCard glowColor="orange" className="h-full">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Solution</p>
              <p className="text-sm text-white/70 leading-relaxed">{caseStudy.solution}</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Outcomes checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-3 mb-8"
        >
          {caseStudy.outcomes.map((outcome, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-bail-orange font-bold text-base leading-none mt-0.5">✓</span>
              <p className="text-sm text-white/70">{outcome}</p>
            </div>
          ))}
        </motion.div>

        {/* Client badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
          className="flex items-center justify-center gap-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="text-sm font-semibold text-white">{caseStudy.client}</span>
            <span className="text-xs text-white/40">·</span>
            <span className="text-xs text-white/50">{caseStudy.category}</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
