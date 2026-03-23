"use client";

import { useEffect, useRef } from "react";

const tools = [
  "OpenAI", "Anthropic", "LangChain", "LangGraph", "Vercel",
  "Make.com", "n8n", "Python", "TypeScript", "Next.js",
  "PostgreSQL", "Pinecone", "Supabase", "FastAPI", "Docker",
];

const tools2 = [
  "Llama", "Mistral", "Ollama", "HuggingFace", "Flowise",
  "Zapier", "Airtable", "Redis", "AWS", "Cloudflare",
  "Stripe", "Resend", "Prisma", "TailwindCSS", "React",
];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className={reverse ? "marquee-track-reverse" : "marquee-track"}>
        {doubled.map((tool, i) => (
          <span
            key={i}
            className="inline-flex items-center mx-3 px-5 py-2.5 rounded-full border border-[#e8e8e8] bg-white text-sm font-medium text-[#6b7280] whitespace-nowrap hover:border-[#5158e9]/30 hover:text-[#5158e9] transition-colors duration-200 cursor-default"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TechStack() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-[#f8f8f8] overflow-hidden">
      <div ref={headingRef} className="fade-up text-center mb-12 px-6">
        <span className="text-xs font-medium tracking-widest uppercase text-[#5158e9]">
          Tech stack
        </span>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-[#0a0a0a]">
          Built with the best tools in AI
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow items={tools} />
        <MarqueeRow items={tools2} reverse />
      </div>
    </section>
  );
}
