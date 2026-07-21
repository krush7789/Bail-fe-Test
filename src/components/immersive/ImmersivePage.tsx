"use client";

import React from "react";
import LenisProvider from "@/components/balanced/LenisProvider";
import ImmersiveHero from "@/components/immersive/ImmersiveHero";
import PinnedProcess from "@/components/immersive/PinnedProcess";
import Navbar from "@/components/balanced/Navbar";
import StatsBand from "@/components/balanced/StatsBand";
import ImmersiveServices from "@/components/immersive/ImmersiveServices";
import AIDemo from "@/components/balanced/AIDemo";
import WhyUs from "@/components/balanced/WhyUs";
import CTAContact from "@/components/balanced/CTAContact";

function DataConduit({ variant = "orange" }: { variant?: "orange" | "cyan" }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-16 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
    >
      {[0, 0.6, 1.2].map((delay) => (
        <span
          key={delay}
          className={`packet ${variant === "cyan" ? "packet-cyan" : ""}`}
          style={{
            offsetPath: "path('M 0 0 L 0 64')",
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function ImmersivePage() {
  return (
    <LenisProvider>
      <Navbar />
      <main>
        <ImmersiveHero />
        <DataConduit variant="orange" />
        <ImmersiveServices />
        <DataConduit variant="cyan" />
        <AIDemo />
        <PinnedProcess />
        <WhyUs />
        <CTAContact />
      </main>
    </LenisProvider>
  );
}
