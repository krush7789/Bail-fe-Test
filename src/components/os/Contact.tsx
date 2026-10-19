"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PRODUCTS } from "./products";
import { useScene } from "./store";
import Magnetic from "./ui/Magnetic";

// Keyword → product hint shown live under the message field.
// ponytail: keyword match, swap for /api/chat if the hints feel too dumb.
const HINTS: [RegExp, string][] = [
  [/\bhr\b|employee|payroll|leave|attendance|onboard|hiring/i, "hr"],
  [/referr|partner|lead source|clinic|doctor/i, "referral"],
  [/stock|inventory|warehouse|\bsku|purchase order|supply/i, "inventory"],
  [/\bcalls?\b|voice|phone|appointment|booking|reception/i, "voice"],
  [/integrat|whatsapp|sheet|\bcrm\b|\berp\b|automat|\bapis?\b|tally/i, "custom"],
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const matched = HINTS.filter(([re]) => re.test(form.message)).map(([, id]) => PRODUCTS.find((p) => p.id === id)!);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="min-h-[100svh] flex items-center px-4 sm:px-8 py-32">
      <div className="mx-auto w-full max-w-6xl grid gap-16 lg:grid-cols-2">
        {/* soft dark backdrop so the lab's light pillars never cut through the heading */}
        <div className="relative">
          <div aria-hidden className="pointer-events-none absolute -inset-16 -z-10" style={{ background: "radial-gradient(closest-side, rgba(8,9,10,0.92), rgba(8,9,10,0.6) 60%, transparent)" }} />
          <p className="os-label">contact</p>
          <h2 className="os-display mt-4 text-[clamp(64px,11vw,150px)] leading-[0.9]">
            let&apos;s<br />build<span className="text-[var(--accent)]">.</span>
          </h2>
          <p className="mt-8 text-[var(--os-dim)] leading-relaxed">
            4th Floor, D-312, Sector-63A, Noida 201301
          </p>
        </div>

        {status === "sent" ? (
          <div className="self-center">
            <p className="os-display text-4xl">got it. we&apos;ll reply within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="os-glass self-center flex flex-col gap-6 p-7 sm:p-9">
            <input className="os-field" required placeholder="your name" autoComplete="name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="os-field" required type="email" placeholder="work email" autoComplete="email"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div>
              <textarea className="os-field resize-none" required rows={3} maxLength={2000} placeholder="what are you building?"
                value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); useScene.setState({ typingAt: performance.now() }); }} />
              <div className="min-h-[28px] mt-2">
                <AnimatePresence>
                  {matched.length > 0 && (
                    <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-sm text-[var(--os-dim)]">
                      sounds like a job for{" "}
                      {matched.map((p, i) => (
                        <span key={p.id}>
                          {i > 0 && " + "}
                          <span style={{ color: p.accent }}>{p.name}</span>
                        </span>
                      ))}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Magnetic>
                <button type="submit" disabled={status === "sending"} className="os-btn">
                  {status === "sending" ? "sending…" : "send ▸"}
                </button>
              </Magnetic>
              {status === "error" && <p className="text-sm text-red-400">couldn&apos;t send — try again or email us.</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
