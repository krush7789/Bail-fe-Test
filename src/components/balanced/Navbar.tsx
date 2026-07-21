"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GlowButton } from "@/components/ui/button-1";
import { brand } from "@/content/catalog";

const NAV_LEFT = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
];

const NAV_RIGHT = [
  { label: "About", href: "#whyus" },
  { label: "Contact", href: "#contact" },
];

const ALL_NAV = [...NAV_LEFT, ...NAV_RIGHT];

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > window.innerHeight * 0.85);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ─── Split nav: visible in hero ─── */}
      <AnimatePresence>
        {!pastHero && (
          <motion.nav
            role="navigation"
            aria-label="Hero navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
              {/* Left group: Logo + nav links */}
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 group"
                  aria-label={`${brand.name} — home`}
                >
                  <span className="flex items-center justify-center bg-white/10 border border-white/15 rounded-2xl p-2 shrink-0 backdrop-blur-md shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.gif"
                      alt={`${brand.name} logo`}
                      width={38}
                      height={38}
                      className="block w-9 h-9 md:w-10 md:h-10 object-contain"
                    />
                  </span>
                  <span className="text-white font-bold text-lg md:text-xl tracking-tight group-hover:text-[var(--bail-orange)] transition-colors duration-200 hidden sm:inline">
                    {brand.name}
                  </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                  {NAV_LEFT.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Right group: nav links + CTA */}
              <div className="hidden md:flex items-center gap-1">
                {NAV_RIGHT.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-full text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="ml-2">
                  <GlowButton label="Book a call" href="/#contact" size="md" />
                </div>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-white/70 hover:text-white transition-colors p-2"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
              <div className="md:hidden bg-[var(--ink-2)]/95 backdrop-blur-md border-t border-white/5 px-6 py-4 flex flex-col gap-3">
                {ALL_NAV.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-white/70 hover:text-white text-base font-medium transition-colors py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-2">
                  <GlowButton label="Book a call" href="/#contact" size="md" />
                </div>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ─── Floating pill navbar: visible after scrolling past hero ─── */}
      <AnimatePresence>
        {pastHero && (
          <motion.nav
            role="navigation"
            aria-label="Main navigation"
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="floating-nav-pill rounded-full px-2 py-1.5 flex items-center gap-1">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center justify-center shrink-0 px-2"
                aria-label={`${brand.name} — home`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.gif"
                  alt={`${brand.name} logo`}
                  width={30}
                  height={30}
                  className="block w-7 h-7 rounded-xl object-contain"
                />
              </Link>

              {/* Divider */}
              <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

              {/* Nav links */}
              {ALL_NAV.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}

              {/* Divider */}
              <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

              {/* CTA */}
              <a
                href="/#contact"
                className="px-4 py-1.5 rounded-full bg-[var(--bail-orange)] text-white text-xs font-bold hover:brightness-110 transition-all duration-200 whitespace-nowrap"
              >
                Book a call
              </a>
            </div>

            {/* Mobile: hamburger in pill */}
            <button
              className="sm:hidden absolute right-14 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1"
              aria-label="Open menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile menu for pill nav */}
      <AnimatePresence>
        {pastHero && mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-4 right-4 z-50 floating-nav-pill rounded-2xl px-6 py-4 flex flex-col gap-3 sm:hidden"
          >
            {ALL_NAV.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors py-1.5"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
