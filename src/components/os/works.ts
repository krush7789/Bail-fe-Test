// Everything shown on /work and /work/[slug].
// `sample: true` = placeholder copy/metrics written for layout only. It shows a
// visible "sample" tag on the card and case study — replace the text with real
// project details, then set it to false. Don't ship sample metrics as real.

export const FILTERS = ["all", "products", "automate", "grow", "analyse", "scale"] as const;
export type Tag = Exclude<(typeof FILTERS)[number], "all">;
export type Pillar = Exclude<Tag, "products">;

// The four service pillars, from SERVICES.md. Shown under the Work filters
// when a pillar is selected. (No prices — those are never published.)
export const PILLARS: Record<Pillar, { line: string; services: string[] }> = {
  automate: {
    line: "Replace manual work with intelligent systems",
    services: ["AI chatbots & assistants", "Voice AI agents", "Business process automation", "Document & invoice processing", "RPA for legacy systems", "API & tool integrations", "Workflow automation", "HR automation", "RAG knowledge systems"],
  },
  grow: {
    line: "Build your digital presence and fill your pipeline",
    services: ["Website design & development", "SEO", "Social media management", "Performance marketing", "WhatsApp business automation", "Email marketing automation", "Lead generation & outreach", "AI-generated content", "CRM setup & automation"],
  },
  analyse: {
    line: "Turn your data into decisions",
    services: ["Business intelligence dashboards", "Data scraping & market research", "Sentiment & brand analysis", "Predictive analytics", "Multilingual NLP (Hindi, Tamil, Telugu…)"],
  },
  scale: {
    line: "Build products, train teams, create content",
    services: ["SaaS & MVP development", "AI video generation", "AI avatar & digital spokesperson", "AI-powered recruitment tools", "Personalised learning platforms", "Corporate AI training", "AI readiness audits"],
  },
};

export interface Work {
  slug: string;
  title: string;
  kind: string;            // small label above the title, e.g. "product" / "client build"
  tags: Tag[];
  accent: string;
  result: string;          // one-line headline result
  problem: string;
  quote: string;           // pull-quote for the problem section
  built: [string, string, string]; // three "what we built" captions (one per screenshot)
  results: { value: string; label: string }[]; // value like "70%" or "3x" — numbers count up
  stack: string[];
  cover?: string;          // 5–8s loop video, e.g. "/work/voice.mp4"
  image?: string;          // fallback cover image
  screens: (string | undefined)[];
  demo?: "voice";          // embeds the live voice demo in the case study
  sample: boolean;
}

