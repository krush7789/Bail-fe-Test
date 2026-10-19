"use client";

import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import LenisProvider from "@/components/balanced/LenisProvider";
import Cursor from "./ui/Cursor";
import "./os.css";

const serif = Instrument_Serif({
  variable: "--font-os-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

// Where the new homepage lives. Flip to "/" when it replaces the live site.
export const HOME = "/os";

// Shared frame for /os, /work and /work/[slug]: nav, grain, footer, smooth scroll.
export default function Shell({ children, onHome = false }: { children: React.ReactNode; onHome?: boolean }) {
  const home = onHome ? "" : HOME; // in-page anchors on the homepage, full links elsewhere

  return (
    <LenisProvider>
      <div className={`os-root ${serif.variable}`}>
        {/* floating glass nav */}
        <nav className="fixed inset-x-0 top-4 z-40 px-4">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d0f]/70 pl-3 pr-2 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <Link href={HOME} className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="" className="h-8 w-8 rounded-lg bg-white p-0.5" />
              <span className="text-[15px] font-medium tracking-tight">Bits AI Lab</span>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2">
              <a href={`${home}#hr`} className="hidden md:block rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors">Products</a>
              <Link href="/work" className="rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors">Work</Link>
              <a href={`${home}#process`} className="hidden sm:block rounded-lg px-3 py-2 text-sm text-white/55 hover:bg-white/[0.05] hover:text-white transition-colors">Process</a>
              <a href={`${home}#contact`} className="os-btn ml-1 !py-2 !px-4 !text-[13px]">Book a demo</a>
            </div>
          </div>
        </nav>

        {/* faint film grain so the black reads matte, not flat */}
        <div aria-hidden className="noise-overlay !fixed z-50" style={{ opacity: 0.04 }} />

        <Cursor />
        {children}

        <footer className="relative z-10 flex flex-col sm:flex-row justify-between gap-2 border-t border-white/[0.06] px-4 sm:px-8 py-8 os-label">
          <span>© {new Date().getFullYear()} bits ai lab</span>
          <span>noida · india</span>
        </footer>
      </div>
    </LenisProvider>
  );
}
