"use client";

import { useEffect, useRef, useState } from "react";

type Service = {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  description: string;
  items: string[];
};

const services: Service[] = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 12h8M12 8v8" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="#ed821c" fillOpacity="0.15"/>
      </svg>
    ),
    title: "Automate",
    tagline: "Replace manual work with intelligent systems",
    description:
      "We design and deploy AI-powered workflows that eliminate repetitive work — from document processing and voice agents to full business process automation across your entire stack.",
    items: [
      "AI Chatbots & Assistants (WhatsApp, website, Telegram)",
      "Voice AI Agents (calls, IVR, appointment booking)",
      "Business Process Automation",
      "Document & Invoice Processing (OCR, data extraction)",
      "RPA — automating legacy systems",
      "API & Tool Integrations (Zoho, Tally, SAP, ERPs)",
      "Workflow Automation (n8n, Make, Zapier)",
      "HR Automation (screening, onboarding, payroll bots)",
      "RAG Systems (internal knowledge base Q&A)",
    ],
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M3 17l4-8 4 4 3-6 4 10" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21H3" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Grow",
    tagline: "Build your digital presence and fill your pipeline",
    description:
      "We combine digital marketing, AI-generated content, and automation to build your online presence, attract quality leads, and convert them — all with less manual effort.",
    items: [
      "Website Design & Development",
      "SEO (local, technical, on-page)",
      "Social Media Management",
      "Performance Marketing (Google, Meta, LinkedIn Ads)",
      "WhatsApp Business Automation",
      "Email Marketing Automation",
      "Lead Generation & Outreach Automation",
      "AI-Generated Content (blogs, ads, product copy)",
      "CRM Setup & Automation",
    ],
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="#ed821c" strokeWidth="1.5"/>
        <path d="M6 9l3 3 3-3 3 3" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21h8M12 17v4" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Analyse",
    tagline: "Turn your data into decisions",
    description:
      "We build intelligence layers on top of your business data — dashboards, predictive models, and NLP tools that surface insights you can actually act on.",
    items: [
      "Business Intelligence Dashboards",
      "Data Scraping & Market Research",
      "Sentiment & Brand Analysis",
      "Predictive Analytics (sales, churn, demand)",
      "Multilingual NLP (Hindi, Tamil, Telugu and other regional languages)",
    ],
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Scale",
    tagline: "Build products, train teams, create content",
    description:
      "Beyond automation — we help you build AI-powered products, train your people to work with AI, and create the content and tools needed to grow at scale.",
    items: [
      "SaaS & MVP Development (white-label AI products)",
      "AI Video Generation (ads, explainers, demos)",
      "AI Avatar & Digital Spokesperson",
      "AI-Powered Recruitment Tools",
      "Personalized Learning Path Platforms",
      "Corporate AI Training & Workshops",
      "AI Readiness Audits & Consulting",
    ],
  },
];

function ServiceModal({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl shadow-black/10 w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#e8e8e8] px-7 py-5 flex items-start justify-between rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ed821c]/8 flex items-center justify-center shrink-0">
              {service.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#0a0a0a] tracking-tight">
                {service.title}
              </h3>
              <p className="text-xs text-[#6b7280] mt-0.5">{service.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f8f8f8] hover:bg-[#e8e8e8] flex items-center justify-center transition-colors shrink-0 ml-4 mt-0.5"
            aria-label="Close"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          <p className="text-sm text-[#6b7280] leading-relaxed mb-6">
            {service.description}
          </p>
          <ul className="flex flex-col gap-3">
            {service.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-[#ed821c]/10 flex items-center justify-center shrink-0">
                  <svg width="10" height="10" fill="none" viewBox="0 0 12 12">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#ed821c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-sm text-[#374151] leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={onClose}
            className="mt-8 w-full flex items-center justify-center py-3 rounded-full bg-[#2e337a] text-white text-sm font-medium hover:bg-[#232860] transition-colors shadow-lg shadow-[#2e337a]/20"
          >
            Start a project →
          </a>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  delay,
  onLearnMore,
}: {
  service: Service;
  delay: string;
  onLearnMore: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-up ${delay} group p-8 rounded-2xl border border-[#e8e8e8] bg-white hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-[#ed821c]/20 transition-all duration-300 flex flex-col`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#ed821c]/5 flex items-center justify-center mb-5 group-hover:bg-[#ed821c]/10 transition-colors">
        {service.icon}
      </div>
      <h3 className="text-[17px] font-semibold text-[#0a0a0a] mb-1 tracking-tight">
        {service.title}
      </h3>
      <p className="text-xs text-[#ed821c] font-medium mb-3">{service.tagline}</p>
      <p className="text-sm text-[#6b7280] leading-relaxed flex-1">{service.description}</p>
      <button
        onClick={onLearnMore}
        className="mt-5 text-sm font-medium text-[#2e337a] hover:text-[#232860] text-left transition-colors duration-200 flex items-center gap-1 group/btn"
      >
        Learn more
        <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">→</span>
      </button>
    </div>
  );
}

export default function Services() {
  const headingRef = useRef<HTMLDivElement>(null);
  const [activeService, setActiveService] = useState<Service | null>(null);

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
    <>
      <section id="services" className="py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div ref={headingRef} className="fade-up text-center mb-16">
            <span className="text-xs font-medium tracking-widest uppercase text-[#ed821c]">
              What we do
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
              Services
            </h2>
            <p className="mt-4 text-[#6b7280] max-w-lg mx-auto leading-relaxed">
              From automation to analytics — we cover every layer of the AI transformation your business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <ServiceCard
                key={s.title}
                service={s}
                delay={`delay-${(i + 1) * 100}`}
                onLearnMore={() => setActiveService(s)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}
