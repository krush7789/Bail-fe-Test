import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Showcase from "@/components/Showcase";
import WhyBail from "@/components/WhyBail";
import TechStack from "@/components/TechStack";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <Showcase />
        <WhyBail />
        <TechStack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
