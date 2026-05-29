import LenisProvider from "@/components/balanced/LenisProvider";
import Navbar from "@/components/balanced/Navbar";
import Hero from "@/components/balanced/Hero";
import StatsBand from "@/components/balanced/StatsBand";
import Services from "@/components/balanced/Services";
import AIDemo from "@/components/balanced/AIDemo";
import HowItWorks from "@/components/balanced/HowItWorks";
import WhyUs from "@/components/balanced/WhyUs";
import CaseStudy from "@/components/balanced/CaseStudy";
import TechStack from "@/components/balanced/TechStack";
import CTAContact from "@/components/balanced/CTAContact";
import Footer from "@/components/balanced/Footer";

export default function BalancedHome() {
  return (
    <LenisProvider>
      <Navbar />
      <main>
        <Hero />
        <StatsBand />
        <Services />
        <AIDemo />
        <HowItWorks />
        <WhyUs />
        <CaseStudy />
        <TechStack />
        <CTAContact />
      </main>
      <Footer />
    </LenisProvider>
  );
}
