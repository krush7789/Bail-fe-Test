"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Button from "@/components/shared/Button";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import { hero } from "@/content/catalog";

const HEADLINE_WORDS = hero.headline.replace(/\n/g, " ").split(" ");

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

// Note: inline animate props used below instead of function variants

export default function BalancedHero() {
  const ref = useRef(null);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-ink"
      aria-labelledby="hero-heading"
    >
      {/* Aurora blobs */}
      <div
        className="aurora-blob absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-bail-orange/20"
        style={{ animationDelay: "0s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px]"
        style={{ background: "rgba(61,69,168,0.3)", animationDelay: "-6s" }}
        aria-hidden="true"
      />

      {/* Noise grain */}
      <NoiseOverlay opacity={0.04} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="inline-flex items-center gap-1.5 border border-bail-orange/40 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-bail-orange">
            <span
              className="w-1.5 h-1.5 rounded-full bg-bail-orange inline-block"
              style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
            />
            {hero.eyebrow}
          </span>
        </motion.div>

        {/* Headline — word-by-word stagger */}
        <motion.h1
          id="hero-heading"
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label={hero.headline}
        >
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariants}
              className="inline-block mr-[0.25em]"
              style={word.toLowerCase().includes("ai") ? { color: "var(--bail-orange)" } : {}}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
        >
          {hero.subheadline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease: "easeOut" }}
        >
          <Button label={hero.cta.label} href={hero.cta.href} variant="primary" size="lg" />
          <Button label={hero.ctaSecondary.label} href={hero.ctaSecondary.href} variant="ghost" size="lg" />
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="text-xs text-white/30 tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
