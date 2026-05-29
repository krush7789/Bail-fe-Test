"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { stats } from "@/content/catalog";

export default function StatsBand() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="bg-[var(--ink-2)] border-y border-[var(--glass-border)]"
      aria-label="Key statistics"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 py-16 px-6 max-w-6xl mx-auto">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className={`flex flex-col items-center text-center py-4 px-2 ${
              i < stats.length - 1 ? "lg:border-r border-[var(--glass-border)]" : ""
            }`}
          >
            <AnimatedCounter value={stat.value} label={stat.label} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
