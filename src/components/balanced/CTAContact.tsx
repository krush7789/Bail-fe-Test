"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cta } from "@/content/catalog";

type Status = "idle" | "sending" | "success" | "error";

export default function CTAContact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative bg-[var(--ink)] py-28 px-6 overflow-hidden" aria-labelledby="cta-heading">
      {/* Aurora blobs for drama */}
      <div
        className="aurora-blob absolute top-[-20%] right-[-15%] w-[500px] h-[500px]"
        style={{ background: "rgba(237,130,28,0.12)", animationDelay: "-3s" }}
        aria-hidden="true"
      />
      <div
        className="aurora-blob absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px]"
        style={{ background: "rgba(61,69,168,0.2)", animationDelay: "-7s" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Big headline */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <h2
            id="cta-heading"
            className="text-5xl md:text-7xl font-bold text-white"
          >
            {cta.headline}
          </h2>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="text-center text-lg text-white/60 mb-10 max-w-xl mx-auto"
        >
          {cta.subheadline}
        </motion.p>

        {/* Steps */}
        <motion.ol
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-2 mb-12 max-w-sm mx-auto"
        >
          {cta.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-white/60">
              <span className="text-bail-orange font-bold font-mono text-xs mt-0.5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </motion.ol>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="bg-[var(--ink-3)] border border-[var(--glass-border)] rounded-2xl p-8 max-w-xl mx-auto"
          style={{ backdropFilter: "blur(12px)" }}
        >
          {status === "success" ? (
            <div className="text-center py-10 flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-bail-orange/10 flex items-center justify-center">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="var(--bail-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-lg font-semibold text-white">Message sent!</p>
              <p className="text-sm text-white/50">We&apos;ll be in touch within 24 hours.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-2 text-sm text-bail-orange hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-widest">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-bail-orange/50 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-widest">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-bail-orange/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-widest">
                  What are you building?
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us about your project, the problem you're solving, and any relevant context..."
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-bail-orange/50 transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-400 text-center">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-1 w-full py-3.5 rounded-full bg-bail-orange text-[var(--ink)] font-semibold text-sm hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-bail-orange/20"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
