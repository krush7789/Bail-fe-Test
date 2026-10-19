import type { Metadata } from "next";
import WorkPage from "@/components/os/WorkPage";

export const metadata: Metadata = {
  title: "Work — Bits AI Lab",
  description: "Products and custom AI systems built by Bits AI Lab: voice agents, automations and integrations.",
  robots: { index: false, follow: false },
};

export default function WorkRoute() {
  return <WorkPage />;
}
