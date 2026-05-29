import type { Metadata } from "next";
import ImmersivePage from "@/components/immersive/ImmersivePage";

export const metadata: Metadata = {
  title: "Bits AI Lab — Maximum Immersive",
  description:
    "Agents, Voice AI & Automation — built to grow your business.",
  robots: { index: false, follow: false },
};

export default function ImmersiveRoute() {
  return <ImmersivePage />;
}
