"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import AIChatDemo from "@/components/shared/AIChatDemo";
import VoiceWaveform from "@/components/shared/VoiceWaveform";

export default function AIDemo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-[var(--ink-2)] py-28 px-6" aria-labelledby="demo-heading">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Watch It Work"
            title={
              <>
                Your AI assistant,{" "}
                <span className="glow-text-orange">live right now</span>
              </>
            }
            align="center"
          />
        </motion.div>

        {/* Two-column demo grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chat demo */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <GlassCard glowColor="orange" className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-bail-orange/80">
                  AI Chatbot in action
                </span>
                <span className="flex items-center gap-1 text-xs text-green-400 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                  Live
                </span>
              </div>
              <AIChatDemo />
            </GlassCard>
          </motion.div>

          {/* Voice demo */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
          >
            <GlassCard glowColor="cyan" className="flex flex-col gap-6 items-center justify-center min-h-[300px] text-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--glow-cyan)]/80 mb-1">
                  Voice AI Agent
                </p>
                <p className="text-2xl font-bold text-white">Answers every call.</p>
              </div>
              <VoiceWaveform />
              <p className="text-sm text-white/50 max-w-xs leading-relaxed">
                Natural-speech AI answers every call, qualifies leads, and books appointments — 24/7.
              </p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-center text-sm text-white/40 mt-10"
        >
          This website runs on the same AI systems we build for our clients.
        </motion.p>
      </div>
    </section>
  );
}
