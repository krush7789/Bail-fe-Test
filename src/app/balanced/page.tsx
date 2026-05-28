import type { Metadata } from "next";
import BalancedHome from "@/components/balanced/BalancedHome";

export const metadata: Metadata = {
  title: "Bits AI Lab — AI-Powered Services",
  description: "Agents, Voice AI & Automation built to grow your business.",
  robots: { index: false, follow: false },
};

export default function BalancedPage() {
  return <BalancedHome />;
}