export const WORKS: Work[] = [
  {
    slug: "voice-agent",
    title: "bail Voice",
    kind: "product",
    tags: ["products", "automate"],
    accent: "#22d3ee",
    result: "a receptionist that never misses a call.",
    problem:
      "Clinics and service businesses lose bookings every time a call goes unanswered — after hours, at lunch, or when the front desk is busy.",
    quote: "Every missed call is a customer who booked somewhere else.",
    built: ["answers and books in natural conversation", "full transcripts and call outcomes", "WhatsApp confirmations sent automatically"],
    results: [{ value: "70%", label: "fewer front-desk calls" }, { value: "24/7", label: "always picking up" }, { value: "3", label: "languages supported" }],
    stack: ["OpenAI Realtime", "Twilio", "WhatsApp API", "Next.js"],
    screens: [undefined, undefined, undefined],
    demo: "voice",
    sample: true,
  },
  {
    slug: "bail-hr",
    title: "bail HR",
    kind: "product",
    tags: ["products", "automate"],
    accent: "#ed821c",
    result: "people ops that run themselves.",
    problem: "Growing teams drown in onboarding checklists, leave requests and payroll spreadsheets.",
    quote: "HR shouldn't be a full-time job of chasing paperwork.",
    built: ["one-click onboarding flows", "leave & attendance with approvals", "payroll-ready exports"],
    results: [{ value: "8", label: "hours saved per hire" }, { value: "100%", label: "leave tracked digitally" }, { value: "2", label: "weeks to go live" }],
    stack: ["Next.js", "PostgreSQL", "OpenAI", "WhatsApp API"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
  {
    slug: "bail-inventory",
    title: "bail Inventory",
    kind: "product",
    tags: ["products", "automate", "analyse"],
    accent: "#34d399",
    result: "stock that reorders itself.",
    problem: "Stock-outs and over-ordering both cost money — and spreadsheets catch neither in time.",
    quote: "We found out we were out of stock when the customer told us.",
    built: ["live stock across locations", "demand-aware low-stock alerts", "auto-raised purchase orders"],
    results: [{ value: "40%", label: "fewer stock-outs" }, { value: "15%", label: "less dead stock" }, { value: "3", label: "warehouses synced" }],
    stack: ["Next.js", "PostgreSQL", "Tally", "Python"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
  {
    slug: "bail-referral",
    title: "bail Referral",
    kind: "product",
    tags: ["products", "grow"],
    accent: "#8b5cf6",
    result: "every referral, accounted for.",
    problem: "Referral partners send business, but nobody knows which referrals converted — or who to thank.",
    quote: "Our best partners felt ignored because we couldn't track them.",
    built: ["referral pipeline with live status", "automatic partner follow-ups", "partner leaderboard & payouts"],
    results: [{ value: "2x", label: "referral follow-up rate" }, { value: "128", label: "conversions tracked / month" }, { value: "0", label: "spreadsheets left" }],
    stack: ["Next.js", "PostgreSQL", "WhatsApp API", "Resend"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
  {
    slug: "whatsapp-order-bot",
    title: "WhatsApp ordering agent",
    kind: "client build",
    tags: ["automate", "grow"],
    accent: "#4ade80",
    result: "orders taken on WhatsApp, straight into the ERP.",
    problem: "A retail chain took hundreds of WhatsApp orders a day by hand, copying them into their ERP.",
    quote: "Our staff were typing orders all day instead of packing them.",
    built: ["conversational ordering on WhatsApp", "catalogue & stock lookup", "orders pushed to the ERP"],
    results: [{ value: "500", label: "orders / day automated" }, { value: "90%", label: "less manual entry" }, { value: "3", label: "weeks to launch" }],
    stack: ["WhatsApp API", "OpenAI", "Tally", "Node.js"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
  {
    slug: "clinic-automation",
    title: "clinic follow-up engine",
    kind: "client build",
    tags: ["automate"],
    accent: "#f472b6",
    result: "patients reminded, rebooked and reviewed — automatically.",
    problem: "A dental chain had no-shows eating into every day's schedule.",
    quote: "One no-show a day is a chair empty for a month a year.",
    built: ["reminder calls & messages", "one-tap rebooking", "post-visit review requests"],
    results: [{ value: "35%", label: "fewer no-shows" }, { value: "4", label: "clinics live" }, { value: "2x", label: "Google reviews" }],
    stack: ["OpenAI Realtime", "WhatsApp API", "Google Sheets"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
  {
    slug: "document-extraction",
    title: "invoice reading agent",
    kind: "client build",
    tags: ["automate"],
    accent: "#facc15",
    result: "invoices in, clean data out.",
    problem: "A logistics firm's accounts team keyed in thousands of supplier invoices every month.",
    quote: "Month-end used to mean a week of data entry.",
    built: ["reads PDFs, scans & photos", "validates against purchase orders", "exports to accounting"],
    results: [{ value: "95%", label: "fields extracted automatically" }, { value: "5", label: "days saved at month-end" }, { value: "3000", label: "invoices / month" }],
    stack: ["OpenAI", "Python", "Zoho Books"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
  {
    slug: "crm-lead-scoring",
    title: "CRM sync & lead scoring",
    kind: "client build",
    tags: ["grow", "analyse"],
    accent: "#60a5fa",
    result: "every lead scored, routed and followed up.",
    problem: "Leads arrived from forms, ads and calls into four different places — sales worked the wrong ones.",
    quote: "Our hottest leads were sitting in an inbox nobody checked.",
    built: ["one pipeline from every source", "AI lead scoring", "auto-routing to the right rep"],
    results: [{ value: "3x", label: "faster first response" }, { value: "4", label: "sources unified" }, { value: "22%", label: "higher close rate" }],
    stack: ["HubSpot", "OpenAI", "Slack", "Google Sheets"],
    screens: [undefined, undefined, undefined],
    sample: true,
  },
];

export const workBySlug = (slug: string) => WORKS.find((w) => w.slug === slug);
