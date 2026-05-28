"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { stats } from "@/content/catalog";

export default function BalancedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="bg-ink-2 border-y border-white/5"
      aria-label="Key statistics"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-16 px-6 max-w-6xl mx-auto">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <AnimatedCounter value={stat.value} label={stat.label} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
