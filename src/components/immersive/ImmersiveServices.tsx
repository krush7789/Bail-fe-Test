"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { pillars, onRequest } from "@/content/catalog";
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
  type LucideIcon,
} from "lucide-react";

type ServiceType = (typeof pillars)[0]["services"][0];

const PILLAR_META = {
  automate: {
    accentText: "text-[var(--bail-navy)]",
    accentBg: "bg-[rgba(46,51,122,0.08)]",
    accentBorder: "border-[rgba(46,51,122,0.15)]",
    dividerColor: "var(--bail-orange)",
    labelColor: "text-[var(--bail-orange)]",
    gridCols: "xl:grid-cols-5",
    icons: [MessageSquare, Mic, Zap, Database, Sparkles] as LucideIcon[],
  },
  grow: {
    accentText: "text-[var(--bail-navy)]",
    accentBg: "bg-[rgba(46,51,122,0.08)]",
    accentBorder: "border-[rgba(46,51,122,0.15)]",
    dividerColor: "var(--glow-navy)",
    labelColor: "text-[var(--bail-navy)]",
    gridCols: "md:grid-cols-2 xl:grid-cols-4",
    icons: [Target, Send, MessageCircle, BarChart2] as LucideIcon[],
  },
} as const;

function ServiceCard({
  service,
  index,
  pillarId,
}: {
  service: ServiceType;
  index: number;
  pillarId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const meta = PILLAR_META[pillarId as keyof typeof PILLAR_META];
  if (!meta) return null;

  const Icon = meta.icons[index] ?? Sparkles;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      className="flex-shrink-0 w-[220px] snap-start xl:w-auto xl:flex-1"
    >
      <GlowCard
        glowColor="blue"
        customSize
        backdropColor="rgba(255, 255, 255, 0.85)"
        borderColor="rgba(46, 51, 122, 0.08)"
        className="h-[290px] w-full"
      >
        <div className="flex flex-col h-full gap-3 relative z-10">
          {/* Icon chip */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.accentBg} border ${meta.accentBorder} flex-shrink-0`}
          >
            <Icon size={16} className={meta.accentText} />
          </div>

          {/* Number + Title */}
          <div className="flex-shrink-0">
            <span className="font-mono text-[10px] text-gray-400 block mb-0.5">
              {String(service.id).padStart(2, "0")}
            </span>
            <h3 className="text-[13.5px] font-bold text-gray-900 leading-tight">
              {service.title}
            </h3>
          </div>

          {/* Hook */}
          <p className={`text-[11px] leading-relaxed font-medium ${meta.accentText} flex-shrink-0`}>
            {service.hook}
          </p>

          {/* Capability chips */}
          <div className="flex flex-wrap gap-1 mt-auto">
            {service.whatWeBuild.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="bg-gray-100 border border-gray-200 text-gray-500 text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap"
              >
                {item}
              </span>
            ))}
            {service.whatWeBuild.length > 3 && (
              <span className="text-[9px] text-gray-400 self-center">
                +{service.whatWeBuild.length - 3}
              </span>
            )}
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export default function ImmersiveServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden py-28 px-6 bg-[#f5f6f9]"
      aria-labelledby="services-heading"
    >
      {/* Animated dot-wave background — brand navy, section-scoped */}
      <DottedSurface mode="absolute" className="opacity-60" />

      {/* Subtle radial vignette so edges fade gently */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #f5f6f9 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--bail-orange)] mb-4">
            What We Build
          </span>
          <h2
            id="services-heading"
            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4"
          >
            Nine AI services.
            <br />
            <span className="text-gray-400 font-normal">All production-grade.</span>
          </h2>
          <p className="text-base text-gray-500 max-w-xl leading-relaxed">
            Two pillars. Zero fluff. Every engagement built and run by our
            team — you own all of it.
          </p>
        </motion.div>

        {/* Pillar rows */}
        {pillars.map((pillar, pi) => {
          const meta = PILLAR_META[pillar.id as keyof typeof PILLAR_META];
          if (!meta) return null;

          return (
            <div key={pillar.id} className={pi > 0 ? "mt-16" : ""}>
              {/* Pillar label */}
              <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -12 }}
                animate={headingInView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + pi * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <span
                  className="block w-6 h-px flex-shrink-0"
                  style={{ background: meta.dividerColor }}
                  aria-hidden="true"
                />
                <span className={`text-xs font-bold uppercase tracking-[0.18em] ${meta.labelColor}`}>
                  {pillar.label}
                </span>
                <span className="hidden sm:block text-gray-400 text-sm">
                  — {pillar.tagline}
                </span>
              </motion.div>

              {/* Cards — horizontal scroll on mobile/tablet, grid on xl */}
              <div
                className={`
                  flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory
                  xl:grid ${meta.gridCols} xl:overflow-visible xl:pb-0
                  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
                `}
              >
                {pillar.services.map((service, si) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={si}
                    pillarId={pillar.id}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* On-request strip */}
        <div className="mt-14 pt-8 border-t border-gray-200/80 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">
            Also available on request
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {onRequest.map((item) => (
              <span
                key={item}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 bg-white/70 backdrop-blur-sm"
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
