"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";
import { process } from "@/content/catalog";

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" className="bg-[var(--ink)] py-28 px-6" aria-labelledby="process-heading">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <SectionHeading
            eyebrow="Our Process"
            title="From scope to live system in weeks"
            align="center"
          />
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-stretch gap-0 relative">
          {process.map((step, i) => (
            <React.Fragment key={step.number}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.15, ease: "easeOut" }}
                className="flex-1 flex flex-col gap-4 px-6 py-8 relative"
              >
                {/* Big background number */}
                <span
                  className="text-7xl font-bold text-white/5 leading-none select-none"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold text-white -mt-2">{step.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{step.description}</p>
              </motion.div>

              {/* Connector (desktop only) */}
              {i < process.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-px self-stretch">
                  <div className="h-px w-16 bg-gradient-to-r from-bail-orange/60 to-transparent rotate-90 md:rotate-0" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop connector lines overlay */}
        <div className="hidden md:block relative -mt-4 mb-8 px-6">
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(237,130,28,0.3) 33%, rgba(237,130,28,0.3) 66%, transparent 100%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Bottom ownership statement */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          className="text-center text-sm italic text-bail-orange mt-8"
        >
          &ldquo;You own everything — code, models, infrastructure — from day one.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
