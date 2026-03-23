import PricingClient from "./PricingClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Bit AI Lab",
  description: "Transparent pricing for every AI service we offer.",
  robots: { index: false, follow: false },
};

export default function PricePage() {
  return <PricingClient />;
}
