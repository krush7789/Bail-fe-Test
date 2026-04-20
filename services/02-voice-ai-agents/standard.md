# Voice AI Agents — Standard

**Price:** ₹2,49,999 one-time | ₹22,000/mo retainer | ₹4,69,999/yr bundled

---

## What this is

Same ElevenLabs + Exotel foundation as Starter, but meaningfully more capable. The agent handles 10 call flows instead of 2, initiates outbound calls (not just receives them), routes escalations to the right team based on intent, briefs that team via WhatsApp before they pick up, and logs structured CRM data after every call.

The caller still experiences a natural, human-quality voice conversation. The upgrade is in what happens around that conversation — the routing, the logging, the follow-through.

**Standard covers:**
- **10 call flows** (inbound + outbound)
- **Both Hindi + English** — language detected per call
- **Smart escalation** — routes to the right team number based on intent, briefs them via WhatsApp before transfer
- **CRM integration** — Zoho or HubSpot, structured data logged after every call
- **AI-generated call summary** — Claude Haiku condenses the transcript to 2 sentences, goes into CRM
- **Outbound calling** — scheduled reminders, follow-ups, payment nudges
- **PostgreSQL** — replaces Google Sheets, queryable call history for CRM sync and reporting

---

## How This Actually Works — Full Picture

```
INBOUND FLOW:
Caller dials Exotel ExoPhone
  ↓
Exotel receives the call
  ↓
Exotel opens WebSocket to ElevenLabs (real-time audio stream)
  ↓
ElevenLabs: speech-to-text → language detection → LLM → text-to-speech
  ↓
Caller hears AI voice — sub-second latency, natural conversation
  ↓
Mid-call: agent invokes a tool (ESCALATE:sales / BOOK_APPOINTMENT / etc.)
  ↓
ElevenLabs fires real-time tool webhook to n8n while agent keeps speaking
  ↓
n8n routes: transfers call OR logs booking OR queries CRM
  ↓
After call ends: ElevenLabs fires post-call webhook with full transcript
  ↓
n8n: sends transcript to Claude Haiku → gets 2-sentence summary
n8n: logs to PostgreSQL
n8n: pushes structured record to Zoho / HubSpot

OUTBOUND FLOW:
n8n scheduled workflow triggers (time-based or event-based)
  ↓
n8n calls Exotel outbound call API with customer number
  ↓
Exotel dials the customer, connects to ElevenLabs agent on pickup
  ↓
Agent delivers the reminder / follow-up conversation
  ↓
Post-call webhook → same logging flow as inbound
```

---

## Tech Stack

| Tool | Role |
|---|---|
| **Exotel** | Indian virtual phone numbers (ExoPhones), inbound + outbound telephony |
| **ElevenLabs Conversational AI** | Voice agent — speech recognition, LLM reasoning, voice synthesis, tools |
| **n8n** (self-hosted) | Orchestration — receives tool webhooks mid-call, post-call webhooks, triggers transfers, CRM sync |
| **PostgreSQL** | Call log database — queryable history, CRM sync state, outbound campaign tracking |
| **Claude Haiku** | Post-call transcript summarisation (fast, cheap, accurate for this task) |
| **Zoho CRM / HubSpot** | Lead and contact CRM — structured call outcomes pushed after every call |
| **Meta Cloud API** | WhatsApp — pre-transfer briefing messages to agents |
| **UptimeRobot** | Uptime monitoring |

---

## The 10 Call Flows — What They Cover

A call flow is one complete conversation scenario the agent knows how to handle end-to-end. The client defines their 10 during a 2-hour onboarding session. Standard typical setup for a B2B or service business:

