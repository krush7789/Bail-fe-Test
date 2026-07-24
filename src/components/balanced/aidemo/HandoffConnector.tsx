"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { DemoStage } from "./useAIDemoSequence";

interface Props {
  stage: DemoStage;
}

export function HandoffConnector({ stage }: Props) {
  const isHandoffActive = ["handoff", "context-received"].includes(stage);

  return (
    <>
      {/* Desktop Horizontal Connector */}
      <div className="hidden md:flex flex-col items-center justify-center relative my-auto z-20 px-2">
        <div
          className={`px-3 py-1.5 rounded-full border text-[10px] font-mono font-bold uppercase transition-all duration-300 flex items-center gap-1.5 shadow-lg ${
            isHandoffActive
              ? "bg-[var(--bail-orange)] text-white border-[var(--bail-orange)] shadow-orange-500/30 scale-105"
              : "bg-[var(--ink-3)] text-white/50 border-white/10"
          }`}
        >
          <span>Context Transfer</span>
          <ArrowRight
            className={`w-3.5 h-3.5 ${
              isHandoffActive ? "text-white animate-pulse" : "text-white/40"
            }`}
          />
        </div>

        {/* Animated Data Packet Glow Line */}
        <div className="w-24 h-0.5 bg-white/10 mt-2 relative overflow-hidden rounded-full">
          {isHandoffActive && (
            <motion.div
              className="w-8 h-full bg-gradient-to-r from-transparent via-[var(--bail-orange)] to-white rounded-full shadow-[0_0_8px_var(--bail-orange)]"
              initial={{ x: "-100%" }}
              animate={{ x: "300%" }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
      </div>

      {/* Mobile Vertical Connector */}
      <div className="md:hidden flex flex-col items-center justify-center my-3 py-1 z-20">
        <div
          className={`px-3 py-1 rounded-full border text-[9.5px] font-mono font-bold uppercase flex items-center gap-1 ${
            isHandoffActive
              ? "bg-[var(--bail-orange)] text-white border-[var(--bail-orange)]"
              : "bg-white/10 text-white/50 border-white/10"
          }`}
        >
          <span>Context Transfer</span>
          <ArrowDown className="w-3 h-3" />
        </div>
      </div>
    </>
  );
}
