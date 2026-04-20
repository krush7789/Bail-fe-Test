# AI Chatbots & Assistants — Standard

**Price:** ₹79,999 one-time | ₹10,000/mo retainer | ₹1,79,999/yr bundled

---

## What this is

A real AI-powered bot. The user types anything in natural language and the bot understands it — no buttons required. Built on Claude API, trained on the client's FAQs and company data, with automatic CRM lead capture and seamless human agent handoff via Chatwoot when the bot can't answer.

Delivered on **one platform** — WhatsApp OR Website OR Telegram (client chooses).

Key upgrades over Starter:
- Free text input — no button-only restriction
- Claude API — actual AI understanding, not conditional logic
- Conversation memory — bot remembers what was said earlier in the same chat
- CRM integration — leads go into Zoho or HubSpot, not Google Sheets
- Human handoff — Chatwoot routes to a live agent when needed

---

## Tech Stack

- **Meta Cloud API** — WhatsApp messaging
- **Telegram Bot API** — Telegram messaging
- **Custom JS widget** (with text input field) — website option
- **n8n** (self-hosted) — orchestration, webhook handling, flow logic
- **Claude API** (Anthropic, Haiku model) — AI understanding and response generation
- **PostgreSQL** — conversation history and status storage
- **Chatwoot** (self-hosted, Hostinger VPS) — human agent inbox and handoff
- **Zoho CRM / HubSpot** — lead capture
- **UptimeRobot** — uptime monitoring

Use **Claude Haiku** for this tier — it's fast, cheap (~₹800–2,000/mo for typical volume), and handles FAQ bots perfectly. Save Sonnet/Opus for Premium RAG.

---

## How Claude API Works Here

Every incoming message goes through this loop:

```
User sends a message (free text)
  ↓
n8n webhook receives it
  ↓
n8n checks PostgreSQL: is this user awaiting a human agent?
  → YES → do nothing (Chatwoot is handling it)
  → NO  → continue
  ↓
n8n fetches last 10 messages for this user from PostgreSQL
  ↓
n8n calls Claude API with:
  - System prompt (client's FAQ data, tone, rules)
  - Conversation history (last 10 messages as context)
  - User's current message
  ↓
Claude returns a response
  ↓
n8n checks: does response contain HANDOFF_REQUIRED?
  → YES → trigger Chatwoot handoff (see section 10)
  → NO  → check for LEAD_CAPTURED flag → send response to user
  ↓
n8n saves the exchange to PostgreSQL (append to history)
```

Claude never "forgets" what was said earlier in the conversation because you feed it the history on every call. The PostgreSQL table is the memory.

---

## The System Prompt — How to Build It

The system prompt is the client's entire knowledge base. This is what "training" means for Standard tier — no machine learning, just a well-structured prompt that Claude reads on every message.

### What goes into it

```
You are a helpful assistant for {{CLIENT_NAME}}, a {{BUSINESS_TYPE}} based in {{CITY}}.

ABOUT THE BUSINESS:
{{BUSINESS_DESCRIPTION}}

YOUR JOB:
- Answer customer questions accurately using only the information below
- Be friendly, concise, and professional
- Always respond in {{LANGUAGE}} (e.g., English, or mix of Hindi and English)
- Never make up information that is not in this prompt

KNOWLEDGE BASE:
Q: {{QUESTION_1}}
A: {{ANSWER_1}}

Q: {{QUESTION_2}}
A: {{ANSWER_2}}

... (up to 100 Q&A pairs)

LEAD DETECTION:
If the user is asking for pricing, a quote, a demo, or wants to buy — include the
exact text LEAD_CAPTURED on a new line at the end of your response.

HANDOFF RULE:
If you genuinely cannot answer the question from the knowledge base above,
respond with exactly: HANDOFF_REQUIRED
Do not guess. Do not make up answers. Trigger the handoff.
```

### How to collect the client's data

Run a **1–2 hour knowledge collection session** with the client:
1. Ask them to share their website, any existing FAQs, product/service brochures
2. Go through their top 30–50 customer questions (ask their sales/support team)
3. Ask about their tone — formal or casual? Hindi or English or both?
4. Ask about edge cases — what should the bot never say?