| # | Flow | Direction | Trigger |
|---|---|---|---|
| 1 | General enquiry (services, hours, location) | Inbound | Caller asks open questions |
| 2 | Appointment booking | Inbound | Caller wants to schedule |
| 3 | Quote / pricing request | Inbound | Caller asks about cost |
| 4 | Existing customer support | Inbound | Caller has an issue |
| 5 | Complaint handling | Inbound | Caller is unhappy |
| 6 | Billing / payment query | Inbound | Caller asks about invoice |
| 7 | Speak to a person / manager | Inbound | Caller wants human |
| 8 | Appointment reminder | Outbound | Scheduled 24h before appointment |
| 9 | Lead follow-up | Outbound | Triggered after form submission or enquiry |
| 10 | Payment reminder | Outbound | Triggered on overdue invoice |

Flows 1–7 are inbound. Flows 8–10 are outbound (n8n triggers them on a schedule or event).

---

## Exotel Setup — Step by Step

### 1. Account and Numbers

1. Create the Exotel account under the **client's details** (not yours) — you get admin access
2. Buy an ExoPhone (Indian virtual number) — ideally in the client's city
3. For outbound campaigns: verify the client's company name with Exotel for DLT registration (required for outbound calls in India under TRAI regulations)

### 2. Connect Exotel to ElevenLabs (Inbound)

1. In ElevenLabs → Agents → your agent → Integrations → Exotel
2. ElevenLabs generates a **WebSocket URL** for this agent
3. In Exotel dashboard → your ExoPhone → App Settings → Incoming Calls → set to WebSocket → paste the ElevenLabs WebSocket URL
4. Test: call the ExoPhone, verify ElevenLabs answers

### 3. Configure Outbound App (for Flows 8–10)

Exotel uses "ExoML Apps" to define what happens when a call connects. For outbound:

1. In Exotel dashboard → Apps → Create App
2. Set the app to connect the answered call to your ElevenLabs WebSocket URL
3. Note the App ID — n8n uses this when triggering outbound calls

### 4. Outbound Call API (called from n8n)

```
POST https://api.exotel.com/v1/Accounts/{{ACCOUNT_SID}}/Calls/connect
Auth: Basic (API key : API token)
Content-Type: application/x-www-form-urlencoded

From: {{EXOPHONE}}
To: {{CUSTOMER_MOBILE}}
CallerId: {{EXOPHONE}}
Url: http://my.exotel.com/exoml/start/{{OUTBOUND_APP_ID}}
StatusCallback: {{N8N_WEBHOOK_URL}}/exotel-status
```

`StatusCallback` tells Exotel to POST call status updates (initiated, ringing, answered, completed) to n8n so you can track whether the customer picked up.

---

## ElevenLabs Agent Setup

### 1. Create the Agent

1. ElevenLabs → Agents → Create New Agent
2. **Voice:** Choose a natural Hindi+English bilingual voice. ElevenLabs has voices that handle code-switching (mixing Hindi and English mid-sentence). Pick one and test it manually.
3. **LLM:** Use Claude Haiku or GPT-4o mini via ElevenLabs' LLM settings — faster and cheaper than the default for Standard tier volume.
4. **First message (inbound):** *"Hello, thank you for calling [Business Name]. How can I help you today?"*
5. **First message (outbound — appointment reminder):** *"Hello, am I speaking with [Customer Name]? I'm calling from [Business Name] to confirm your appointment tomorrow at [Time]."*

### 2. Configure Tools (Mid-Call Function Calling)

Tools are what make Standard different from Starter. Each tool is a webhook that fires mid-call when the agent invokes it.

In ElevenLabs agent settings → Tools → Add Tool for each of these:

**Tool: ESCALATE_SALES**
- Trigger: agent detects sales intent
- Mode: Post-Tool Speech (agent speaks "Connecting you with our sales team" → tool fires)
- Webhook URL: `{{N8N_URL}}/escalate`
- Parameters sent: `{ "type": "sales", "caller_number": "...", "summary": "..." }`

**Tool: ESCALATE_SUPPORT**
- Same config, type: "support"

**Tool: ESCALATE_BILLING**
- Same config, type: "billing"

