"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/shared/Button";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import LazyVideo from "@/components/shared/LazyVideo";
import { hero } from "@/content/catalog";

const lines = hero.headline.split("\n");

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.3,
    },
  },
} as const;

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
} as const;

export default function Hero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-[var(--ink)]"
      aria-labelledby="hero-heading"
    >
      {/* Ambient video background */}
      <LazyVideo
        fallbackClassName="absolute inset-0 w-full h-full"
        className="absolute inset-0 w-full h-full opacity-30 z-0"
      />

      {/* Aurora blobs */}
      <div
        className="aurora-blob absolute top-[-10%] left-[-5%] w-[600px] h-[600px]"
        style={{ background: "rgba(237,130,28,0.20)", animationDelay: "0s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px]"
        style={{ background: "rgba(61,69,168,0.30)", animationDelay: "-4s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute top-[30%] right-[20%] w-[400px] h-[400px]"
        style={{ background: "rgba(0,212,255,0.15)", animationDelay: "-8s" }}
        aria-hidden="true"
      />

      {/* CSS grid overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
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
          <span className="inline-flex items-center gap-1.5 border border-bail-orange/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bail-orange bg-bail-orange/10">
            <span
              className="w-1.5 h-1.5 rounded-full bg-bail-orange inline-block"
              style={{ animation: "glow-pulse 2s ease-in-out infinite" }}
            />
            {hero.eyebrow}
          </span>
        </motion.div>

        {/* Headline — word-by-word stagger, per line */}
        <h1
          id="hero-heading"
          className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6"
          aria-label={hero.headline}
        >
          {lines.map((line, li) => {
            const words = line.split(" ");
            return (
              <motion.div
                key={li}
                className="block"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {words.map((word, wi) => (
                  <motion.span
                    key={wi}
                    variants={wordVariants}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.div>
            );
          })}
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-lg text-white/60 mt-6 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
        >
          {hero.subheadline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05, ease: "easeOut" }}
        >
          <Button label="Book a discovery call" href="/#contact" variant="primary" size="lg" />
          <Button label="See what we build" href="#services" variant="ghost" size="lg" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