Format everything into the system prompt template above. Test it by sending 20–30 real customer questions through the bot and verifying the answers are correct. Adjust the prompt until HANDOFF triggers only when genuinely needed.

---

## Conversation History in PostgreSQL

Since every WhatsApp/Telegram/website message is a separate HTTP request, the bot has no memory by default. PostgreSQL solves this.

### Table schema

```sql
CREATE TABLE conversations (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL,        -- WhatsApp phone / Telegram chat_id / website session ID
  platform    TEXT NOT NULL,        -- 'whatsapp' | 'telegram' | 'website'
  messages    JSONB NOT NULL DEFAULT '[]', -- array of {role, content} objects
  status      TEXT NOT NULL DEFAULT 'bot', -- 'bot' | 'awaiting_agent' | 'resolved'
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
```

### How n8n uses it

**Before calling Claude:** n8n runs a PostgreSQL node:
```sql
SELECT messages FROM conversations
WHERE user_id = '{{user_id}}' AND platform = '{{platform}}'
ORDER BY updated_at DESC LIMIT 1;
```
Takes the last 10 items from the messages array and passes them to Claude as the conversation history.

**After Claude responds:** n8n appends the new exchange:
```sql
UPDATE conversations
SET messages = messages || '{{new_exchange}}'::jsonb,
    updated_at = NOW()
WHERE user_id = '{{user_id}}' AND platform = '{{platform}}';
```

The messages array holds objects in Claude's format:
```json
[
  { "role": "user",      "content": "What are your timings?" },
  { "role": "assistant", "content": "We are open 9am–7pm, Monday to Saturday." },
  { "role": "user",      "content": "Do you deliver to Pune?" }
]
```

---

## WhatsApp Build — Step by Step

### 1. Meta Cloud API Setup
Same as Starter — refer to `starter.md` Section 1. One addition for Standard: you no longer need to restrict to button-only messages. The bot now accepts and understands free text.

### 2. Incoming Text Message — What Meta Sends to n8n

When a user types a free-text message, Meta POSTs this to your webhook:

```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919876543210",
          "type": "text",
          "text": {
            "body": "What are your delivery charges?"
          },
          "timestamp": "1713600000"
        }],
        "metadata": {
          "phone_number_id": "YOUR_PHONE_NUMBER_ID"
        }
      }
    }]
  }]
}
```

In n8n, extract:
- `entry[0].changes[0].value.messages[0].from` → user's phone (your `user_id`)
- `entry[0].changes[0].value.messages[0].text.body` → the message text
- `entry[0].changes[0].value.metadata.phone_number_id` → needed to send the reply

### 3. Calling Claude API from n8n

In n8n, add an **HTTP Request** node:

**Endpoint:**
```
POST https://api.anthropic.com/v1/messages
```

**Headers:**
```
x-api-key: {{YOUR_CLAUDE_API_KEY}}
anthropic-version: 2023-06-01
Content-Type: application/json
```

**Body:**
```json
{
  "model": "claude-haiku-4-5",
  "max_tokens": 1024,
  "system": "{{SYSTEM_PROMPT}}",
  "messages": [
    { "role": "user", "content": "What are your delivery charges?" },
    { "role": "assistant", "content": "We offer free delivery above ₹500." },
    { "role": "user", "content": "{{CURRENT_USER_MESSAGE}}" }
  ]
}
```

The `messages` array is the conversation history pulled from PostgreSQL + the current message appended at the end.

**Claude's response:**
```json
{
  "content": [{
    "type": "text",
    "text": "Our delivery charges are ₹49 for orders below ₹500, and free above that."
  }]
}
```

Extract `content[0].text` — that's the reply to send back to the user.

### 4. Sending a Text Reply Back via Meta API

```
POST https://graph.facebook.com/v19.0/{{PHONE_NUMBER_ID}}/messages
```

```json
{
  "messaging_product": "whatsapp",
  "to": "919876543210",
  "type": "text",
  "text": {
    "body": "Our delivery charges are ₹49 for orders below ₹500, and free above that."
  }
}
```

### 5. Full n8n Flow for WhatsApp