**Tool: ESCALATE_MANAGER**
- Same config, type: "manager"

**Tool: BOOK_APPOINTMENT**
- Trigger: agent completes appointment booking flow
- Mode: Post-Tool Speech
- Parameters: `{ "name": "...", "date_time": "...", "phone": "..." }`

**Tool: LOG_QUOTE_REQUEST**
- Trigger: caller requests a quote
- Parameters: `{ "service_interest": "...", "budget_mentioned": "...", "phone": "..." }`

For each tool: enable **"Wait for response"** so the agent can use the return value (e.g., "Transfer initiated" or "Booking confirmed") to inform what it says next.

**Important:** Verify the exact webhook payload field names from ElevenLabs' server tools documentation or their `elevenlabs-js` GitHub SDK before building — the research confirmed the feature exists but payload field names should be confirmed against their current docs.

### 3. Post-Call Webhook

ElevenLabs → Agent Settings → Post-Call Webhook → set to `{{N8N_URL}}/post-call`

This fires after every call with: full transcript, call duration, conversation ID, which tools were invoked.

---

## System Prompt — Standard Voice (Template)

```
You are a professional voice assistant for {{CLIENT_NAME}}, a {{BUSINESS_TYPE}}.

LANGUAGE:
Detect the caller's language from their first sentence.
If they speak Hindi → respond in Hindi throughout.
If they speak English → respond in English throughout.
If they mix (Hinglish) → match their mix naturally.
Never switch language mid-response unless the caller switches first.

YOUR STYLE:
Warm and professional. Short sentences — maximum 2-3 per response.
Never read out lists. Convert everything to natural speech.
If you don't understand something, ask the caller to repeat once.

WHAT YOU KNOW:
{{Business hours — natural sentence form}}
{{Location and directions}}
{{Services offered — described conversationally}}
{{Pricing — ranges or starting prices}}
{{Key team members and departments}}

CALL FLOW 1 — General Enquiry:
Caller asks about services, hours, location, pricing.
Answer from knowledge above. Keep each answer under 2 sentences.
After answering: "Is there anything else I can help you with?"
If resolved: "Thank you for calling [Business Name]. Have a great day!"

CALL FLOW 2 — Appointment Booking:
Caller wants to schedule something.
Step 1: "Of course! Could I get your name please?"
Step 2: "Thanks [name]. What date and time works best for you?"
Step 3: "And the best number to confirm on?"
Step 4: "Perfect. I've noted that down. You'll get a confirmation within 2 hours."
→ Trigger tool: BOOK_APPOINTMENT

CALL FLOW 3 — Quote / Pricing:
Caller asks about cost for a specific service.
Give the starting price or range if known.
Then: "Would you like our team to give you an exact quote? I can log your details."
Collect: name, service interest, rough budget if willing to share, phone.
→ Trigger tool: LOG_QUOTE_REQUEST

CALL FLOW 4 — Existing Customer Support:
Caller has an issue with an existing service or order.
Acknowledge their issue warmly: "I'm sorry to hear that. Let me get this sorted for you."
Collect: name, order/account reference if they have it.
→ Trigger tool: ESCALATE_SUPPORT

CALL FLOW 5 — Complaint:
Caller is frustrated or unhappy.
Do NOT get defensive. Say: "I completely understand, and I'm sorry you've had this experience."
Do not try to resolve — escalate immediately.
"Let me connect you with our senior support team right away."
→ Trigger tool: ESCALATE_SUPPORT

CALL FLOW 6 — Billing / Payment Query:
Caller asks about an invoice, payment, or refund.
Do NOT discuss amounts or make commitments.
"Our accounts team handles this directly. Let me connect you."
→ Trigger tool: ESCALATE_BILLING

CALL FLOW 7 — Speak to a Person / Manager:
Caller explicitly asks to speak to a human or manager.
"Of course, let me connect you right away."
→ Trigger tool: ESCALATE_MANAGER

ESCALATION RULE — Everything Else:
If the caller asks something outside the flows above and you cannot answer from your knowledge:
"That's a great question. Let me connect you with our team who can help better."
→ Trigger tool: ESCALATE_SALES (default fallback)

HARD RULES:
- Never make up information. If unsure, escalate.
- Never ask more than one question per turn.
- Never mention you are an AI unless the caller directly asks.
- If caller asks "are you a bot?" — respond: "I'm a voice assistant for [Business Name].
  Is there something I can help you with today?"
- If caller is silent for 5 seconds: "Hello, are you still there?"
- Keep every response under 3 sentences.
```

