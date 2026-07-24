"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import {
  useAIDemoSequence,
  SCENARIOS,
  DemoScenarioId,
} from "@/components/balanced/aidemo/useAIDemoSequence";
import { ChatbotDemoPanel } from "@/components/balanced/aidemo/ChatbotDemoPanel";
import { VoiceDemoPanel } from "@/components/balanced/aidemo/VoiceDemoPanel";
import { HandoffConnector } from "@/components/balanced/aidemo/HandoffConnector";
import { WorkflowProgress } from "@/components/balanced/aidemo/WorkflowProgress";
import { Play, Pause, RotateCcw, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export default function AIDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.25 });

  const {
    scenario,
    scenarioId,
    stage,
    isPaused,
    callTimer,
    changeScenario,
    restart,
    togglePause,
    startSequence,
    stopSequence,
  } = useAIDemoSequence();

  // Trigger sequence on IntersectionObserver visibility
  useEffect(() => {
    if (isInView && stage === "idle" && !isPaused) {
      startSequence();
    } else if (!isInView) {
      stopSequence();
    }
  }, [isInView, stage, isPaused, startSequence, stopSequence]);

  // Open live ChatWidget helper
  const openChatWidget = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-chat"));
    }
  };

  // Smooth scroll to #contact
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <section
      id="watch-it-work"
      ref={sectionRef}
      className="bg-[var(--ink-2)] py-24 px-6 text-white overflow-hidden relative"
      aria-labelledby="demo-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* 1. Section Header (Verbatim) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SectionHeading
            id="demo-heading"
            eyebrow="WATCH IT WORK"
            title={
              <>
                Your AI assistant,{" "}
                <span className="glow-text-orange">live right now</span>
              </>
            }
            align="center"
          />
        </motion.div>

        {/* 2. Scenario Selector (Segmented Control Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {(Object.keys(SCENARIOS) as DemoScenarioId[]).map((id) => {
            const sc = SCENARIOS[id];
            const isActive = scenarioId === id;

            return (
              <button
                key={id}
                type="button"
                aria-pressed={isActive}
                onClick={() => changeScenario(id)}
                className={`
                  px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--bail-orange)]
                  ${isActive
                    ? "bg-[var(--bail-orange)] text-white shadow-lg shadow-orange-500/25 border border-[var(--bail-orange)] font-bold scale-105"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                  }
                `}
              >
                {sc.label}
              </button>
            );
          })}
        </div>

        {/* 3. Connected 2-Panel Demonstration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch min-h-[460px]">
          {/* Left Panel: AI Chatbot */}
          <ChatbotDemoPanel stage={stage} scenario={scenario} />

          {/* Handoff Connector */}
          <HandoffConnector stage={stage} />

          {/* Right Panel: Voice AI Agent */}
          <VoiceDemoPanel
            stage={stage}
            scenario={scenario}
            callTimer={callTimer}
          />
        </div>

        {/* 4. Workflow Progress Bar */}
        <WorkflowProgress stage={stage} />

        {/* 5. Playback & Interactive Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-white/5 border border-white/10 mb-12">
          {/* Demo Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold transition-colors"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>Resume Demo</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Pause Demo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={restart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white/70 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          {/* Try it yourself action */}
          <button
            type="button"
            onClick={openChatWidget}
            className="flex items-center gap-2 text-xs font-bold text-[var(--bail-orange)] hover:text-amber-400 transition-colors font-mono"
          >
            <span>Try it yourself — Launch Live Bot</span>
          </button>
        </div>

        {/* 6. Subtitle & CTAs (Verbatim) */}
        <div className="text-center space-y-6">
          <p className="text-sm text-white/50 leading-relaxed max-w-xl mx-auto">
            This website runs on the same AI systems we build for our clients.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Primary CTA */}
            <button
              type="button"
              onClick={openChatWidget}
              className="px-6 py-3.5 rounded-full bg-[var(--bail-orange)] hover:bg-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
            >
              <span>Experience the assistant</span>
            </button>

            {/* Secondary CTA */}
            <button
              type="button"
              onClick={scrollToContact}
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-all flex items-center gap-2"
            >
              <span>Build this for my business</span>
              <ArrowRight className="w-4 h-4 text-[var(--bail-orange)]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