```
Webhook trigger (Meta sends incoming message)
  ↓
Extract: user phone + message text + phone_number_id
  ↓
PostgreSQL: check status for this user
  ↓
IF status = 'awaiting_agent' → STOP (do nothing, Chatwoot handles it)
  ↓
PostgreSQL: fetch last 10 messages for this user
  ↓
HTTP Request: call Claude API (system prompt + history + message)
  ↓
Extract Claude's response text
  ↓
Does response contain 'HANDOFF_REQUIRED'?
  → YES → trigger Chatwoot handoff flow (section 10)
  ↓
Does response contain 'LEAD_CAPTURED'?
  → YES → call Zoho / HubSpot API (section 9)
  →       strip the flag from the response text before sending
  ↓
HTTP Request: send reply via Meta Cloud API
  ↓
PostgreSQL: append exchange to conversation history
```

---

## Telegram Build — Step by Step

### 1. Create the Bot — BotFather

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. Choose a name and username for the bot
4. BotFather gives you a **bot token** — save this, it's your API key

### 2. Set the Webhook

Tell Telegram to send all messages to your n8n webhook:

```
POST https://api.telegram.org/bot{{TOKEN}}/setWebhook
Content-Type: application/json

{
  "url": "https://your-n8n-server.com/webhook/telegram-{{CLIENT_ID}}"
}
```

Run this once. From now on every message to the bot POSTs to your n8n URL.

### 3. Incoming Message — What Telegram Sends to n8n

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 42,
    "from": {
      "id": 987654321,
      "first_name": "Rahul"
    },
    "chat": {
      "id": 987654321
    },
    "text": "What are your timings?"
  }
}
```

In n8n, extract:
- `message.chat.id` → your `user_id`
- `message.text` → the message text
- `message.from.first_name` → useful for personalised responses

### 4. Sending a Reply via Telegram API

```
POST https://api.telegram.org/bot{{TOKEN}}/sendMessage
Content-Type: application/json

{
  "chat_id": 987654321,
  "text": "We are open 9am–7pm, Monday to Saturday."
}
```

### 5. Buttons in Telegram (InlineKeyboardMarkup)

Equivalent of WhatsApp's interactive buttons — useful for the initial greeting menu:

```json
{
  "chat_id": 987654321,
  "text": "Hi! How can I help you?",
  "reply_markup": {
    "inline_keyboard": [
      [{ "text": "Know More",      "callback_data": "know_more" }],
      [{ "text": "Get a Quote",    "callback_data": "get_quote" }],
      [{ "text": "Talk to Someone","callback_data": "talk_to_someone" }]
    ]
  }
}
```

When user taps a button, Telegram sends a `callback_query` instead of a `message`. Extract `callback_query.data` to get `know_more`, `get_quote`, etc.

### 6. Chatwoot + Telegram

Chatwoot has a **native Telegram inbox**. In Chatwoot:
- Go to Settings → Inboxes → Add Inbox → Telegram
- Paste the bot token
- Chatwoot handles the Telegram API for the agent side automatically

When handoff is triggered, the agent replies inside Chatwoot and the message arrives in the user's Telegram chat. No extra code needed for this.

### 7. n8n Flow for Telegram

Identical logic to WhatsApp — the only differences are:
- Extract `message.chat.id` instead of `from` phone number
- Send reply via Telegram `sendMessage` instead of Meta Cloud API
- Handle `callback_query` for button taps in addition to `message` for text

---

## Website Build — Step by Step

### 1. The Widget

Unlike Starter (buttons only), Standard has a full chat interface with a text input field.

A JS snippet the client pastes before `</body>`:
- Renders a chat bubble in the bottom-right corner
- On open: shows greeting message + optional initial buttons
- Has a text input field — user types and presses Send
- Sends message as `POST` to your n8n webhook
- Renders Claude's response as a chat bubble

Build this once as a template. Parameterize: brand color, greeting text, webhook URL, client ID. Swap per client.

### 2. Widget → n8n Communication

Widget sends:
```json
POST https://your-n8n.com/webhook/website-{{CLIENT_ID}}

