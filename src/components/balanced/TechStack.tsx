"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import Marquee from "@/components/shared/Marquee";
import { techStack } from "@/content/catalog";

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  // First 4 tech groups tools flattened
  const row1Items = techStack.slice(0, 4).flatMap((g) => g.tools);
  // Last 4 tech groups tools flattened
  const row2Items = techStack.slice(4).flatMap((g) => g.tools);

  return (
    <section className="bg-[var(--ink-2)] py-20 px-6" aria-label="Tech stack">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <SectionHeading
            eyebrow="Built With"
            title="The tools behind every build"
            align="center"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <Marquee items={row1Items} speed="normal" />
          <Marquee items={row2Items} speed="normal" reverse />
        </motion.div>
      </div>
    </section>
  );
}
