"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, Calendar, CheckCircle2, Mic, Activity } from "lucide-react";
import { DemoStage, ScenarioData } from "./useAIDemoSequence";

interface Props {
  stage: DemoStage;
  scenario: ScenarioData;
  callTimer: number;
}

export function VoiceDemoPanel({ stage, scenario, callTimer }: Props) {
  const isContextReceived = [
    "context-received",
    "calling",
    "connected",
    "speaking",
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  const isCallConnected = [
    "connected",
    "speaking",
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  const isSpeaking = stage === "speaking";

  const isCompleted = [
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  // Format MM:SS
  const mins = String(Math.floor(callTimer / 60)).padStart(2, "0");
  const secs = String(callTimer % 60).padStart(2, "0");

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-5 md:p-6 rounded-3xl border transition-all duration-300 font-sans text-xs text-white ${
        isCallConnected
          ? "bg-[var(--ink-3)] border-[var(--glow-cyan)]/50 shadow-2xl shadow-cyan-500/10"
          : "bg-[var(--ink-3)] border-white/10"
      }`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--glow-cyan)] block mb-0.5">
            VOICE AI AGENT
          </span>
          <h4 className="text-base font-bold text-white leading-tight">
            Answers every call.
          </h4>
        </div>

        {/* Live Call Status Badge */}
        <div
          className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 transition-colors ${
            isCallConnected
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              : isContextReceived
              ? "bg-[var(--bail-orange)]/20 text-[var(--bail-orange)] border border-[var(--bail-orange)]/40"
              : "bg-white/10 text-white/50 border border-white/10"
          }`}
        >
          {isCallConnected ? (
            <>
              <PhoneCall className="w-3 h-3 text-emerald-400 animate-bounce" />
              <span>CONNECTED • {mins}:{secs}</span>
            </>
          ) : isContextReceived ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--bail-orange)] animate-ping" />
              <span>CONTEXT RECEIVED</span>
            </>
          ) : (
            <span>WAITING FOR HANDOFF</span>
          )}
        </div>
      </div>

      {/* Reactive Audio Waveform Visualizer */}
      <div className="my-3 p-3.5 bg-slate-950/80 rounded-2xl border border-white/10 flex items-center justify-between gap-1.5 h-16 relative overflow-hidden">
        <div className="flex items-center gap-2 absolute left-3 top-2 text-[9.5px] font-mono text-cyan-400 font-bold">
          <Activity className="w-3 h-3 animate-pulse text-[var(--glow-cyan)]" />
          <span>REAL-TIME VOICE STREAM</span>
        </div>

        <div className="w-full flex items-center justify-center gap-1 mt-4">
          {[40, 70, 30, 95, 60, 85, 40, 100, 75, 50, 90, 65, 80, 45, 90, 55, 35].map(
            (h, i) => (
              <motion.span
                key={i}
                className={`w-1 rounded-full ${
                  isSpeaking
                    ? "bg-gradient-to-t from-[var(--glow-cyan)] to-cyan-200"
                    : isCallConnected
                    ? "bg-cyan-500/60"
                    : "bg-white/15"
                }`}
                animate={
                  isSpeaking
                    ? { height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }
                    : { height: `${isCallConnected ? 30 : 15}%` }
                }
                transition={{
                  duration: 0.8,
                  repeat: isSpeaking ? Infinity : 0,
                  repeatType: "mirror",
                  delay: i * 0.05,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Live Transcript & Intent Details */}
      <div className="space-y-2.5 my-2">
        {/* Live Transcript Box */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-[9.5px] font-mono text-white/50 mb-1">
            <span>LIVE TRANSCRIPTION</span>
            <Mic className="w-3 h-3 text-[var(--glow-cyan)]" />
          </div>
          <p className="text-xs font-semibold text-slate-100 leading-relaxed italic">
            {isCallConnected
              ? `“${scenario.voiceTranscript}”`
              : "Waiting for chatbot context transfer to initiate call..."}
          </p>
        </div>

        {/* Intent & Next Action Pills */}
        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Current Intent</span>
            <span className="font-bold text-[var(--glow-cyan)] block truncate">{scenario.voiceIntent}</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-white/40 block text-[9px] font-mono uppercase">Next Action</span>
            <span className="font-bold text-emerald-400 block truncate">{scenario.nextAction}</span>
          </div>
        </div>
      </div>

      {/* Completion Card Moment */}
      <div className="pt-3 border-t border-white/10 shrink-0">
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{scenario.outcomeTitle}</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                {scenario.outcomeTime}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-emerald-500/20 text-[9.5px] font-medium text-emerald-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                CRM Synced
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                Cal Created
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                Sent
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="p-2.5 rounded-xl bg-white/5 text-center text-white/40 text-[10px] font-mono">
            Outcome: Automated Calendar & CRM Sync on Call Completion
          </div>
        )}
      </div>
    </div>
  );
}
