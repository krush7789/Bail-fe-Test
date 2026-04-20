# AI Chatbots & Assistants — Starter

**Price:** ₹19,999 one-time | ₹3,500/mo retainer | ₹54,999/yr bundled

---

## What this is

A rule-based button bot. No AI. The user taps a button, gets a pre-written response. Think of it as an interactive FAQ — fast to build, easy to maintain, and genuinely useful for small businesses that just need to stop answering the same 10 questions manually.

Delivered on **one platform only** — either WhatsApp OR website (client chooses).

---

## Tech Stack

- **Meta Cloud API** — WhatsApp messaging (free, direct from Meta, no BSP needed)
- **n8n** (self-hosted) — webhook receiver, flow logic, lead capture
- **Google Sheets** — lead storage (simple, client can see it themselves)
- **Custom JS widget** — for website option (built once, reused as template)
- **UptimeRobot** — free uptime monitoring for the retainer

No Claude API needed. No vector DB. No AI. Pure conditional logic in n8n.

---

## WhatsApp Build — Step by Step

### 1. Meta Cloud API Setup

1. Go to `developers.facebook.com` → create a new app → type: **Business**
2. Add the **WhatsApp** product to the app
3. For testing: use Meta's free sandbox number (can message up to 5 test numbers)
4. For production: add the client's phone number (must be fresh — not on any WhatsApp app), verify via OTP
5. Generate a **permanent access token** via System User in Meta Business settings
6. Submit for **Business Verification** (takes 1–7 days, required for production messaging)

**Important:** Set up the account under the **client's Meta Business account**, not yours. You get admin access to manage it. This protects the client if they ever leave.

### 2. n8n Webhook Setup

1. Create a new n8n workflow
2. Add a **Webhook** trigger node — this gives you a public URL
3. Meta will send a verification GET request first — n8n handles this automatically (set a verify token, add it in Meta dashboard)
4. All incoming WhatsApp messages will now POST to this webhook as JSON

### 3. How Buttons Work in WhatsApp

When your n8n sends an interactive message, this is what the user sees in their WhatsApp chat:

```
┌─────────────────────────────────┐
│  Hi! Welcome to XYZ Business.   │
│  What can I help you with?       │
│                                  │
│  ┌────────────────────────────┐  │
│  │        Know More           │  │
│  ├────────────────────────────┤  │
│  │        Get a Quote         │  │
│  ├────────────────────────────┤  │
│  │      Talk to Someone       │  │
│  └────────────────────────────┘  │
└─────────────────────────────────┘
```

The user taps a button — WhatsApp sends the button's ID back to your n8n webhook automatically. The button label also appears as the user's reply in the chat thread.

**Two button types available:**

- `type: "button"` — up to **3 buttons**, shown directly below the message. Use for main menu choices.
- `type: "list"` — a single "View Options" button that opens a scrollable list of up to **10 items**. Use when you have more than 3 options.

### 4. Sending a Button Message — the Exact API Call

This is an HTTP POST to Meta Cloud API. In n8n, this is an **HTTP Request** node.

**Endpoint:**
```
POST https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages
```

**Headers:**
```
Authorization: Bearer {YOUR_ACCESS_TOKEN}
Content-Type: application/json
```

**Body — 3-button message:**
```json
{
  "messaging_product": "whatsapp",
  "to": "91XXXXXXXXXX",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": {
      "text": "Hi! Welcome to XYZ. What can I help you with?"
    },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": { "id": "know_more", "title": "Know More" }
        },
        {
          "type": "reply",
          "reply": { "id": "get_quote", "title": "Get a Quote" }
        },
        {
          "type": "reply",
          "reply": { "id": "talk_to_someone", "title": "Talk to Someone" }
        }
      ]
    }
  }
}
```

**Body — list message (more than 3 options):**
```json
{
  "messaging_product": "whatsapp",
  "to": "91XXXXXXXXXX",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "body": { "text": "Choose what you need:" },
    "action": {
      "button": "View Options",
      "sections": [{
        "title": "Our Services",
        "rows": [
          { "id": "chatbot",     "title": "AI Chatbot" },
          { "id": "automation",  "title": "Automation" },
          { "id": "website",     "title": "Website" },
          { "id": "seo",         "title": "SEO" }
        ]
      }]
    }
  }
}
```

In n8n, the `to` field and `PHONE_NUMBER_ID` are pulled dynamically from the incoming webhook payload — you don't hardcode them.

### 5. What Comes Back When User Taps a Button

Meta sends this to your n8n webhook:

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "type": "interactive",
          "interactive": {
            "type": "button_reply",
            "button_reply": {
              "id": "get_quote",
              "title": "Get a Quote"
            }
          }
        }]
      }
    }]
  }]
}
```

In n8n, you extract `button_reply.id` — that's your switch condition. `get_quote` → start lead capture flow. `know_more` → send info message. And so on.

### 6. Handling Free Text (users who type instead of tapping)

You cannot disable the WhatsApp keyboard — users can always type. Handle it in n8n:

```
Incoming message
  ↓