---

## Smart Escalation — Full Architecture

This is the core Standard differentiator. When the agent invokes an escalation tool:

### Step 1 — ElevenLabs fires mid-call tool webhook

Post-Tool Speech Mode means: agent speaks the transfer phrase ("Connecting you with our sales team now") → *while the agent is speaking*, ElevenLabs fires the tool webhook to n8n.

The caller hears the agent's voice during the 1.5–2s it takes for n8n and Exotel to process. No perceived gap.

### Step 2 — n8n receives the tool webhook

```
n8n Webhook: POST /escalate

Payload:
{
  "type": "sales",              // which escalation trigger
  "caller_number": "9876543210",
  "summary": "Interested in enterprise pricing for 50 seats",
  "conversation_id": "conv_xxx"
}
```

n8n extracts the type → looks up the correct transfer number from its config:

```
sales    → +91-XXXXX (sales lead's mobile)
support  → +91-YYYYY (support team number)
billing  → +91-ZZZZZ (accounts manager)
manager  → +91-AAAAA (operations head)
```

### Step 3 — n8n fires two things simultaneously

**3a — WhatsApp pre-transfer briefing (Meta Cloud API):**

```
POST https://graph.facebook.com/v19.0/{{PHONE_NUMBER_ID}}/messages
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "messaging_product": "whatsapp",
  "to": "91XXXXX",
  "type": "text",
  "text": {
    "body": "Transfer incoming 📞\nCaller: 9876543210\nReason: Sales enquiry — enterprise pricing for 50 seats\nConnecting now."
  }
}
```

This fires to the agent's WhatsApp number. They see it before their phone rings.

**3b — Exotel call transfer:**

```
POST https://api.exotel.com/v1/Accounts/{{ACCOUNT_SID}}/Calls/connect
Auth: Basic (API key : API token)
Content-Type: application/x-www-form-urlencoded

From: {{EXOPHONE}}
To: {{SALES_TEAM_NUMBER}}
CallerId: {{EXOPHONE}}
Url: http://my.exotel.com/exoml/start/{{TRANSFER_APPLET_ID}}
StatusCallback: {{N8N_URL}}/transfer-status
```

Exotel connects the active caller to the sales team number. Client's phone rings — they see the WhatsApp, pick up knowing exactly who's calling and why.

### Step 4 — If nobody picks up

Exotel `StatusCallback` fires to n8n with status `no-answer`.

n8n:
1. Plays Exotel fallback audio: *"Our team is temporarily unavailable. We'll call you back within 30 minutes."* (pre-recorded file uploaded to Exotel)
2. Logs the missed transfer to PostgreSQL: caller number, type, timestamp, "missed"
3. Sends a WhatsApp alert to the whole team channel: *"Missed transfer — SALES — 9876543210 — called at 3:14pm. Needs callback."*
4. Schedules an outbound callback: n8n waits 30 minutes → triggers Exotel outbound call API → ElevenLabs agent calls the customer back

---

## Outbound Calling — How It Works

n8n triggers outbound calls based on two sources:

**Schedule-based (appointment reminders, payment reminders):**
n8n polls PostgreSQL every hour for appointments in the next 24 hours → fires outbound call for each.

**Event-based (lead follow-up):**
CRM webhook fires when a new lead is created → n8n waits 1 hour → fires outbound call.

