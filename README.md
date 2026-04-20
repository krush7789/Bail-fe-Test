# BAIL AI Agency — Frontend

Frontend for **BAIL AI Agency**, an Indian AI agency offering 30 services across four categories: Automate, Grow, Analyse, and Scale. Built with Next.js.

---

## Project Structure

```
bail-fe/
├── src/app/              — Next.js app router pages
│   ├── price/            — Pricing page
│   │   ├── page.tsx
│   │   ├── PricingClient.tsx   — UI with billing toggle (Standalone / Monthly / Annual)
│   │   └── pricingData.ts      — All 30 services with prices and feature lists
├── services/             — Internal build playbook (how each service is delivered)
│   ├── 01-ai-chatbots-assistants/
│   │   ├── starter.md    — How to build the Starter tier
│   │   ├── standard.md   — How to build the Standard tier (WIP)
│   │   └── premium.md    — How to build the Premium tier (WIP)
│   ├── 02-voice-ai-agents/
│   └── ... (30 folders total, one per service)
├── pricing.md            — Competitive pricing reference document (INR, India 2026)
└── public/               — Static assets
```

### The `/services` folder

Each of the 30 service folders contains up to three markdown files (`starter.md`, `standard.md`, `premium.md`) documenting the tech stack, build process, and retainer operations for that tier. This is the internal agency playbook — not customer-facing.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
