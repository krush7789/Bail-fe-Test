"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import { whyUs } from "@/content/catalog";

export default function WhyUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="whyus" className="bg-[#f5f6f9] py-28 px-6" aria-labelledby="whyus-heading">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <SectionHeading
            id="whyus-heading"
            eyebrow="Why Us"
            title="We do one thing and we do it well"
            align="center"
            variant="light"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {whyUs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: "easeOut" }}
            >
              <div className="h-full bg-white border border-gray-200/90 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-3">
                  {/* Orange accent bar */}
                  <div className="w-8 h-0.5 bg-[var(--bail-orange)] rounded-full" />
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
