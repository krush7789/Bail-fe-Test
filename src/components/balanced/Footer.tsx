import React from "react";
import { brand } from "@/content/catalog";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#whyus" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--ink-2)] border-t border-[var(--glass-border)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-10">
          {/* Left: brand */}
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-white font-semibold text-base">{brand.name}</span>
            <p className="text-white/40 text-sm max-w-xs">{brand.tagline}</p>
          </div>

          {/* Center: nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-6" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: contact */}
          <div className="flex flex-col gap-1 text-center md:text-right">
            <a
              href={`mailto:${brand.email}`}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {brand.email}
            </a>
            <a
              href={`https://${brand.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/50 hover:text-white transition-colors duration-200"
            >
              {brand.website}
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-[var(--glass-border)] pt-6 text-center">
          <p className="text-xs text-white/20">
            © 2026 {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
