"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { pillars, onRequest, brand, type Service } from "@/content/catalog";
import {
  SERVICE_VISUALS,
  ChatbotVisual,
} from "@/components/immersive/LiveServiceVisuals";
import {
  MessageSquare,
  Mic,
  Zap,
  Database,
  Sparkles,
  Target,
  Send,
  MessageCircle,
  BarChart2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

const PILLAR_META = {
  automate: {
    accentText: "text-[var(--bail-orange)]",
    accentBg: "bg-[var(--bail-orange)]/10",
    accentBorder: "border-[var(--bail-orange)]/30",
    dividerColor: "var(--bail-orange)",
    labelColor: "text-[var(--bail-orange)]",
    icons: [MessageSquare, Mic, Zap, Database, Sparkles] as LucideIcon[],
  },
  grow: {
    accentText: "text-[var(--bail-navy)]",
    accentBg: "bg-[var(--bail-navy)]/10",
    accentBorder: "border-[var(--bail-navy)]/30",
    dividerColor: "var(--bail-navy)",
    labelColor: "text-[var(--bail-navy)]",
    icons: [Target, Send, MessageCircle, BarChart2] as LucideIcon[],
  },
} as const;

// Flattened list of all 9 services
const ALL_SERVICES = pillars.flatMap((p) =>
  p.services.map((s) => ({ ...s, pillarId: p.id }))
);

export default function ImmersiveServices() {
  const [activeCategory, setActiveCategory] = useState<"automate" | "grow">("automate");
  const [activeServiceId, setActiveServiceId] = useState<number>(1);

  const activePillar = pillars.find((p) => p.id === activeCategory) || pillars[0];
  const meta = PILLAR_META[activeCategory as keyof typeof PILLAR_META];

  const activeService = ALL_SERVICES.find((s) => s.id === activeServiceId) ?? activePillar.services[0];
  const ActiveVisualComponent = SERVICE_VISUALS[activeService.id] ?? ChatbotVisual;

  // Index of active service in the current category list
  const categoryServices = activePillar.services;
  const currentCategoryIndex = categoryServices.findIndex((s) => s.id === activeServiceId);
  const activeIndexInPillar = currentCategoryIndex >= 0 ? currentCategoryIndex : 0;

  const handleCategorySwitch = (category: "automate" | "grow") => {
    setActiveCategory(category);
    const targetPillar = pillars.find((p) => p.id === category);
    if (targetPillar) {
      setActiveServiceId(targetPillar.services[0].id);
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden py-20 px-6 bg-[#f5f6f9]"
      aria-labelledby="services-heading"
    >
      {/* Subtle bottom-only pixel/data surface pattern */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none z-0">
        <DottedSurface mode="absolute" className="opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Eyebrow */}
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--bail-orange)] mb-3">
          WHAT WE BUILD
        </span>

        {/* Header & Category Toggle Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2
              id="services-heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3"
            >
              Nine AI services.
              <br />
              <span className="text-gray-400 font-normal">All production-grade.</span>
            </h2>
            <p className="text-base text-gray-500 max-w-xl leading-relaxed">
              Two pillars. Zero fluff. Every engagement built and run by our team — you own all of it.
            </p>
          </div>

          {/* Category Toggle Control */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-gray-200/90 shadow-sm gap-2 shrink-0 self-start lg:self-end">
            <button
              type="button"
              onClick={() => handleCategorySwitch("automate")}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2.5 ${
                activeCategory === "automate"
                  ? "bg-[var(--bail-orange)] text-white shadow-md shadow-orange-500/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>AUTOMATION</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10">5</span>
            </button>

            <button
              type="button"
              onClick={() => handleCategorySwitch("grow")}
              className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2.5 ${
                activeCategory === "grow"
                  ? "bg-[var(--bail-navy)] text-white shadow-md shadow-indigo-900/20"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>GROWTH</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10">4</span>
            </button>
          </div>
        </div>

        {/* Main Split Showcase Container (Left Sticky List + Right Product Showcase) */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch relative">
          
          {/* LEFT SIDE: Sticky Vertical Service List (~32% Width) */}
          <div className="w-full lg:w-[32%] flex flex-col gap-3 py-1 border-l-2 border-gray-200/80 pl-4 relative">
            
            {categoryServices.map((service, index) => {
              const isSelected = service.id === activeServiceId;
              const Icon = meta.icons[index] ?? Sparkles;

              return (
                <div
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`relative cursor-pointer transition-all duration-300 rounded-2xl px-4 py-3 text-left group flex-1 flex flex-col justify-center ${
                    isSelected
                      ? "bg-white shadow-xl shadow-gray-900/5 border border-gray-200/90"
                      : "hover:bg-white/60 text-gray-500"
                  }`}
                >
                  {/* Sliding Orange Vertical Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute -left-[18px] top-3 bottom-3 w-1.5 rounded-full bg-[var(--bail-orange)] shadow-[0_0_12px_rgba(237,130,28,0.8)]"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10.5px] font-mono font-bold text-gray-400">
                      {String(index + 1).padStart(2, "0")} / {String(categoryServices.length).padStart(2, "0")}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isSelected ? meta.accentBg : "bg-gray-100"
                      }`}
                    >
                      <Icon size={13} className={isSelected ? meta.accentText : "text-gray-400"} />
                    </div>
                  </div>

                  <h3
                    className={`text-base md:text-lg font-bold tracking-tight transition-colors ${
                      isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Expanded Hook Description for Active Item */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-xs text-gray-500 mt-1.5 leading-relaxed overflow-hidden font-medium"
                      >
                        {service.hook}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDE: Interactive Product Showcase (~68% Width) */}
          <div className="w-full lg:w-[68%] rounded-3xl bg-white border border-gray-200/90 shadow-2xl p-5 md:p-7 flex flex-col space-y-5 relative overflow-hidden transition-all">
            
            {/* 1. Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-gray-400">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span>
                  VOLUME {String(activeIndexInPillar + 1).padStart(2, "0")} / {String(categoryServices.length).padStart(2, "0")}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full self-start md:self-auto ${
                  activeCategory === "automate"
                    ? "bg-[var(--bail-orange)]/10 text-[var(--bail-orange)] border border-[var(--bail-orange)]/20"
                    : "bg-[var(--bail-navy)]/10 text-[var(--bail-navy)] border border-[var(--bail-navy)]/20"
                }`}
              >
                {activePillar.label} PILLAR
              </span>
            </div>

            {/* 2. Active Service Title & Outcome Description */}
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {activeService.title}
              </h3>
              <p className="text-base text-gray-600 font-medium leading-relaxed">
                {activeService.hook}
              </p>
            </div>

            {/* 3. Interactive Product Preview Container */}
            <div className="w-full min-h-[220px] lg:min-h-[260px] rounded-2xl bg-gray-50/80 border border-gray-200/80 p-3 md:p-4 shadow-inner relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeServiceId}
                  initial={{ opacity: 0, scale: 0.98, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ActiveVisualComponent />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 4. Bottom Grid: Capabilities + Business Result */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Left Grid: Capabilities (What We Build Pill Tags) */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3 font-mono">
                  CAPABILITIES & ARCHITECTURE
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeService.whatWeBuild.map((capability, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 border border-gray-200 text-gray-700 shadow-2xs"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Grid: Business Result & Outcome */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3 font-mono">
                  BUSINESS RESULT
                </span>
                <div className="space-y-2 text-xs md:text-sm text-gray-700">
                  <div className="flex items-start gap-2 text-emerald-600 font-bold bg-emerald-50/80 border border-emerald-200/60 p-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{activeService.outcome}</span>
                  </div>
                  <div className="text-gray-600 text-xs leading-relaxed pl-1">
                    <span className="font-semibold text-gray-800">Engineered Solution: </span>
                    {activeService.solution}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Action Buttons Row */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[var(--bail-orange)] text-white font-bold text-xs md:text-sm hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
              >
                <span>Build this for my business</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <span className="text-xs text-gray-400 font-mono">
                100% Client Ownership • Production Ready
              </span>
            </div>

          </div>
        </div>

        {/* Footer / Category Tags */}
        <div className="mt-20 pt-8 border-t border-gray-200/80 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium font-mono">
            ALSO AVAILABLE ON REQUEST
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {onRequest.map((item) => (
              <span
                key={item}
                className="text-xs px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-600 bg-white/80 backdrop-blur-sm shadow-sm"
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
