"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { pillars, onRequest, type Service } from "@/content/catalog";
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
  type LucideIcon,
} from "lucide-react";

const PILLAR_META = {
  automate: {
    accentText: "text-[var(--bail-orange)]",
    accentBg: "bg-[var(--bail-orange)]/10",
    accentBorder: "border-[var(--bail-orange)]/30",
    spineRibbon: "bg-[var(--bail-orange)]",
    dividerColor: "var(--bail-orange)",
    labelColor: "text-[var(--bail-orange)]",
    icons: [MessageSquare, Mic, Zap, Database, Sparkles] as LucideIcon[],
  },
  grow: {
    accentText: "text-[var(--bail-navy)]",
    accentBg: "bg-[var(--bail-navy)]/10",
    accentBorder: "border-[var(--bail-navy)]/30",
    spineRibbon: "bg-[var(--bail-navy)]",
    dividerColor: "var(--bail-navy)",
    labelColor: "text-[var(--bail-navy)]",
    icons: [Target, Send, MessageCircle, BarChart2] as LucideIcon[],
  },
} as const;

// Flattened list of all 9 services
const ALL_SERVICES = pillars.flatMap((p) =>
  p.services.map((s) => ({ ...s, pillarId: p.id }))
);

// ─── 1. Active Open-Book Terminal / Live System Preview ──────────────────────