**Outbound call sequence:**

```
n8n calls Exotel outbound API with customer number
  ↓
Exotel dials the customer
  ↓
Customer picks up → Exotel connects to ElevenLabs outbound agent
  ↓
Agent delivers the scripted outbound flow (reminder / follow-up)
  ↓
Customer responds — agent handles naturally
  ↓
Post-call webhook → logged to PostgreSQL + CRM
```

**If customer doesn't pick up:**
StatusCallback fires `no-answer` → n8n retries once after 2 hours → logs final status.

**Outbound system prompt (separate from inbound):**
Outbound prompts are shorter and more direct — the agent has one job per call. Example for appointment reminder:

```
You are calling on behalf of {{CLIENT_NAME}} to confirm an upcoming appointment.

First message: "Hello, am I speaking with {{CUSTOMER_NAME}}?
I'm calling from [Business Name] to confirm your appointment tomorrow,
{{DATE}} at {{TIME}}. Does that still work for you?"

If YES: "Perfect! We'll see you then. Have a great day!"
→ Trigger: APPOINTMENT_CONFIRMED

If NO / needs to reschedule: "No problem! What time works better for you?"
Collect new time → confirm.
→ Trigger: APPOINTMENT_RESCHEDULED

If no answer after 2 sentences: "It seems this may not be a good time.
We'll try reaching you again shortly. Thank you!"
→ End call
```

---

## CRM Integration — Zoho and HubSpot

After every call, n8n pushes a structured record. The post-call webhook from ElevenLabs triggers this flow.

### Zoho CRM

**Find or create contact:**
```
GET https://www.zohoapis.in/crm/v3/Contacts/search?criteria=Phone:equals:{{CALLER_NUMBER}}
Authorization: Zoho-oauthtoken {{ACCESS_TOKEN}}
```

If contact exists → update. If not → create new:

```
POST https://www.zohoapis.in/crm/v3/Contacts
Authorization: Zoho-oauthtoken {{ACCESS_TOKEN}}
Content-Type: application/json

{
  "data": [{
    "Last_Name": "{{NAME_FROM_CALL}}",
    "Phone": "{{CALLER_NUMBER}}",
    "Lead_Source": "Voice AI Agent",
    "Description": "{{AI_GENERATED_SUMMARY}}"
  }]
}
```

**Log call activity:**
```
POST https://www.zohoapis.in/crm/v3/Activities__Calls
{
  "data": [{
    "Subject": "Inbound call — {{INTENT_TYPE}}",
    "Who_Id": "{{CONTACT_ID}}",
    "Duration_Min": "{{CALL_DURATION_MINUTES}}",
    "Description": "{{AI_GENERATED_SUMMARY}}",
    "Call_Result": "{{OUTCOME}}",
    "Call_Type": "Inbound"
  }]
}
```

OAuth tokens refresh automatically — n8n stores refresh token in credentials, exchanges for access token before each API call.

### HubSpot

**Find or create contact:**
```
POST https://api.hubapi.com/crm/v3/objects/contacts/search
Authorization: Bearer {{PRIVATE_APP_TOKEN}}
Content-Type: application/json

{
  "filterGroups": [{
    "filters": [{
      "propertyName": "phone",
      "operator": "EQ",
      "value": "{{CALLER_NUMBER}}"
    }]
  }]
}
```

**Log engagement (call):**
```
POST https://api.hubapi.com/crm/v3/objects/calls
Authorization: Bearer {{PRIVATE_APP_TOKEN}}
Content-Type: application/json

{
  "properties": {
    "hs_call_direction": "INBOUND",
    "hs_call_duration": "{{DURATION_MS}}",
    "hs_call_status": "COMPLETED",
    "hs_call_body": "{{AI_GENERATED_SUMMARY}}",
    "hs_timestamp": "{{EPOCH_MS}}"
  }
}
```

Then associate the call engagement with the contact ID.

---

