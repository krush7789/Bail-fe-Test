"use client";

import { useEffect } from "react";
import { useScene, type Tier } from "./store";

// Quality-first (owner decision): every device gets the full experience with
// all effects and animations. Only a browser that can't run WebGL2 at all
// falls back to the static (CSS) orb, since nothing would render otherwise.
export function detectTier(): Tier {
  try {
    return document.createElement("canvas").getContext("webgl2") ? "full" : "static";
  } catch {
    return "static";
  }
}

export function useQualityTier() {
  const tier = useScene((s) => s.tier);
  const setTier = useScene((s) => s.setTier);
  useEffect(() => { if (!tier) setTier(detectTier()); }, [tier, setTier]);
  return tier;
}
