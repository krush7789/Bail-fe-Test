"use client";

import React from "react";
import LenisProvider from "@/components/balanced/LenisProvider";
import ImmersiveHero from "@/components/immersive/ImmersiveHero";
import PinnedProcess from "@/components/immersive/PinnedProcess";
import Navbar from "@/components/balanced/Navbar";
import ImmersiveServices from "@/components/immersive/ImmersiveServices";
import AIDemo from "@/components/balanced/AIDemo";
import WhyUs from "@/components/balanced/WhyUs";
import CTAContact from "@/components/balanced/CTAContact";

export default function ImmersivePage() {
  return (
    <LenisProvider>
      <Navbar />
      <main>
        <ImmersiveHero />
        <ImmersiveServices />
        <AIDemo />
        <PinnedProcess />
        <WhyUs />
        <CTAContact />
      </main>
    </LenisProvider>
  );
}
