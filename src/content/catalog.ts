// Brand
export const brand = {
  name: "Bits AI Lab",
  tagline: "Agents, Voice AI & Automation — built to grow your business.",
  email: "bitsailab.info@gmail.com",
  website: "bitsailab.com",
  calLink: "https://bitsailab.com",  // placeholder — used for "Book a call" CTAs
} as const;

// Hero section
export const hero = {
  eyebrow: "AI Agency",
  headline: "AI-Powered Services\nfor Growing Businesses",
  subheadline: "Intelligent automation · Sales growth · Workflow efficiency",
  cta: { label: "Book a discovery call", href: "/#contact" },
  ctaSecondary: { label: "See what we build", href: "/#services" },
} as const;

// Stats band
export const stats = [
  { value: "100%", label: "Client ownership of all code & infrastructure" },
  { value: "9",    label: "Productized services ready to deploy" },
  { value: "2 wks", label: "Typical time from scope to live system" },
  { value: "3×",   label: "Faster than building an equivalent in-house team" },
  { value: "24/7", label: "Always-on systems — no office hours, no downtime" },
  { value: "0",    label: "Vendor lock-in — switch tools anytime, you own everything" },
] as const;

// The 8 productized services in 2 pillars
export type Service = {
  id: number;
  title: string;
  hook: string;           // one-line selling headline
  problem: string;
  solution: string;
  whatWeBuild: string[];
  outcome: string;
};

export type Pillar = {
  id: string;
  label: string;
  tagline: string;
  services: Service[];
};

export const pillars: Pillar[] = [
  {
    id: "automate",
    label: "Automate",
    tagline: "Replace manual work with intelligent systems",
    services: [
      {
        id: 1,
        title: "AI Chatbots & Assistants",
        hook: "Handle 80% of customer enquiries automatically — 24/7",
        problem: "Your team spends hours answering the same questions while new leads wait.",
        solution: "Conversational AI on WhatsApp, your website, or Telegram — trained on your FAQs, products, and data.",
        whatWeBuild: ["Conversation flow design", "CRM lead capture", "Multi-platform integration", "Human escalation logic", "Analytics dashboard"],
        outcome: "Every lead captured, every FAQ answered instantly. Your team only handles the conversations that matter.",
      },
      {
        id: 2,
        title: "Voice AI Agents",
        hook: "Answer every call, book every appointment — even at 2am",
        problem: "Missed calls mean missed revenue. Manual call handling does not scale beyond office hours.",
        solution: "AI voice agent (ElevenLabs) + Indian virtual number (Exotel) that answers, qualifies, and books automatically.",
        whatWeBuild: ["Natural-speech voice agent", "Exotel virtual number", "Call flow scripting", "CRM call logging", "Outbound campaigns"],
        outcome: "24/7 inbound handling — every call answered, transcribed, and actioned before your team arrives.",
      },
      {
        id: 3,
        title: "Workflow Automation",
        hook: "Eliminate every repetitive manual task across your operation",
        problem: "Your team wastes hours on data transfers, approvals, and report generation that could run automatically.",
        solution: "n8n, Make, or Zapier workflows that connect your tools and eliminate manual steps end-to-end.",
        whatWeBuild: ["Workflow audit", "n8n / Make build", "Error handling + alerts", "Self-hosted n8n server", "Monthly optimisation"],
        outcome: "Your business logic runs without human touch. Errors surface instantly, not days later.",
      },
      {
        id: 4,
        title: "RAG Systems",
        hook: "Let your team find any answer in your documents — instantly",
        problem: "Critical knowledge is buried in PDFs, SOPs, and handbooks. Finding it takes hours — or never happens.",
        solution: "A private AI knowledge base trained on your documents that answers questions with source citations.",
        whatWeBuild: ["Document ingestion pipeline", "Vector database (Pinecone)", "LLM synthesis with citations", "Web / portal chat UI", "Auto-sync connector"],
        outcome: "Any team member gets accurate, cited answers from internal knowledge in seconds — not hours.",
      },
      {
        id: 5,
        title: "Custom AI Solution",
        hook: "A bespoke AI system engineered around your business — built to cut costs and multiply output",
        problem: "Off-the-shelf AI tools don't fit how your team operates. You're leaving efficiency gains on the table because nothing is built for your exact workflows.",
        solution: "We audit your entire operation end-to-end, identify the highest-impact AI opportunities, then design and build a custom system — from data pipelines to LLM integrations — tailored precisely to your needs.",
        whatWeBuild: ["Business process audit", "Custom AI architecture", "LLM fine-tuning & integration", "Workflow & API automation", "ROI measurement dashboard"],
        outcome: "A purpose-built AI system that compounds in value over time — reducing operational costs, eliminating bottlenecks, and multiplying team output.",
      },
    ],
  },
  {
    id: "grow",
    label: "Grow",
    tagline: "Fill your pipeline and scale your presence",
    services: [
      {
        id: 6,
        title: "Lead Generation & Qualification",
        hook: "Fill your pipeline with pre-qualified prospects — automatically",
        problem: "Your sales team spends 60% of their time on research and chasing leads that will never buy.",
        solution: "End-to-end outbound pipeline: ICP definition, Clay-enriched list build, AI-personalized outreach, BANT qualification.",
        whatWeBuild: ["ICP + enriched prospect list", "AI-personalized sequences", "CRM pipeline automation", "Inbound qualification bot", "Analytics dashboard"],
        outcome: "Pre-qualified meetings delivered to your calendar. Your team only has conversations that can close.",
      },
      {
        id: 7,
        title: "Sales Outreach Automation",
        hook: "Run a 24/7 outbound engine without hiring a single SDR",
        problem: "Manual cold outreach is inconsistent, lands in spam, and stops the moment your team is busy.",
        solution: "Fully managed multi-channel outreach: dedicated domains, AI-personalized email + LinkedIn + WhatsApp sequences.",
        whatWeBuild: ["Sending infrastructure + warm-up", "Multi-channel sequences", "AI-personalized copy", "CRM handoff + Slack alerts", "Weekly optimisation"],
        outcome: "Warm, pre-qualified conversations delivered to your team — with full context already in CRM.",
      },
      {
        id: 8,
        title: "WhatsApp & Chat Lead Nurturing",
        hook: "Respond to every inbound lead in 5 seconds — follow up for 14 days",
        problem: "Most leads go cold within 72 hours of ad click. Manual WhatsApp follow-up does not scale.",
        solution: "AI-powered WhatsApp bot that qualifies leads, runs a 14-day drip, and hands off hot prospects with full CRM context.",
        whatWeBuild: ["WhatsApp Business API setup", "Qualification flow", "14-day drip sequence", "CRM integration", "Broadcast campaigns"],
        outcome: "Every inbound lead nurtured automatically. Your team gets only the conversations worth having.",
      },
      {
        id: 9,
        title: "Social Media Content Automation",
        hook: "Publish daily content on every platform — without your team touching it",
        problem: "Consistent content creation consumes 15+ hours per week and breaks whenever the team gets busy.",
        solution: "AI content engine trained on your brand voice — generates, repurposes, schedules, and publishes daily.",
        whatWeBuild: ["Brand voice training", "AI content generation", "Repurposing pipeline", "Scheduling & auto-publish", "Weekly analytics report"],
        outcome: "Consistent, on-brand content across Instagram, LinkedIn, and YouTube — on autopilot.",
      },
    ],
  },
];