function OpenBookSystemPreview({ activeId }: { activeId: number }) {
  const activeService = ALL_SERVICES.find((s) => s.id === activeId) ?? ALL_SERVICES[0];
  const meta = PILLAR_META[activeService.pillarId as keyof typeof PILLAR_META];

  // Find icon index
  const pillar = pillars.find((p) => p.id === activeService.pillarId);
  const serviceIndex = pillar?.services.findIndex((s) => s.id === activeId) ?? 0;
  const Icon = meta.icons[serviceIndex] ?? Sparkles;

  const ActiveVisualComponent = SERVICE_VISUALS[activeId] ?? ChatbotVisual;

  return (
    <div className="w-full max-w-6xl mx-auto mb-16 rounded-3xl bg-white border border-gray-200/90 shadow-2xl shadow-gray-900/10 backdrop-blur-xl p-6 md:p-8 flex flex-col lg:flex-row gap-6 min-h-[380px] lg:h-[440px] relative overflow-hidden">
      {/* Decorative Book Spine Ribbon Accent on Left */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-2.5 ${
          activeService.pillarId === "automate"
            ? "bg-[var(--bail-orange)]"
            : "bg-[var(--bail-navy)]"
        }`}
      />

      {/* Left Info Column (~40% Width) */}
      <div className="w-full lg:w-[40%] flex flex-col justify-between space-y-4 pl-3">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-gray-400">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              <span>ACTIVE SYSTEM VOLUME • {String(activeService.id).padStart(2, "0")} / 09</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                activeService.pillarId === "automate"
                  ? "bg-[var(--bail-orange)]/10 text-[var(--bail-orange)] border border-[var(--bail-orange)]/20"
                  : "bg-[var(--bail-navy)]/10 text-[var(--bail-navy)] border border-[var(--bail-navy)]/20"
              }`}
            >
              {activeService.pillarId}
            </span>
          </div>

          {/* Title & Icon */}
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.accentBg} border ${meta.accentBorder} shrink-0`}
            >
              <Icon size={20} className={meta.accentText} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {activeService.title}
            </h3>
          </div>

          {/* Hook Description (Verbatim) */}
          <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
            {activeService.hook}
          </p>
        </div>

        {/* Capability Tags (Verbatim) */}
        <div className="pt-4 border-t border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2 font-mono">
            WHAT WE BUILD
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeService.whatWeBuild.map((item, i) => (
              <span
                key={i}
                className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-gray-100 border border-gray-200 text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (~60% Width): Dynamic Visual Simulation */}
      <div className="w-full lg:w-[60%] h-64 lg:h-full rounded-2xl bg-gray-50/80 p-3 border border-gray-200/60 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <ActiveVisualComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── 2. 3D Library Book Spine Card (Pulls Out of Shelf on Hover/Click) ──────

function LibraryBookSpineCard({
  service,
  index,
  pillarId,
  isActive,
  onSelect,
}: {
  service: Service;
  index: number;
  pillarId: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const meta = PILLAR_META[pillarId as keyof typeof PILLAR_META];
  if (!meta) return null;

  const Icon = meta.icons[index] ?? Sparkles;

  return (
    <motion.div
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      onClick={onSelect}
      onMouseEnter={onSelect}
      onFocus={onSelect}
      initial={false}
      animate={
        isActive
          ? {
              y: -16,
              scale: 1.03,
              rotateY: -3,
              boxShadow: "0 25px 35px -10px rgba(0, 0, 0, 0.12)",
            }
          : {
              y: 0,
              scale: 1,
              rotateY: 0,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }
      }
      whileHover={{
        y: -18,
        scale: 1.04,
        rotateY: -4,
        boxShadow: "0 30px 40px -12px rgba(0, 0, 0, 0.15)",
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-2xl p-5 text-left flex flex-col justify-between outline-none cursor-pointer overflow-hidden transition-colors
        min-h-[210px] w-full
        ${
          isActive
            ? "bg-white border-2 border-[var(--bail-orange)] z-20"
            : "bg-white/90 border border-gray-200/90 hover:bg-white z-10"
        }
      `}
    >
      {/* 3D Book Spine Left Ribbon */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-2 ${meta.spineRibbon}`}
      />

      <div className="pl-2">
        {/* Book Header: Volume Number & Icon */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-[10px] font-bold text-gray-400 tracking-wider">
            VOL {String(service.id).padStart(2, "0")}
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${meta.accentBg} border ${meta.accentBorder}`}
          >
            <Icon size={14} className={meta.accentText} />
          </div>
        </div>

        {/* Book Title (Verbatim) */}
        <h4 className="text-sm font-bold text-gray-900 leading-snug mb-2">
          {service.title}
        </h4>

        {/* Hook Description (Verbatim) */}
        <p className="text-[11.5px] font-medium text-gray-500 leading-relaxed line-clamp-3 mb-3">
          {service.hook}
        </p>
      </div>

      {/* Book Bottom Ribbon & Tags */}
      <div className="pl-2 pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div className="flex flex-wrap gap-1">
          {service.whatWeBuild.slice(0, 2).map((tag, i) => (
            <span
              key={i}
              className={`text-[8.5px] px-2 py-0.5 rounded-md font-medium ${
                isActive
                  ? "bg-[var(--bail-orange)]/10 text-[var(--bail-orange)] font-bold"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {tag}
            </span>
          ))}
          {service.whatWeBuild.length > 2 && (
            <span className="text-[8.5px] text-gray-400 font-mono self-center">
              +{service.whatWeBuild.length - 2}
            </span>
          )}
        </div>

        {isActive && (
          <span className="text-[9px] font-bold font-mono text-[var(--bail-orange)] flex items-center gap-0.5">
            OPEN <ArrowRight className="w-2.5 h-2.5" />
          </span>
        )}
      </div>
    </motion.div>
  );
}

// ─── 3. Main Services Section Component ──────────────────────────────────────

export default function ImmersiveServices() {
  const [activeServiceId, setActiveServiceId] = useState<number>(1);

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 px-6 bg-[#f5f6f9]"
      aria-labelledby="services-heading"
    >
      {/* Seamless light-mode top background */}

      {/* Subtle bottom-only pixel/data surface pattern (max 5% opacity) */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] pointer-events-none z-0">
        <DottedSurface mode="absolute" className="opacity-5" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* 1. Section Eyebrow (Verbatim) */}
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--bail-orange)] mb-3">
          WHAT WE BUILD
        </span>

        {/* 2. Heading (Verbatim) */}
        <h2
          id="services-heading"
          className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
        >
          Nine AI services.
          <br />
          <span className="text-gray-400 font-normal">All production-grade.</span>
        </h2>

        {/* 3. Supporting Paragraph (Verbatim) */}
        <p className="text-base text-gray-500 max-w-xl leading-relaxed mb-10">
          Two pillars. Zero fluff. Every engagement built and run by our
          team — you own all of it.
        </p>

        {/* 4. Active Open-Book Terminal / Live System Preview */}
        <OpenBookSystemPreview activeId={activeServiceId} />

        {/* 5 & 6. AI System Library Shelves (AUTOMATE & GROW) */}
        {pillars.map((pillar, pi) => {
          const meta = PILLAR_META[pillar.id as keyof typeof PILLAR_META];
          if (!meta) return null;

          return (
            <div key={pillar.id} className={pi > 0 ? "mt-16" : ""}>
              {/* Category Shelf Header */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="block w-6 h-px flex-shrink-0"
                  style={{ background: meta.dividerColor }}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs font-bold uppercase tracking-[0.18em] ${meta.labelColor}`}
                >
                  {pillar.label} LIBRARY
                </span>
                <span className="hidden sm:block text-gray-400 text-sm">
                  — {pillar.tagline}
                </span>
              </div>

              {/* 3D Digital Bookshelf Shelf Rack */}
              <div className="p-4 md:p-6 rounded-3xl bg-slate-900/5 border border-gray-200/80 backdrop-blur-sm relative">
                {/* Horizontal Shelf Line */}
                <div className="absolute bottom-0 inset-x-4 h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full shadow-inner pointer-events-none" />

                {/* 3D Books Grid Layout */}
                <div
                  className={`
                    grid grid-cols-1 sm:grid-cols-2 ${
                      pillar.id === "automate"
                        ? "lg:grid-cols-5"
                        : "lg:grid-cols-4"
                    } gap-4 relative z-10
                  `}
                >
                  {pillar.services.map((service, index) => (
                    <LibraryBookSpineCard
                      key={service.id}
                      service={service}
                      index={index}
                      pillarId={pillar.id}
                      isActive={activeServiceId === service.id}
                      onSelect={() => setActiveServiceId(service.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* 7. Existing Footer / Category Tags (Verbatim) */}
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
