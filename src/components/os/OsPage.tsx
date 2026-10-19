"use client";

import { useEffect } from "react";
import Shell from "./Shell";
import { PRODUCTS } from "./products";
import Hero from "./Hero";
import ProductSection from "./ProductSection";
import Together from "./Together";
import Process from "./Process";
import Contact from "./Contact";
import World, { DiveFlash, Loader } from "./World";
import { useScene } from "./store";

const SECTIONS = ["hero", "hr", "inventory", "referral", "together", "process", "contact"];

export default function OsPage() {
  useSectionTracking();
  const section = useScene((s) => s.section);
  const onProduct = PRODUCTS.some((p) => p.id === section);

  return (
    <Shell onHome>
      <Loader />

      {/* product progress rail */}
      <div
        className={`fixed left-6 top-1/2 z-30 hidden xl:flex -translate-y-1/2 flex-col gap-3 transition-opacity duration-500 ${onProduct ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden
      >
        {PRODUCTS.map((p) => (
          <a key={p.id} href={`#${p.id}`} className="group flex items-center gap-3">
            <span
              className="h-px transition-all duration-500"
              style={{ width: section === p.id ? 32 : 12, background: section === p.id ? p.accent : "rgba(255,255,255,0.25)" }}
            />
            <span className="os-label transition-opacity opacity-0 group-hover:opacity-100 bg-[var(--os-bg)] pr-2">
              {p.name}
            </span>
          </a>
        ))}
      </div>

      <World />
      <DiveFlash />
      {/* click-through so the orb canvas behind gets pointer events; sections after the hero opt back in */}
      <main className="pointer-events-none relative z-10 [&>section~section]:pointer-events-auto">
        <Hero />
        {PRODUCTS.map((p, i) => (
          <ProductSection key={p.id} product={p} flip={i % 2 === 1} />
        ))}
        <Together />
        <Process />
        <Contact />
      </main>
    </Shell>
  );
}

// Which section owns the middle of the viewport → store.section (drives the
// world: bays assemble, conduits light, fog opens).
function useSectionTracking() {
  useEffect(() => {
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
        const current = SECTIONS.find((id) => visible.has(id));
        if (current) useScene.setState({ section: current });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}
