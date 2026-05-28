"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/shared/Button";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import MagneticButton from "@/components/immersive/MagneticButton";
import { hero } from "@/content/catalog";

// Load NeuralOrb only on client — no SSR
const NeuralOrb = dynamic(() => import("./NeuralOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-[var(--ink)] to-[var(--bail-navy)]/20 rounded-full opacity-60" />
  ),
});

const lines = hero.headline.split("\n");

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.35,
    },
  },
} as const;

function ImmersiveWordReveal({ line }: { line: string }) {
  const prefersReduced = useReducedMotion();
  const words = line.split(" ");

  return (
    <motion.div
      className="block"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          className="inline-block mr-[0.25em]"
          variants={
            prefersReduced
              ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
              : {
                  hidden: { opacity: 0, y: 40, rotateY: 15 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    transition: {
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                    },
                  },
                }
          }
          style={{ transformOrigin: "center bottom", perspective: "800px" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function ImmersiveHero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[var(--ink)] flex items-center"
      aria-labelledby="immersive-hero-heading"
    >
      {/* Aurora blobs */}
      <div
        className="aurora-blob absolute top-[-10%] left-[-5%] w-[700px] h-[700px]"
        style={{ background: "rgba(237,130,28,0.18)", animationDelay: "0s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px]"
        style={{ background: "rgba(61,69,168,0.28)", animationDelay: "-4s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute top-[35%] right-[25%] w-[450px] h-[450px]"
        style={{ background: "rgba(0,212,255,0.12)", animationDelay: "-8s" }}
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

      {/* Two-column layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-28 lg:py-0 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 min-h-screen">
        {/* LEFT: Hero text content */}
        <div className="flex-1 flex flex-col justify-center order-2 lg:order-1">
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

          {/* Kinetic word-reveal headline */}
          <h1
            id="immersive-hero-heading"
            className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.08] tracking-tight mb-6"
            aria-label={hero.headline}
          >
            {lines.map((line, li) => (
              <ImmersiveWordReveal key={li} line={line} />
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg text-white/60 max-w-lg leading-relaxed mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
          >
            {hero.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          >
            <MagneticButton strength={0.3}>
              <Button
                label={hero.cta.label}
                href={hero.cta.href}
                variant="primary"
                size="lg"
              />
            </MagneticButton>
            <Button
              label={hero.ctaSecondary.label}
              href={hero.ctaSecondary.href}
              variant="ghost"
              size="lg"
            />
          </motion.div>
        </div>

        {/* RIGHT: NeuralOrb */}
        <div className="flex-1 flex items-center justify-center order-1 lg:order-2">
          <motion.div
            className="w-full h-[300px] lg:h-[560px] xl:h-[640px] relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow ring behind orb */}
            <div
              className="absolute inset-0 m-auto rounded-full"
              style={{
                width: "60%",
                height: "60%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(237,130,28,0.15) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
              aria-hidden="true"
            />
            <NeuralOrb />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
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
