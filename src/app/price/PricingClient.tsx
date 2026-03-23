"use client";

import { useState } from "react";
import { pricingData, type Category, type Service, type Tier } from "./pricingData";
import Image from "next/image";

const tierColors = {
  Starter: { bg: "bg-[#f8f8f8]", badge: "bg-[#e8e8e8] text-[#6b7280]", border: "border-[#e8e8e8]" },
  Standard: { bg: "bg-[#f0f1fe]", badge: "bg-[#5158e9]/10 text-[#5158e9]", border: "border-[#5158e9]/20" },
  Premium: { bg: "bg-[#0a0a0a]", badge: "bg-white/10 text-white", border: "border-white/10" },
};

function TierCard({ tier }: { tier: Tier }) {
  const colors = tierColors[tier.name];
  const isPremium = tier.name === "Premium";

  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${colors.badge}`}>
          {tier.name}
        </span>
        <span className={`text-xs ${isPremium ? "text-white/40" : "text-[#6b7280]"}`}>
          Delivered in {tier.delivery}
        </span>
      </div>

      <div>
        <div className={`text-xl font-bold tracking-tight ${isPremium ? "text-white" : "text-[#0a0a0a]"}`}>
          {tier.price}
        </div>
        {tier.monthly && (
          <div className={`text-sm mt-0.5 ${isPremium ? "text-white/60" : "text-[#6b7280]"}`}>
            + {tier.monthly}
          </div>
        )}
        <div className={`text-xs mt-2 font-medium ${isPremium ? "text-white/50" : "text-[#6b7280]"}`}>
          Annual: {tier.annual}
        </div>
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isPremium ? "bg-white/10" : "bg-[#5158e9]/10"}`}>
              <svg width="8" height="8" fill="none" viewBox="0 0 10 10">
                <path d="M2 5l2 2 4-4" stroke={isPremium ? "#fff" : "#5158e9"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className={`text-xs leading-relaxed ${isPremium ? "text-white/70" : "text-[#374151]"}`}>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="/contact"
        className={`mt-2 text-center text-xs font-semibold py-2.5 rounded-full transition-colors ${
          isPremium
            ? "bg-white text-[#0a0a0a] hover:bg-white/90"
            : tier.name === "Standard"
            ? "bg-[#5158e9] text-white hover:bg-[#4048d4]"
            : "bg-white border border-[#e8e8e8] text-[#0a0a0a] hover:border-[#0a0a0a]/20"
        }`}
      >
        Get started
      </a>
    </div>
  );
}

function ServiceRow({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#e8e8e8] rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#f8f8f8] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#6b7280] w-6 shrink-0">{String(service.id).padStart(2, "0")}</span>
          <span className="text-[15px] font-medium text-[#0a0a0a]">{service.title}</span>
        </div>
        <span className={`shrink-0 ml-4 w-7 h-7 rounded-full border border-[#e8e8e8] flex items-center justify-center transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      {open && (
        <div className="border-t border-[#e8e8e8] px-6 py-6">
          {service.categoryNote && (
            <p className="text-xs text-[#6b7280] bg-[#f8f8f8] rounded-lg px-4 py-3 mb-5 border border-[#e8e8e8]">
              ℹ️ {service.categoryNote}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {service.tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  return (
    <div className="flex flex-col gap-3">
      {category.services.map((service) => (
        <ServiceRow key={service.id} service={service} />
      ))}
    </div>
  );
}

export default function PricingClient() {
  const [activeTab, setActiveTab] = useState(pricingData[0].id);
  const activeCategory = pricingData.find((c) => c.id === activeTab)!;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#e8e8e8] px-6 py-4">
        <a href="/" className="inline-flex items-center gap-2.5 group">
          <Image src="/logo.svg" alt="Bit AI Lab" width={32} height={16} />
          <span className="text-sm font-semibold text-[#0a0a0a]">Bit AI Lab</span>
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-widest uppercase text-[#5158e9]">Pricing</span>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-[#0a0a0a]">
            Transparent pricing.<br />No surprises.
          </h1>
          <p className="mt-4 text-[#6b7280] max-w-md mx-auto text-sm leading-relaxed">
            All prices in INR, excluding 18% GST. Annual cost = one-time setup + (monthly × 12). Click any service to see tier details.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#f8f8f8] rounded-2xl mb-10 overflow-x-auto">
          {pricingData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 min-w-[100px] px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === cat.id
                  ? "bg-white text-[#0a0a0a] shadow-sm"
                  : "text-[#6b7280] hover:text-[#0a0a0a]"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`ml-2 text-xs ${activeTab === cat.id ? "text-[#5158e9]" : "text-[#9ca3af]"}`}>
                {cat.services.length}
              </span>
            </button>
          ))}
        </div>

        {/* Category tagline */}
        <p className="text-sm text-[#6b7280] mb-6">{activeCategory.tagline}</p>

        {/* Services */}
        <CategorySection key={activeCategory.id} category={activeCategory} />

        {/* Footer note */}
        <div className="mt-12 p-6 rounded-2xl bg-[#f8f8f8] border border-[#e8e8e8] text-center">
          <p className="text-sm text-[#6b7280]">
            Not sure which plan is right for you?{" "}
            <a href="/#contact" className="text-[#5158e9] font-medium hover:underline">
              Talk to us
            </a>{" "}
            — we&apos;ll recommend the best fit for your needs and budget.
          </p>
        </div>
      </div>
    </div>
  );
}
