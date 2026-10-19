// The three flagship products shown on the homepage.
// To drop in real assets: put files in /public/os/ and fill `video` / `screens`.
// Anything left undefined renders a labelled placeholder slot.

export type DemoKind = "hr" | "referral" | "inventory";

export interface Product {
  id: string;
  demo: DemoKind;
  index: string;
  name: string;
  tagline: string;
  blurb: string;
  features: string[];
  accent: string;
  video?: string;          // e.g. "/os/hr.mp4"  — 8–12s silent loop
  poster?: string;         // first frame of the video
  screens: (string | undefined)[]; // up to 3 screenshots, e.g. "/os/hr-1.png"
  videoHint: string;       // what the placeholder asks for
}

export const PRODUCTS: Product[] = [
  {
    id: "hr",
    demo: "hr",
    index: "01",
    name: "bail HR",
    tagline: "people ops that run themselves.",
    blurb:
      "Onboarding, attendance, leave and payroll in one quiet system. AI handles the paperwork so your team handles people.",
    features: ["onboarding", "payroll", "leave & attendance", "org chart"],
    accent: "#ed821c",
    screens: [undefined, undefined, undefined],
    videoHint: "8–12s loop · dashboard → employee → approve leave",
  },
  {
    id: "inventory",
    demo: "inventory",
    index: "02",
    name: "bail Inventory",
    tagline: "stock that reorders itself.",
    blurb:
      "Real-time stock across locations, demand-aware alerts, and purchase orders raised before you run out.",
    features: ["live stock", "low-stock alerts", "auto purchase orders"],
    accent: "#34d399",
    screens: [undefined, undefined, undefined],
    videoHint: "8–12s loop · search SKU → stock drops → alert → reorder",
  },
  {
    id: "referral",
    demo: "referral",
    index: "03",
    name: "bail Referral",
    tagline: "every referral, accounted for.",
    blurb:
      "Track referrals from first touch to conversion. Automated follow-ups, live status, and a clear view of who sends you business.",
    features: ["pipeline tracking", "auto follow-ups", "partner analytics"],
    accent: "#8b5cf6",
    screens: [undefined, undefined, undefined],
    videoHint: "8–12s loop · create referral → sent → accepted → converted",
  },
];

export const VOICE_ACCENT = "#22d3ee";

// Real voice-agent session. Set `audio` to the recording and replace `lines`
// with its transcript (t = seconds into the audio). Without audio, the
// transcript plays on a timer as a preview.
export const VOICE_SESSION = {
  audio: undefined as string | undefined, // e.g. "/os/voice-call.mp3"
  lines: [
    { t: 0, who: "agent", text: "Hi, this is Ava from Sharma Dental. How can I help?" },
    { t: 3.5, who: "caller", text: "I wanted to book a cleaning, sometime this week?" },
    { t: 7, who: "agent", text: "Sure — I have Thursday at 11 or Friday at 4. Which works?" },
    { t: 11.5, who: "caller", text: "Actually, can we do Saturday instead?" },
    { t: 14.5, who: "agent", text: "Saturday 10:30 is open. Shall I book it under your number?" },
    { t: 19, who: "caller", text: "Yes please." },
    { t: 21, who: "agent", text: "Done. You'll get a WhatsApp confirmation in a moment." },
  ] as { t: number; who: "agent" | "caller"; text: string }[],
  duration: 25,
};