// Services available on request (not featured, mentioned at bottom)
export const onRequest = [
  "Business Intelligence & Dashboards",
  "Predictive Analytics",
  "SaaS / MVP Development",
  "AI Video & Avatars",
] as const;

// 3-step process
export const process = [
  {
    number: "01",
    title: "Discover",
    description: "We map your current workflows, identify the highest-ROI automation opportunities, and define the exact scope of what we'll build.",
  },
  {
    number: "02",
    title: "Build",
    description: "We build and test the system with your team reviewing at each milestone. No surprises, no black boxes. Clear handoffs throughout.",
  },
  {
    number: "03",
    title: "Deploy",
    description: "We go live, monitor the system, and iterate continuously. You own everything — code, models, infrastructure — from day one.",
  },
] as const;

// Why us (4 value props)
export const whyUs = [
  {
    title: "Fast delivery",
    description: "Working systems in weeks, not months. We scope precisely and move quickly from discovery to production.",
  },
  {
    title: "Production quality",
    description: "Every build includes error handling, retry policies, alerting, and monitoring. Not prototypes — production systems.",
  },
  {
    title: "Full AI stack",
    description: "Architecture, AI integration, automation, and deployment. We own the entire system so you don't manage vendors.",
  },
  {
    title: "Transparent process",
    description: "Clear milestones, no black boxes. You see exactly what's being built and when it goes live — at every stage.",
  },
] as const;

// Case study
export const caseStudy = {
  client: "Enterprise Finance Client",
  category: "Enterprise Finance · Manufacturing",
  headline: "33,000-row payroll files processed in under 5 seconds",
  challenge: "The client's finance team manually entered payroll and transaction data from large Excel files — a process prone to errors, consuming hours per reporting cycle, and blocking the team from higher-value analytical work.",
  solution: "We built a desktop AI system using Electron + React and Claude API for intelligent data parsing and GL variance explanation. Okta SSO handles enterprise authentication. Files are processed locally — data never leaves the client's machines. The system generates AI-powered variance explanations for every GL account and pushes clean data to the target system automatically.",
  outcomes: [
    "33,000-row files processed in under 5 seconds",
    "GL variance explanations auto-generated by AI",
    "Zero manual data entry errors",
    "Hours saved per monthly reporting cycle",
    "Enterprise Okta SSO — data never leaves client environment",
  ],
  metric: { value: "< 5s", label: "to process 33,000 rows" },
} as const;

// Tech stack
export type TechGroup = { category: string; tools: string[] };
export const techStack: TechGroup[] = [
  { category: "AI & LLMs",         tools: ["Anthropic Claude", "OpenAI GPT-4o", "LangChain", "LlamaIndex"] },
  { category: "Automation",        tools: ["n8n", "Make", "Zapier", "Electron"] },
  { category: "Voice",             tools: ["ElevenLabs", "Exotel", "Deepgram"] },
  { category: "Data & Storage",    tools: ["Pinecone", "Supabase", "PostgreSQL", "Redis"] },
  { category: "Cloud & Deploy",    tools: ["Vercel", "FastAPI", "Docker", "Railway"] },
  { category: "Messaging",         tools: ["WhatsApp Business API", "AiSensy", "Resend", "Twilio"] },
  { category: "CRM & ERP",         tools: ["Zoho", "HubSpot", "Tally", "SAP"] },
  { category: "Outreach",          tools: ["Clay", "Smartlead", "Apollo.io", "HeyReach"] },
];

// CTA section
export const cta = {
  headline: "Ready to build? Let's talk.",
  subheadline: "Start with a free 30-minute discovery call. We'll map your biggest automation opportunity and tell you exactly what we'd build — no commitment required.",
  steps: [
    "Book a discovery call at bitsailab.com",
    "We identify your highest-ROI automation opportunity",
    "Receive a scoped proposal within 48 hours",
  ],
  button: { label: "Book a free discovery call", href: "/#contact" },
} as const;

// Contact
export const contact = {
  email: "bitsailab.info@gmail.com",
  website: "bitsailab.com",
} as const;