## AI-Generated Call Summary (Claude Haiku)

ElevenLabs post-call webhook gives the full transcript. Claude Haiku condenses it:

**n8n HTTP Request node — Claude API:**
```
POST https://api.anthropic.com/v1/messages
x-api-key: {{CLAUDE_API_KEY}}
anthropic-version: 2023-06-01
Content-Type: application/json

{
  "model": "claude-haiku-4-5",
  "max_tokens": 100,
  "messages": [{
    "role": "user",
    "content": "Summarise this call transcript in 2 sentences. Be factual and specific. Include: the caller's main need, what was resolved or promised, and any next action.\n\nTranscript:\n{{TRANSCRIPT}}"
  }]
}
```

Response: a 2-sentence summary that goes into PostgreSQL and into the CRM call log. Costs fractions of a rupee per call.

---

## PostgreSQL Schema

```sql
CREATE TABLE calls (
  id              SERIAL PRIMARY KEY,
  conversation_id TEXT UNIQUE,
  caller_number   TEXT,
  direction       TEXT,              -- 'inbound' | 'outbound'
  duration_sec    INTEGER,
  language        TEXT,              -- 'hindi' | 'english' | 'hinglish'
  tools_triggered TEXT[],            -- e.g. ['ESCALATE_SALES', 'BOOK_APPOINTMENT']
  escalation_type TEXT,              -- 'sales' | 'support' | 'billing' | 'manager' | null
  transfer_status TEXT,              -- 'answered' | 'missed' | null
  transcript      TEXT,
  summary         TEXT,              -- Claude Haiku output
  crm_contact_id  TEXT,              -- Zoho / HubSpot contact ID after sync
  crm_synced      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appointments (
  id              SERIAL PRIMARY KEY,
  call_id         INTEGER REFERENCES calls(id),
  customer_name   TEXT,
  preferred_time  TEXT,
  phone           TEXT,
  status          TEXT DEFAULT 'pending',  -- 'pending' | 'confirmed' | 'rescheduled'
  reminder_sent   BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE outbound_queue (
  id              SERIAL PRIMARY KEY,
  customer_number TEXT,
  flow_type       TEXT,              -- 'reminder' | 'follow_up' | 'payment'
  scheduled_at    TIMESTAMPTZ,
  attempted_at    TIMESTAMPTZ,
  status          TEXT DEFAULT 'pending',  -- 'pending' | 'answered' | 'no_answer' | 'completed'
  retries         INTEGER DEFAULT 0,
  payload         JSONB,             -- any extra data the outbound agent needs
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## n8n Webhook Flows

### Flow 1 — Mid-Call Tool Webhook (`POST /escalate`)

```
Receive tool webhook from ElevenLabs
  ↓
Extract: type, caller_number, summary, conversation_id
  ↓
Lookup transfer number from config (Switch node on type)
  ↓
HTTP Request (parallel):
  ├── Meta Cloud API → WhatsApp briefing to agent
  └── Exotel connect API → live call transfer
  ↓
Wait for Exotel StatusCallback
  ↓
IF answered → log transfer_status: 'answered' to PostgreSQL
IF no-answer →
  ├── Exotel plays fallback audio
  ├── WhatsApp alert to team group
  └── Insert row to outbound_queue (retry in 30 min)
  ↓
Return { "status": "transfer_initiated" } to ElevenLabs tool
```

### Flow 2 — Post-Call Webhook (`POST /post-call`)

```
Receive post-call webhook from ElevenLabs
  ↓
Extract: conversation_id, transcript, duration, tools_triggered, caller_number
  ↓
Claude Haiku API call → get 2-sentence summary
  ↓
Insert row to calls table (PostgreSQL)
  ↓
IF BOOK_APPOINTMENT in tools_triggered:
  └── Insert row to appointments table
  ↓
IF tools_triggered contains any ESCALATE_*:
  └── Update escalation_type in calls row
  ↓