{
  "session_id": "abc123xyz",
  "message": "What are your pricing plans?"
}
```

Use `session_id` (generated in the browser, stored in localStorage) as the `user_id` for PostgreSQL. This persists the conversation across page reloads within the same browser session.

n8n responds:
```json
{
  "reply": "Our pricing starts at ₹999/month. Would you like to see the full breakdown?"
}
```

Widget renders the reply as a chat bubble.

### 3. Chatwoot Handoff for Website

Two options:

**Option A — Switch to Chatwoot live chat widget (simpler)**
When `HANDOFF_REQUIRED` is triggered, n8n responds with a special flag. The widget hides the custom chat UI and loads Chatwoot's own embeddable widget (`<script>` tag from Chatwoot settings). The agent then handles the conversation inside Chatwoot. Clean and no extra code needed on the backend.

**Option B — Keep custom widget, bridge via Chatwoot API (more seamless)**
Widget shows: "Connecting you to our team..." and disables the text input. n8n creates a conversation in Chatwoot via API (see section 10). Agent replies in Chatwoot → n8n webhook fires → n8n sends reply back to the widget via a polling endpoint or WebSocket. More complex to build but the user never sees a different UI.

**Recommendation:** Use Option A for your first Standard website client. Build Option B when you have the budget to invest in the custom widget properly.

---

## CRM Integration

Claude signals a lead intent using the `LEAD_CAPTURED` flag in its response. n8n detects this flag, strips it from the message before sending to the user, and simultaneously calls the CRM API.

### Zoho CRM

**Endpoint:**
```
POST https://www.zohoapis.in/crm/v2/Leads
```

**Auth:** OAuth 2.0. Set up once in Zoho Developer Console, store the access token + refresh token as an n8n credential. n8n handles token refresh automatically.

**Request body:**
```json
{
  "data": [{
    "Last_Name": "{{user_name}}",
    "Phone": "{{user_phone}}",
    "Email": "{{user_email}}",
    "Lead_Source": "Chatbot",
    "Description": "Enquired via {{platform}} bot. Last message: {{user_message}}"
  }]
}
```

If you don't have the user's name/email yet (they haven't given it), capture it first: after detecting `LEAD_CAPTURED`, bot asks "May I have your name and number so our team can follow up?" — then saves to Zoho once collected.

### HubSpot

**Endpoint:**
```
POST https://api.hubapi.com/crm/v3/objects/contacts
```

**Auth:** Private App API key — simpler than Zoho OAuth. Generate in HubSpot → Settings → Integrations → Private Apps. Store as n8n credential.

**Request body:**
```json
{
  "properties": {
    "firstname": "{{user_first_name}}",
    "lastname": "{{user_last_name}}",
    "phone": "{{user_phone}}",
    "email": "{{user_email}}",
    "hs_lead_status": "NEW",
    "message": "Enquired via {{platform}} bot: {{user_message}}"
  }
}
```

**Which to use:** Ask the client what CRM they already have. If neither, default to Zoho — it has a free tier for up to 3 users and is more common in the Indian SMB market.

---

## Human Agent Fallback — Chatwoot

### Setup

1. Hostinger VPS → pick Chatwoot template (one-click, pre-installed)
2. In Chatwoot: Settings → Inboxes → Add Inbox
   - For WhatsApp: add WhatsApp Cloud inbox (paste Meta credentials)
   - For Telegram: add Telegram inbox (paste bot token)
   - For Website: add Website inbox (get embed script)
3. Invite client's support agents as Chatwoot agents
4. Set up email notifications so agents get alerted on new conversations

### Handoff Flow — Step by Step

```
Claude returns HANDOFF_REQUIRED
  ↓
n8n: UPDATE conversations SET status = 'awaiting_agent'
  ↓
n8n: POST to Chatwoot API — create conversation with full history
  ↓
n8n: send message to user: "Let me connect you with our team.
      Someone will be with you shortly 🙏"
  ↓
Chatwoot notifies agents (email + browser push notification)
  ↓
Agent opens Chatwoot inbox, sees full conversation history
  ↓
Agent types reply → Chatwoot sends it via WhatsApp/Telegram/Website
  ↓
User receives reply in same chat — seamless, no platform change
  ↓
Agent clicks "Resolve" in Chatwoot
  ↓
Chatwoot fires a webhook to n8n
  ↓
n8n: UPDATE conversations SET status = 'bot'
  ↓
Bot resumes handling future messages from this user
```

### Chatwoot API — Create a Conversation

```
POST https://your-chatwoot.com/api/v1/accounts/{{ACCOUNT_ID}}/conversations
api_access_token: {{CHATWOOT_API_TOKEN}}
Content-Type: application/json

