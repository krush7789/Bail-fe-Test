import { create } from "zustand";

export type Tier = "full" | "static";

// Global state shared by the HTML page and the WebGL world.
// Per-frame consumers read it in useFrame via useScene.getState() — no
// subscriptions — so scrolling and demo events never re-render the scene.
interface SceneState {
  tier: Tier | null;          // null until detected on the client
  ready: boolean;             // world has rendered its first frame (loader can leave)
  section: string;            // section currently in view: hero | hr | inventory | referral | together | process | contact
  orbHover: boolean;
  armed: boolean;             // touch: first tap on the orb arms, second enters
  diving: boolean;
  // demo → world events
  hired: boolean;             // HR demo: new hire placed
  stock: number[];            // Inventory demo: fill level per SKU row (0–1)
  referralCount: number;      // Referral demo: increments per fired referral
  referralFrom: number;       // …and which referrer fired it
  togetherStep: number;       // Together story: -1 idle, 0..3
  typingAt: number;           // Contact: last keystroke time (performance.now)
  workAccent: string;         // Work page: accent of the hovered card
  setTier: (t: Tier) => void;
}

export const useScene = create<SceneState>((set) => ({
  tier: null,
  ready: false,
  section: "hero",
  orbHover: false,
  armed: false,
  diving: false,
  hired: false,
  stock: [0.85, 0.8, 0.9, 0.85],
  referralCount: 0,
  referralFrom: 0,
  togetherStep: -1,
  typingAt: 0,
  workAccent: "#ed821c",
  setTier: (tier) => set({ tier }),
}));
