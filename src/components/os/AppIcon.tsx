import { Users, Boxes, Share2 } from "lucide-react";

const GLYPH = { hr: Users, inventory: Boxes, referral: Share2 } as const;

// Glossy product "app icon" in the product's accent colour.
export default function AppIcon({ id, accent, size = 56 }: { id: keyof typeof GLYPH; accent: string; size?: number }) {
  const Glyph = GLYPH[id];
  return (
    <span className="os-appicon shrink-0" style={{ width: size, height: size, ["--accent" as string]: accent }}>
      <Glyph size={size * 0.46} strokeWidth={2.2} />
    </span>
  );
}
