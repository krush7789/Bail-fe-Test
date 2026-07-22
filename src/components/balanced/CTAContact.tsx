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
    <section id="contact" className="relative bg-[var(--ink)] py-24 px-6 overflow-hidden" aria-labelledby="cta-heading">
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

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Big headline */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <h2
            id="cta-heading"
            className="text-4xl md:text-6xl font-bold text-white"
          >
            {cta.headline}
          </h2>
        </motion.div>

        {/* 2-Column Split: Compact Form on Left + Information Tab on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SIDE: Contact form (Trimmed & Compact) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="bg-[var(--ink-3)] border border-[var(--glass-border)] rounded-2xl p-5 md:p-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl"
          >
            {status === "success" ? (
              <div className="text-center py-8 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[var(--bail-orange)]/10 flex items-center justify-center">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5" stroke="var(--bail-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-base font-semibold text-white">Message sent!</p>
                <p className="text-xs text-white/50">We&apos;ll be in touch within 24 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-1 text-xs text-[var(--bail-orange)] hover:underline font-semibold"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="contact-name" className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--bail-orange)]/50 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="contact-email" className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="you@company.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--bail-orange)]/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="contact-message" className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                      What are you building?
                    </label>
                    <textarea
                      id="contact-message"
                      rows={2}
                      required
                      placeholder="Tell us about your project or workflow..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--bail-orange)]/50 transition-colors resize-none"
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 text-center">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <div className="relative mt-1 group">
                  {status !== "sending" && (
                    <div
                      className="absolute inset-0 rounded-full blur-lg opacity-50 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none"
                      style={{ background: "linear-gradient(to right, #ed821c, #7c3aed, #00d4ff)" }}
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="relative w-full py-2.5 rounded-full bg-[#0d1224] text-white font-semibold text-xs md:text-sm border border-white/10 hover:bg-[#111829] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200"
                  >
                    {status === "sending" ? "Sending..." : "Send message →"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>

          {/* RIGHT SIDE: Information Tab Card (Simple, Clean, Professional) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="bg-[var(--ink-3)] border border-[var(--glass-border)] rounded-2xl p-6 md:p-7 h-full flex flex-col justify-between space-y-4 shadow-2xl backdrop-blur-xl"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--bail-orange)] block mb-1 font-mono">
                CONTACT INFORMATION
              </span>
              <h3 className="text-xl font-bold text-white mb-4">
                Get in touch with our team
              </h3>

              <div className="space-y-3">
                {/* Company Name */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-white/40 block mb-0.5">
                    Company Name
                  </span>
                  <span className="text-sm font-semibold text-white">Bits AI Labs</span>
                </div>

                {/* Address */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-white/40 block mb-0.5">
                    Address
                  </span>
                  <span className="text-sm font-semibold text-white">New Delhi, India</span>
                </div>

                {/* Phone */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-white/40 block mb-0.5">
                    Phone
                  </span>
                  <a href="tel:+911234567890" className="text-sm font-semibold text-white hover:text-[var(--bail-orange)] transition-colors">
                    +91 1234567890
                  </a>
                </div>

                {/* Email Address */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-white/40 block mb-0.5">
                    Email Address
                  </span>
                  <a href="mailto:bitsailabs@bits.com" className="text-sm font-semibold text-white hover:text-[var(--bail-orange)] transition-colors">
                    bitsailabs@bits.com
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Direct Team Response
              </span>
              <span>IST (UTC+5:30)</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Minimal Footer Strip */}
      <div className="relative z-10 max-w-5xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p>© 2026 Bits AI Lab. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#process" className="hover:text-white transition-colors">Process</a>
          <a href="#whyus" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </section>
  );
}