Is message type "interactive"? (button tap)
  → YES → extract button ID → route to correct flow
  → NO  → send: "Please use the buttons below 👇"
           + re-send the same button message again
```

This trains users to use buttons. In practice, almost everyone taps. The fallback just handles the rare case.

### 7. Build the Flow Logic in n8n

Full flow structure:

```
Webhook trigger (incoming message from Meta)
  ↓
Extract: sender phone + message type
  ↓
IF type = "interactive" (button tap)
  ↓
Switch on button_reply.id:
  ├── "know_more"       → HTTP Request: send info text message
  ├── "get_quote"       → start lead capture (see below)
  ├── "our_services"    → HTTP Request: send list message with services
  └── "talk_to_someone" → HTTP Request: send contact number / Calendly link

ELSE (free text)
  └── HTTP Request: send "Please use the buttons 👇" + re-send button message
```

### 8. Lead Capture — What It Actually Means

Lead capture is collecting the user's contact details through a short back-and-forth conversation — one question at a time. It is **not** a form. The bot asks, the user replies in free text, n8n saves each answer.

**The flow:**

```
User taps "Get a Quote"
  ↓
Bot sends: "Great! What's your name?"
  ↓
User types: "Rahul Sharma"   ← free text, n8n saves to memory
  ↓
Bot sends: "Thanks Rahul! What's your phone number?"
  ↓
User types: "9876543210"     ← n8n saves
  ↓
Bot sends: "And your email address?"
  ↓
User types: "rahul@email.com" ← n8n saves
  ↓
n8n appends a new row to Google Sheets:
  [Rahul Sharma] [9876543210] [rahul@email.com] [timestamp] [source: get_quote]
  ↓
Bot sends: "Done! We'll reach out within 24 hours. 🙌"
  ↓
Bot sends the main menu buttons again
```

**How n8n tracks conversation state:**

Since each message is a separate webhook call, n8n needs to remember "this user is mid-lead-capture, waiting for their phone number." You handle this with n8n's **static data** or a simple **Google Sheets session row** that tracks where each user is in the flow (state: `awaiting_name` / `awaiting_phone` / `awaiting_email`).

**What goes into Google Sheets:**

| Name | Phone | Email | Source | Timestamp |
|---|---|---|---|---|
| Rahul Sharma | 9876543210 | rahul@email.com | get_quote | 2026-04-19 14:32 |

That sheet is shared with the client — they see their leads in real time without any extra tool.

---

## Website Build — Step by Step

### 1. The Widget

A small JS snippet the client pastes before `</body>`. It renders a chat bubble in the bottom-right corner. On open, shows a greeting + clickable buttons. There is **no text input field** — only buttons. The user cannot type anything.

Build this once as a template. Parameterize: brand color, greeting text, button labels, webhook URL. Swap per client.

### 2. n8n Flow for Website

Same conditional logic as WhatsApp but simpler — no Meta API involved. Widget sends a POST to the n8n webhook with the button ID → n8n switches → returns the response JSON → widget renders it.

Lead capture works the same way except: after the user clicks "Get a Quote", the widget switches into a simple **text input mode** (shows one input field at a time — name, then phone, then email). No free-text restriction needed since you control the widget UI entirely.

---

## Template Approach (how to scale this)

Build **one master n8n workflow** with:
- Placeholder nodes for responses (easy to swap text)
- Google Sheets lead capture already wired
- WhatsApp send message HTTP Request nodes pre-configured

For each new Starter client:
1. Duplicate the template workflow in n8n
2. Swap in their responses and button labels (25 max)
3. Connect their Meta phone number / webhook URL
4. Point lead capture to their own Google Sheet

**Time per new client after template is ready: under 2 hours.**

---

## Monthly Retainer — What You Actually Do (₹3,500/mo)

- **Uptime monitoring:** UptimeRobot watches the n8n webhook URL. You get an email if it goes down. Usually means your server needs a restart — 5 minutes to fix.
- **Flow edits:** Client says "change response X to say Y" → you update the n8n node text → done in 10 minutes. Up to 5 edits/month included.
- **API changes:** Meta occasionally updates their Cloud API (message format, new required fields). You update the HTTP Request node in n8n.
- **Monthly report:** A simple doc — messages handled, leads captured this month. Pull from Google Sheets + n8n execution logs.

Realistic time per client per month: **1–2 hours.**

---

## Costs to Run This (your side)

| Item | Cost |
|---|---|
| VPS (runs n8n for all clients) | ~₹1,500/mo shared |
| Meta Cloud API | Free up to 1,000 conversations/month |
| UptimeRobot | Free |
| Google Sheets | Free |
| n8n (self-hosted) | Free |

At ₹3,500/mo retainer with ~1–2 hours of actual work, margin is very high once the template is built.

---

## What to Build First

1. Set up your own VPS (DigitalOcean or Hetzner) with n8n installed
2. Connect your own test phone number to Meta Cloud API
3. Build the master template flow in n8n end-to-end — buttons, fallback, lead capture, Sheets
4. Test it yourself — send yourself WhatsApp messages, go through every flow, verify leads land in Sheets
5. That template is now your Starter product

First client takes a full day. Every client after that takes under 2 hours.
