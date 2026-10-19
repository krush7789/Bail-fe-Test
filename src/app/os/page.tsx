import type { Metadata } from "next";
import OsPage from "@/components/os/OsPage";

export const metadata: Metadata = {
  title: "Bits AI Lab — Three systems. Zero busywork.",
  description: "Bail HR, Bail Inventory and Bail Referral — AI-native business systems built by Bits AI Lab.",
  robots: { index: false, follow: false },
};

export default function OsRoute() {
  return <OsPage />;
}
