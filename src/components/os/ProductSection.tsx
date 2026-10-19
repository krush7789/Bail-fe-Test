"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PRODUCTS, type Product, type DemoKind } from "./products";
import MediaFrame from "./MediaFrame";
import AppIcon from "./AppIcon";
import SplitWords from "./ui/SplitWords";
import Magnetic from "./ui/Magnetic";
import HrDemo from "./demos/HrDemo";
import ReferralDemo from "./demos/ReferralDemo";
import InventoryDemo from "./demos/InventoryDemo";

const DEMOS: Record<DemoKind, (p: { live: boolean }) => React.ReactElement> = {
  hr: HrDemo,
  referral: ReferralDemo,
  inventory: InventoryDemo,
};

const ease = [0.16, 1, 0.3, 1] as const;

// Product section over its 3D bay: frosted copy panel + a framed live demo
// whose edge lights up and whose UI builds itself (and drives the bay).
export default function ProductSection({ product, flip }: { product: Product; flip: boolean }) {
  const Demo = DEMOS[product.demo];
  const [live, setLive] = useState(false);

  return (
    <section
      id={product.id}
      className="relative px-4 sm:px-8"
      style={{ ["--accent" as string]: product.accent }}
    >
      {/* stage: the 3D bay alone on screen, assembling, with just the name */}
      <div className={`flex h-[100svh] items-end pb-[12svh] ${flip ? "justify-end text-right" : ""}`}>
        <div className="mx-auto w-full max-w-6xl">
          <p className="os-label">{product.index} / 0{PRODUCTS.length}</p>
          <h2 className="os-display mt-3 text-[clamp(56px,10vw,150px)] leading-[0.9]">
            <SplitWords text={product.name} inView />
          </h2>
          <p className="mt-4 text-lg text-white/70">{product.tagline}</p>
        </div>
      </div>

      <div className="flex min-h-[100svh] items-center py-28">
      <div className={`relative mx-auto w-full max-w-6xl grid gap-12 lg:gap-16 items-center ${flip ? "lg:grid-cols-[1.2fr_0.8fr] lg:[&>*:first-child]:order-2" : "lg:grid-cols-[0.8fr_1.2fr]"}`}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease }}
          className="os-glass p-7 sm:p-9"
        >
          <div className="flex items-center gap-4">
            <AppIcon id={product.demo} accent={product.accent} size={52} />
            <span className="os-pill">{product.index} / 0{PRODUCTS.length}</span>
          </div>
          <h3 className="os-display mt-7 text-[clamp(40px,5vw,64px)] leading-[0.95]">{product.name}</h3>
          <p className="mt-4 text-xl sm:text-2xl text-white/85">{product.tagline}</p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--os-dim)]">{product.blurb}</p>

          <ul className="mt-8 grid grid-cols-2 gap-2.5">
            {product.features.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm"
              >
                <Check size={14} className="shrink-0 text-[var(--accent)]" />
                {f}
              </motion.li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic><a href="#contact" className="os-btn">book a demo</a></Magnetic>
            <a href="#contact" className="os-btn ghost">get a quote →</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          onViewportEnter={() => setLive(true)}
          transition={{ duration: 1.1, ease, delay: 0.1 }}
        >
          <MediaFrame product={product} live={live}>
            <Demo live={live} />
          </MediaFrame>
        </motion.div>
      </div>
      </div>
    </section>
  );
}
