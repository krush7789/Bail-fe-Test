"use client";

import React from "react";
import LenisProvider from "@/components/balanced/LenisProvider";
import CustomCursor from "@/components/immersive/CustomCursor";
import ImmersiveHero from "@/components/immersive/ImmersiveHero";
import PinnedProcess from "@/components/immersive/PinnedProcess";
import Navbar from "@/components/balanced/Navbar";
import StatsBand from "@/components/balanced/StatsBand";
import Services from "@/components/balanced/Services";
import AIDemo from "@/components/balanced/AIDemo";
import WhyUs from "@/components/balanced/WhyUs";
import CaseStudy from "@/components/balanced/CaseStudy";
import TechStack from "@/components/balanced/TechStack";
import CTAContact from "@/components/balanced/CTAContact";
import Footer from "@/components/balanced/Footer";

export default function ImmersivePage() {
  return (
    <LenisProvider>
      {/* Custom glowing cursor — replaces system cursor on pointer devices */}
      <CustomCursor />
      <Navbar />
      <main>
        <ImmersiveHero />
        <StatsBand />
        <Services />
        <AIDemo />
        <PinnedProcess />
        <WhyUs />
        <CaseStudy />
        <TechStack />
        <CTAContact />
      </main>
      <Footer />
    </LenisProvider>
  );
}
