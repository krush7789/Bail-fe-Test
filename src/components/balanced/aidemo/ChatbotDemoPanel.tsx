"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { DemoStage, ScenarioData } from "./useAIDemoSequence";

interface Props {
  stage: DemoStage;
  scenario: ScenarioData;
}

export function ChatbotDemoPanel({ stage, scenario }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat viewport
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [stage]);

  const showUser1 = stage !== "idle";
  const showBotTyping1 = stage === "bot-typing-1";
  const showBot1 = [
    "bot-msg-1",
    "user-msg-2",
    "bot-typing-2",
    "bot-msg-2",
    "qualified",
    "handoff",
    "context-received",
    "calling",
    "connected",
    "speaking",
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  const showUser2 = [
    "user-msg-2",
    "bot-typing-2",
    "bot-msg-2",
    "qualified",
    "handoff",
    "context-received",
    "calling",
    "connected",
    "speaking",
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  const showBotTyping2 = stage === "bot-typing-2";
  const showBot2 = [
    "bot-msg-2",
    "qualified",
    "handoff",
    "context-received",
    "calling",
    "connected",
    "speaking",
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  const isQualified = [
    "qualified",
    "handoff",
    "context-received",
    "calling",
    "connected",
    "speaking",
    "booking",
    "crm-updated",
    "confirmation-sent",
    "completed",
  ].includes(stage);

  const isHandoffActive = ["handoff", "context-received"].includes(stage);

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 md:p-6 rounded-3xl bg-[var(--ink-3)] border border-white/10 shadow-xl text-white font-sans text-xs">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--bail-orange)]/20 border border-[var(--bail-orange)]/40 flex items-center justify-center text-[var(--bail-orange)] font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block leading-tight">
              Bits AI Assistant
            </span>
            <span className="text-[9.5px] text-white/50 font-mono">
              WhatsApp / Web Interface
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Bot</span>
        </div>
      </div>

      {/* Conversation timeline viewport */}
      <div
        ref={containerRef}
        className="my-3 flex-1 min-h-[220px] max-h-[260px] overflow-y-auto space-y-3 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-[var(--bail-orange)]/50 [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {/* User Message 1 */}
        {showUser1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-xs bg-[var(--bail-orange)] text-white text-xs leading-relaxed shadow-sm">
              {scenario.userMsg1}
            </div>
          </motion.div>
        )}

        {/* Bot Typing 1 */}
        {showBotTyping1 && (
          <div className="flex items-center gap-1.5 text-white/50 text-xs pl-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--bail-orange)] animate-spin" />
            <span className="font-mono text-[10px]">AI typing...</span>
          </div>
        )}

        {/* Bot Message 1 */}
        {showBot1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-start gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[var(--bail-orange)] text-[10px] font-bold">
              AI
            </div>
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-white/10 text-slate-100 text-xs leading-relaxed border border-white/5">
              {scenario.botMsg1}
            </div>
          </motion.div>
        )}

        {/* User Message 2 */}
        {showUser2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-xs bg-[var(--bail-orange)] text-white text-xs leading-relaxed shadow-sm">
              {scenario.userMsg2}
            </div>
          </motion.div>
        )}

        {/* Bot Typing 2 */}
        {showBotTyping2 && (
          <div className="flex items-center gap-1.5 text-white/50 text-xs pl-1">
            <Sparkles className="w-3.5 h-3.5 text-[var(--bail-orange)] animate-spin" />
            <span className="font-mono text-[10px]">AI typing...</span>
          </div>
        )}

        {/* Bot Message 2 */}
        {showBot2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-start gap-2"
          >
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[var(--bail-orange)] text-[10px] font-bold">
              AI
            </div>
            <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tl-xs bg-white/10 text-slate-100 text-xs leading-relaxed border border-white/5">
              {scenario.botMsg2}
            </div>
          </motion.div>
        )}
      </div>

      {/* Qualification Checklist & Handoff Footer */}
      <div className="pt-3 border-t border-white/10 space-y-2 shrink-0">
        {/* Checklist tags */}
        <div className="flex flex-wrap gap-1.5">
          {scenario.checklist.map((item, idx) => (
            <span
              key={idx}
              className={`text-[9.5px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 transition-colors ${
                isQualified
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/5 text-white/40 border border-white/10"
              }`}
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>{item}</span>
            </span>
          ))}
        </div>

        {/* Status banner */}
        <div className="flex items-center justify-between text-[10.5px]">
          <span className="text-white/60 font-medium">Chatbot Status:</span>
          {isHandoffActive ? (
            <span className="text-[var(--bail-orange)] font-bold flex items-center gap-1 font-mono animate-pulse">
              Transferring Context <ArrowRight className="w-3 h-3" />
            </span>
          ) : isQualified ? (
            <span className="text-emerald-400 font-bold font-mono">
              ✓ Context Transferred
            </span>
          ) : (
            <span className="text-white/40 font-mono">Qualifying Lead...</span>
          )}
        </div>
      </div>
    </div>
  );
}