{
  "inbox_id": {{INBOX_ID}},
  "contact_id": {{CONTACT_ID}},
  "additional_attributes": {
    "user_id": "{{user_phone_or_chat_id}}",
    "platform": "whatsapp"
  }
}
```

After creating the conversation, send the message history as individual messages:

```
POST https://your-chatwoot.com/api/v1/accounts/{{ACCOUNT_ID}}/conversations/{{CONV_ID}}/messages

{
  "content": "{{message_text}}",
  "message_type": "incoming",
  "private": false
}
```

Run this for each message in the history so the agent has full context.

---

## Template Approach (scaling across clients)

Build **one master n8n workflow** with:
- All nodes in place (webhook, DB check, history fetch, Claude call, HANDOFF check, LEAD check, send response, DB update)
- System prompt as a variable (easy to swap per client)
- CRM node pre-built, just toggle Zoho vs HubSpot

**System prompt template file:** Keep a `system-prompt-template.txt` with all placeholders. For each client, fill it in and paste into the n8n workflow variable.

For each new Standard client:
1. Duplicate master n8n workflow
2. Run knowledge collection session with client (1–2 hours)
3. Fill system prompt template with their FAQs
4. Connect their platform (Meta / Telegram / website snippet)
5. Set up their Chatwoot inbox and agent accounts
6. Connect their CRM (Zoho or HubSpot)
7. Test end-to-end: 20 real questions, trigger HANDOFF, trigger LEAD_CAPTURED, do a full agent handoff and resolution

**Time per new Standard client after template is ready: 3–5 days** (mostly knowledge collection and testing, not building).

---

## Monthly Retainer — What You Actually Do (₹10,000/mo)

- **New intents:** Client says "add FAQ about our new product" → update system prompt, re-test → 30–60 minutes. Up to 10 new Q&A pairs/month included.
- **Claude cost monitoring:** Check Anthropic dashboard for per-client token usage. If a client's bot is being spammed or having very long conversations, usage spikes. Set a budget alert in Anthropic console.
- **CRM sync issues:** Occasionally Zoho OAuth tokens expire or HubSpot API keys get rotated. Troubleshoot and reconnect in n8n.
- **Chatwoot issues:** Agent not getting notifications, inbox disconnected from Meta, etc. Usually a 15-minute fix.
- **Monthly performance review:** Pull from Anthropic dashboard (total messages), Chatwoot (handoff rate, resolution time), CRM (leads this month). Share a simple summary with the client.
- **Platform API updates:** Meta and Telegram occasionally update their APIs. Monitor and update n8n HTTP Request nodes.

Realistic time per Standard client per month: **3–5 hours.**

---

## Costs to Run This (your side)

| Item | Cost |
|---|---|
| VPS — n8n + PostgreSQL + Chatwoot (shared) | ~₹2,500/mo |
| Claude Haiku API (~50k msgs/mo per client) | ~₹800–2,000/mo per client |
| Meta Cloud API | Free up to 1,000 conversations/mo |
| Telegram Bot API | Free |
| Zoho CRM | Free up to 3 users |
| HubSpot | Free tier |
| Chatwoot | Free (self-hosted) |
| UptimeRobot | Free |

At ₹10,000/mo retainer with ~3–5 hours of work and ~₹2,000–3,500 in costs (VPS share + Claude API), margin per Standard retainer client is strong.

---

## What to Build First

1. Extend your Starter VPS: install PostgreSQL alongside n8n, install Chatwoot using Hostinger template
2. Get a Claude API key from `console.anthropic.com`
3. Build the master n8n template workflow — all nodes wired, tested with a sample system prompt
4. Test WhatsApp end-to-end with your own number:
   - Normal conversation (Claude answers correctly)
   - Edge case (Claude triggers HANDOFF_REQUIRED → Chatwoot conversation created → you reply as agent → resolve → bot resumes)
   - Lead intent (Claude returns LEAD_CAPTURED → lead appears in Zoho/HubSpot)
5. Test Telegram with a personal bot token
6. Test website widget locally
7. That template stack = your Standard product

First Standard client takes 3–5 days. Every client after: duplicate + knowledge session + 3–5 days of testing.