CRM sync:
  ├── Search for existing contact by phone number
  ├── Create contact if not found
  └── Log call activity with summary
  ↓
Mark crm_synced: true in calls row
```

### Flow 3 — Outbound Campaign Worker (scheduled every 30 min)

```
n8n Cron trigger (every 30 min)
  ↓
SELECT from outbound_queue WHERE status = 'pending'
  AND scheduled_at <= NOW()
  AND retries < 2
  ↓
For each row:
  ├── Call Exotel outbound API
  ├── Update attempted_at + status: 'attempted'
  └── Wait for StatusCallback
  ↓
IF answered → status: 'answered' (post-call webhook handles the rest)
IF no-answer AND retries = 0 → retries: 1, schedule retry +2h
IF no-answer AND retries = 1 → status: 'no_answer', send WhatsApp alert to team
```

---

## Template Approach

Build one ElevenLabs Standard agent with all tools pre-configured and placeholder system prompt variables. For each new client:

1. Duplicate the ElevenLabs agent
2. Run a **2-hour onboarding session**: collect their 10 flow scenarios, business knowledge, escalation routing map (who handles what), CRM credentials
3. Fill in system prompt with their specific business knowledge
4. Configure the 4 escalation numbers in n8n config
5. Connect Zoho/HubSpot credentials in n8n
6. Connect their Exotel ExoPhone
7. Run test call suite: all 10 flows, each escalation type, outbound trigger, missed transfer fallback
8. Tune system prompt until every scenario passes
9. Go live

**Time per new Standard client after template is ready: 3–5 days** (most of it testing and prompt tuning across 10 flows).

---

## Monthly Retainer — What You Actually Do (₹22,000/mo)

- **Call log review** (weekly, 20 min) — scan PostgreSQL for missed transfers, failed CRM syncs, unanswered outbound calls
- **System prompt edits** — client updates services, pricing, team numbers (up to 5/month, 30 min each)
- **CRM sync troubleshooting** — OAuth token expiry, field mapping changes, new CRM fields
- **New flow additions** — up to 3 new call flows per month (each takes 1–2 hours to write + test)
- **Outbound campaign management** — client sends new list of customers to call → load into outbound_queue → monitor
- **Monthly report** — from PostgreSQL: total calls, breakdown by flow type, escalation rate, outbound pickup rate, CRM records created. Takes 30 minutes to compile.

Realistic time per client per month: **6–8 hours.**

---

## Costs to Run This (your side)

| Item | Cost |
|---|---|
| Exotel (ExoPhone + call minutes, inbound + outbound) | ~₹4,000–8,000/mo depending on volume |
| ElevenLabs Conversational AI | ~₹2,000–5,000/mo per client |
| Claude Haiku (call summaries) | ~₹200–500/mo (fractions per call) |
| PostgreSQL (VPS, shared) | ~₹500/mo shared |
| n8n (self-hosted, shared) | Already running |
| Meta Cloud API (WhatsApp briefings) | Free up to 1,000 conversations/month |
| **Total per client** | **~₹6,700–14,000/mo** |

At ₹22,000/mo retainer, margin after costs: ₹8,000–15,300/mo per client.

---

## What to Build First

1. Get Starter working end-to-end first (Exotel + ElevenLabs basic connection)
2. Add ElevenLabs tools configuration — create one test tool (ESCALATE_TEST), verify n8n receives the mid-call webhook
3. Build the Exotel transfer leg — verify live call transfers correctly to another number
4. Add WhatsApp briefing to the transfer flow — confirm message arrives before the phone rings
5. Add Claude Haiku summary to post-call webhook flow
6. Set up PostgreSQL schema and verify rows are inserted correctly
7. Wire up Zoho or HubSpot sync — test with a real contact
8. Build outbound campaign worker — test with your own number, verify pickup and no-answer paths
9. Run the full 10-flow test suite against a real phone

**First Standard client takes 1–2 weeks.** Every client after: 3–5 days.
