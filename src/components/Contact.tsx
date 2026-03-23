"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
    <section id="contact" className="py-28 px-6 bg-[#f8f8f8]">
      <div ref={sectionRef} className="fade-up max-w-xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-widest uppercase text-[#5158e9]">
            Get in touch
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
            Ready to build<br />something intelligent?
          </h2>
          <p className="mt-4 text-[#6b7280]">
            Tell us what you&apos;re working on. We&apos;ll get back to you within 24 hours.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-16 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#5158e9]/10 flex items-center justify-center">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke="#5158e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-lg font-semibold text-[#0a0a0a]">Message sent!</p>
            <p className="text-sm text-[#6b7280]">We&apos;ll be in touch within 24 hours.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-2 text-sm text-[#5158e9] hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0a0a0a]">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-[#e8e8e8] bg-white text-sm text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#5158e9] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#0a0a0a]">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-[#e8e8e8] bg-white text-sm text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#5158e9] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#0a0a0a]">
                What are you building?
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tell us about your project, the problem you're solving, and any relevant context..."
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="px-4 py-3 rounded-xl border border-[#e8e8e8] bg-white text-sm text-[#0a0a0a] placeholder:text-[#6b7280] focus:outline-none focus:border-[#5158e9] transition-colors resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-500 text-center">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 w-full py-3.5 rounded-full bg-[#5158e9] text-white font-medium text-sm hover:bg-[#4048d4] disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg shadow-[#5158e9]/20"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
