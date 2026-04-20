@AGENTS.md

# BAIL AI Agency — Claude Instructions

## What this project is

Frontend for **BAIL AI Agency**, an Indian AI agency offering 30 services across four categories: Automate, Grow, Analyse, Scale. Built with Next.js.

## Key files to know

- `src/app/price/pricingData.ts` — All 30 services with prices and feature lists. This is the source of truth for the pricing page.
- `src/app/price/PricingClient.tsx` — Pricing page UI. Has a three-way billing toggle: Standalone / Monthly retainer / Annual.
- `pricing.md` — Competitive pricing reference document. All prices are in INR for the Indian market (2026).
- `services/` — Internal build playbook. One folder per service, up to three markdown files per folder (starter.md, standard.md, premium.md) documenting how each tier is built and delivered.

## Pricing model — important to understand

Every service has three billing modes:
- **Standalone** — client pays once, we build and deliver, no ongoing commitment
- **Monthly retainer** — paid every month *after* the one-time setup, covers maintenance and support only (not a rebuild)
- **Annual** — one-time setup + 10 months retainer bundled = 2 months free

The `Tier` type in `pricingData.ts` has three separate feature arrays:
- `features` — what gets built (shown on Standalone tab)
- `monthlyFeatures` — what the retainer covers (shown on Monthly tab)
- `annualFeatures` — combined build + support summary (shown on Annual tab)

Only service #1 (AI Chatbots) has all three feature arrays filled in so far. Others fall back to `features` for all tabs until updated.

## Services directory structure

```
services/
├── 01-ai-chatbots-assistants/
│   └── starter.md    ← complete
├── 02-voice-ai-agents/
│   └── (empty — to be filled)
...
└── 30-ai-readiness-audits-consulting/
    └── (empty — to be filled)
```

When adding build documentation for a service, follow the pattern in `services/01-ai-chatbots-assistants/starter.md`: tech stack, step-by-step build, retainer operations, costs, and template/scaling approach.
