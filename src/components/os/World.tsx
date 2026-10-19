"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useScene } from "./store";
import { useQualityTier } from "./quality";
import { markPortal } from "./portal";

const LabScene = dynamic(() => import("./LabScene"), { ssr: false });

// Orb click → dive → /work. Touch needs two taps (arm, then enter).
export function useOrbEnter() {
  const router = useRouter();
  return () => {
    const s = useScene.getState();
    if (s.diving) return;
    if (window.matchMedia("(hover: none)").matches && !s.armed) { useScene.setState({ armed: true }); return; }
    markPortal();
    if (s.tier === "static") { router.push("/work"); return; }
    useScene.setState({ diving: true });
    setTimeout(() => router.push("/work"), 1100);
  };
}

// The single fixed canvas behind the homepage.
export default function World() {
  const tier = useQualityTier();
  const enter = useOrbEnter();

  // reset per-visit state; don't leak the orb's pointer cursor off this page
  useEffect(() => () => {
    useScene.setState({ diving: false, armed: false, orbHover: false, section: "hero" });
    document.body.style.cursor = "";
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {tier === "static" ? <StaticOrb onEnter={enter} /> : tier ? <LabScene onEnter={enter} /> : null}
    </div>
  );
}

// First load: hold a calm loader until the world has drawn its first frame
// (shader compile), at least long enough to read.
export function Loader() {
  const ready = useScene((s) => s.ready);
  const tier = useScene((s) => s.tier);
  const [minDone, setMinDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMinDone(true), 1400); return () => clearTimeout(t); }, []);
  const show = !minDone || (tier === "full" && !ready);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#08090a]"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="h-16 w-16 rounded-full"
            style={{ background: "radial-gradient(circle, #ffb066 0%, #ed821c 30%, transparent 70%)" }}
            animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="os-label mt-8">entering the lab</p>
          <div className="mt-4 h-px w-40 overflow-hidden bg-white/10">
            <motion.div className="h-full bg-[var(--accent)]" initial={{ width: "0%" }} animate={{ width: ready ? "100%" : "80%" }} transition={{ duration: ready ? 0.4 : 3, ease: "easeOut" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// No WebGL2: a still CSS orb that is still the door to /work.
function StaticOrb({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-[16svh]"
      style={{ background: "radial-gradient(60% 50% at 50% 35%, rgba(237,130,28,0.12), transparent 70%), #08090a" }}>
      <button
        onClick={onEnter}
        aria-label="Enter the lab — see our work"
        className="relative h-[min(40vw,260px)] w-[min(40vw,260px)] rounded-full border border-white/20"
        style={{
          background: "radial-gradient(circle at 50% 50%, #ffb066 0%, #ed821c 14%, rgba(237,130,28,0.25) 32%, rgba(255,255,255,0.04) 60%, rgba(255,255,255,0.1) 100%)",
          boxShadow: "0 0 120px -10px rgba(237,130,28,0.55), inset 0 2px 30px rgba(255,255,255,0.15)",
        }}
      />
    </div>
  );
}

// The dive's light flood. Rendered outside <main> so it can cover the nav too.
export function DiveFlash() {
  const diving = useScene((s) => s.diving);
  return (
    <AnimatePresence>
      {diving && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: "easeIn" }}
          style={{ background: "radial-gradient(circle at 50% 50%, #fff4e6 0%, #ed821c 35%, #08090a 75%)" }}
        />
      )}
    </AnimatePresence>
  );
}
