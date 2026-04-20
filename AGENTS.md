<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: BAIL AI Agency — Frontend

This is the frontend for **BAIL AI Agency**, an Indian AI agency offering 30 services across four categories: Automate, Grow, Analyse, Scale.

## Services Directory (`/services`)

The `/services` folder documents **how each service is built and delivered**. It is the internal build playbook for the agency — not customer-facing content.

### Structure

```
services/
├── 01-ai-chatbots-assistants/
│   ├── starter.md      ← how to build the Starter tier
│   ├── standard.md     ← how to build the Standard tier
│   └── premium.md      ← how to build the Premium tier
├── 02-voice-ai-agents/
│   └── ...
...
└── 30-ai-readiness-audits-consulting/
    └── ...
```

Each folder maps to a service in `src/app/price/pricingData.ts` (numbered in the same order). Each tier file covers: what the tier includes, the tech stack, step-by-step build process, and how the monthly retainer works operationally.

### Services List

| # | Folder | Service |
|---|---|---|
| 1 | `01-ai-chatbots-assistants` | AI Chatbots & Assistants (WhatsApp, Website, Telegram) |
| 2 | `02-voice-ai-agents` | Voice AI Agents (Calls, IVR, Appointment Booking) |
| 3 | `03-business-process-automation` | Business Process Automation |
| 4 | `04-document-invoice-processing` | Document & Invoice Processing (OCR, Data Extraction) |
| 5 | `05-rpa-legacy-systems` | RPA — Automating Legacy Systems |
| 6 | `06-api-tool-integrations` | API & Tool Integrations (Zoho, Tally, SAP, ERPs) |
| 7 | `07-workflow-automation` | Workflow Automation (n8n, Make, Zapier) |
| 8 | `08-hr-automation` | HR Automation (Screening, Onboarding, Payroll Bots) |
| 9 | `09-rag-systems` | RAG Systems (Internal Knowledge Base Q&A) |
| 10 | `10-website-design-development` | Website Design & Development |
| 11 | `11-seo` | SEO (Local, Technical, On-Page) |
| 12 | `12-social-media-management` | Social Media Management |
| 13 | `13-performance-marketing` | Performance Marketing (Google, Meta, LinkedIn Ads) |
| 14 | `14-whatsapp-business-automation` | WhatsApp Business Automation |
| 15 | `15-email-marketing-automation` | Email Marketing Automation |
| 16 | `16-lead-generation-outreach` | Lead Generation & Outreach Automation |
| 17 | `17-ai-generated-content` | AI-Generated Content (Blogs, Ads, Product Copy) |
| 18 | `18-crm-setup-automation` | CRM Setup & Automation |
| 19 | `19-business-intelligence-dashboards` | Business Intelligence Dashboards |
| 20 | `20-data-scraping-market-research` | Data Scraping & Market Research |
| 21 | `21-sentiment-brand-monitoring` | Sentiment & Brand Monitoring |
| 22 | `22-predictive-analytics` | Predictive Analytics (Sales, Churn, Demand) |
| 23 | `23-multilingual-nlp` | Multilingual NLP (Hindi, Tamil, Telugu & Other Indian Languages) |
| 24 | `24-saas-mvp-development` | SaaS & MVP Development (White-Label AI Products) |
| 25 | `25-ai-video-generation` | AI Video Generation (Ads, Explainers, Demos) |
| 26 | `26-ai-avatar-digital-spokesperson` | AI Avatar & Digital Spokesperson |
| 27 | `27-ai-powered-recruitment` | AI-Powered Recruitment Tools |
| 28 | `28-personalized-learning-platforms` | Personalized Learning Path Platforms |
| 29 | `29-corporate-ai-training` | Corporate AI Training & Workshops |
| 30 | `30-ai-readiness-audits-consulting` | AI Readiness Audits & Consulting |

## Pricing Data (`src/app/price/pricingData.ts`)

All 30 services with three billing modes per tier:
- **Standalone (`oneTime`)** — one-time build and delivery, no ongoing commitment
- **Monthly (`monthly`)** — retainer paid after the one-time setup, covers maintenance and support
- **Annual (`annual`)** — one-time setup + 10 months retainer bundled (2 months free)

Each tier also has separate feature lists per billing mode (`features`, `monthlyFeatures`, `annualFeatures`) so the pricing page shows the right description for what the client is actually buying.
