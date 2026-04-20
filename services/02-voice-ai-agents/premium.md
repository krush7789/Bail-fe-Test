# Voice AI Agents — Premium

**Price:** ₹7,99,999 one-time | ₹55,000/mo retainer | ₹13,49,999/yr bundled

---

## What this is

Everything in Standard, plus five meaningful upgrades that Standard cannot do: the client's own voice cloned and speaking on every call, four Indian languages in one agent, a bi-directional CRM so the agent knows who's calling before they say a word, warm transfers where the human agent is briefed and ready before the caller connects, and a live analytics dashboard showing call sentiment, resolution rates, and campaign performance.

Premium also runs on dedicated infrastructure — one VPS per client, not shared.

---

## What's Different from Standard

| Feature | Standard | Premium |
|---|---|---|
| Voice | ElevenLabs library voice | Client's own voice cloned (ElevenLabs PVC) |
| Languages | Hindi + English | Hindi, Tamil, Telugu, English (one agent, auto-detect) |
| Call flows | Up to 10 | Unlimited |
| Transfer type | Cold — caller waits, WhatsApp briefing | Warm — human briefed on line, then bridged |
| CRM direction | Write-only after call | Bi-directional — reads history at call start, writes after |
| Sentiment analysis | None | Claude Haiku post-call scoring on every transcript |
| Analytics | None | Metabase dashboard (5+ charts, client login) |
| Infrastructure | Shared VPS | Dedicated VPS per client |

---

## Full System Architecture

```
INBOUND:
Caller dials Exotel ExoPhone
  ↓
Exotel receives the call → WebSocket to ElevenLabs (Flash v2.5)
  ↓
ElevenLabs first action: GET_CUSTOMER_CONTEXT tool
  → n8n queries crm_contacts by caller number
  → if found: return name, history, open tickets, lifetime value
  → if not: return empty
  ↓
Agent greets caller by name (if found) or generically
  ↓
Conversation in detected language (Hindi / Tamil / Telugu / English)
  ↓
Mid-call: agent invokes tool based on intent
  (GET_CUSTOMER_CONTEXT / ESCALATE_WARM / BOOK_APPOINTMENT / LOG_QUOTE_REQUEST)
  ↓
Tool fires to n8n mid-call (ElevenLabs tools, Post-Tool Speech mode)
  ↓
After call: ElevenLabs post-call webhook → n8n
  → Claude Haiku: sentiment + emotion + summary
  → Insert into PostgreSQL
  → CRM sync (Zoho / HubSpot)

OUTBOUND:
n8n cron (every 30 min) → check outbound_queue
  → Exotel outbound call API
  → ElevenLabs outbound agent handles conversation
  → Post-call webhook → same logging flow

WARM TRANSFER:
ESCALATE_WARM fires → n8n dials human agent first
  → Agent hears AI briefing, presses 1
  → Exotel bridges both call legs
  → ElevenLabs drops off
  → Caller and human agent speak directly
```

---

## Tech Stack

| Tool | Role |
|---|---|
| **Exotel** | Indian virtual numbers, inbound + outbound telephony, call bridging |
| **ElevenLabs Conversational AI (Flash v2.5)** | Voice agent — multilingual, PVC voice, tools, speech recognition |
| **ElevenLabs Professional Voice Clone (PVC)** | Client's own voice cloned from their recordings |
| **n8n** (dedicated Docker instance) | All orchestration — CRM lookup, warm transfer, sentiment, logging |
| **PostgreSQL** (dedicated Docker instance) | Call history, CRM cache, outbound queue, sentiment scores |
| **Claude Haiku** | Post-call sentiment analysis + call summary |
| **Metabase** (dedicated Docker instance) | Analytics dashboard — connected to PostgreSQL |
| **Zoho CRM / HubSpot** | Lead and contact CRM — bi-directional sync |
| **Meta Cloud API** | WhatsApp — warm transfer briefings, missed call alerts |
| **Nginx + Let's Encrypt** | Reverse proxy, SSL for n8n and Metabase subdomains |

---

## Infrastructure — Dedicated VPS per Client

Every Premium client gets their own isolated server. No shared infrastructure.

**Spec:** Hetzner CX32 — 4 vCPU, 8 GB RAM, 80 GB SSD (~₹2,200/mo)

**What runs on it:** n8n, PostgreSQL, Metabase — all via Docker Compose.

**docker-compose.yml:**
```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: voiceai
      POSTGRES_PASSWORD: {{STRONG_DB_PASSWORD}}
      POSTGRES_DB: client_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: postgres
      DB_POSTGRESDB_DATABASE: client_db
      DB_POSTGRESDB_USER: voiceai
      DB_POSTGRESDB_PASSWORD: {{STRONG_DB_PASSWORD}}
      N8N_BASIC_AUTH_ACTIVE: "true"
      N8N_BASIC_AUTH_USER: admin
      N8N_BASIC_AUTH_PASSWORD: {{STRONG_N8N_PASSWORD}}
      WEBHOOK_URL: https://n8n.{{CLIENT_DOMAIN}}.com
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  metabase:
    image: metabase/metabase
    restart: always
    ports:
      - "3000:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_HOST: postgres
      MB_DB_PORT: 5432
      MB_DB_DBNAME: client_db
      MB_DB_USER: voiceai
      MB_DB_PASS: {{STRONG_DB_PASSWORD}}
    depends_on:
      - postgres

volumes:
  postgres_data:
  n8n_data:
```

**Nginx config (routes subdomains to Docker ports):**
```nginx
server {
    server_name n8n.clientdomain.com;
    location / { proxy_pass http://localhost:5678; }
}
server {
    server_name analytics.clientdomain.com;
    location / { proxy_pass http://localhost:3000; }
}
```

SSL: `certbot --nginx -d n8n.clientdomain.com -d analytics.clientdomain.com`

**Setup time for VPS:** ~2 hours (provisioning + Docker + Nginx + SSL).

---

## Component 1: Voice Cloning — ElevenLabs PVC

### What it is

Client's actual voice, cloned. Every caller hears the business owner or brand voice speaking to them — not a library AI voice. It changes the experience completely.

### Audio requirements (confirmed from ElevenLabs docs)

- Minimum 30 minutes of clean audio; optimal is 2–3 hours
- Single speaker only — no background noise, no music, no other voices in the recording
- Available on ElevenLabs Creator plan ($22/mo) — not enterprise-only

### Best audio sources

- Existing client call recordings (export from their phone system or CRM)
- Google Meet / Zoom recordings (audio track only)
- Podcast recordings or YouTube videos (with client's permission)
- Studio recording session (last resort if no existing recordings)

### Setup steps

1. Collect audio from client — target 60–90 minutes for good quality
2. Clean the audio: run through Adobe Podcast Enhance (free, browser-based) or Audacity noise reduction
3. Trim silence and non-speech segments
4. Upload to ElevenLabs → Voices → Add Voice → Professional Voice Clone
5. Training: 2–6 hours depending on queue
6. Generate 10 test phrases covering different emotions and tones
7. Get client approval on voice quality before assigning to the agent
8. Assign the PVC voice to their ElevenLabs agent

**Communicate to client upfront:** Output quality depends on source audio quality. Poor input recordings = degraded clone. Set this expectation before starting.

---

## Component 2: Multilingual — ElevenLabs Flash v2.5

### Confirmed capabilities

- Flash v2.5 supports 32 languages including Hindi, Tamil, Telugu, English
- Built-in **language detection system tool** — detects caller language from first 2–3 words, responds in that language throughout
- One agent handles all 4 languages — no need for separate agents per language

### Agent setup

1. ElevenLabs agent → Model → select **Flash v2.5**
2. Agent settings → Languages → enable: Hindi, Tamil, Telugu, English
3. Tools → System Tools → enable **Language Detection**
4. The agent auto-detects and maintains the caller's language for the entire call

### Voice quality across languages

The PVC voice is used for all languages. Flash v2.5's multilingual model handles cross-language synthesis with the cloned voice. **Test each language with a real call** before going live — if Tamil or Telugu quality is poor with the PVC, fall back to a high-quality ElevenLabs library multilingual voice for those specific languages.

### System prompt instruction

```
LANGUAGE:
Detect the caller's language from their first sentence.
Respond in that language throughout the entire call.
Hindi → respond in Hindi.
Tamil → respond in Tamil.
Telugu → respond in Telugu.
English → respond in English.
Hinglish (mixed Hindi-English) → match their mix naturally.
Never switch language mid-response unless the caller switches first.
```

---

## Component 3: CRM-Aware Agent — Bi-Directional CRM

### The problem

Inbound calls connect immediately through Exotel → ElevenLabs WebSocket. There is no natural gap to pre-fetch CRM data before the agent starts speaking.

### The solution — GET_CUSTOMER_CONTEXT as first tool call

ElevenLabs makes the caller's phone number available automatically as `{{ system__caller_id }}` (a confirmed dynamic variable). The system prompt instructs the agent to call `GET_CUSTOMER_CONTEXT` before delivering the greeting. The LLM follows this instruction — it calls the tool first, receives the CRM record, then speaks.

Latency added: ~500–800ms. Acceptable because Exotel's WebSocket connection setup naturally takes ~1 second anyway.

### System prompt instruction

```
FIRST ACTION — before greeting the caller:
Call GET_CUSTOMER_CONTEXT with caller number {{ system__caller_id }}.

If caller is found in CRM:
  Address them by name.
  If they have open tickets: "I can see there's an open issue on your account — would you like me to get that sorted?"
  If last_call_reason is known: "I see you last called about [reason]. Is everything resolved?"
  Use their preferred_language if returned (override language detection).

If caller is not found:
  Greet generically and proceed normally.
```

### n8n CRM lookup webhook (`POST /crm-lookup`)

```
Receive: { "caller_number": "9876543210" }
  ↓
Query crm_contacts table (local cache):
  SELECT * FROM crm_contacts WHERE phone = '9876543210'
  ↓
IF found AND updated_at > NOW() - INTERVAL '24 hours':
  Return cached record immediately (fast path)

IF not found OR stale:
  Call Zoho/HubSpot API to search by phone number
  Upsert result into crm_contacts table
  Return record
  ↓
Return to ElevenLabs:
{
  "found": true,
  "name": "Rahul Sharma",
  "last_call_reason": "billing dispute",
  "last_call_date": "2026-04-10",
  "open_tickets": 1,
  "lifetime_value": "₹45,000",
  "preferred_language": "hindi"
}
```

### CRM write-back (post-call)

Same as Standard: post-call webhook → Claude summary → PostgreSQL → Zoho/HubSpot call activity log. The difference is the bi-directional sync — the `crm_contacts` table stays current so the next call has fresh data.

---

## Component 4: Warm Transfer — Full Architecture

Standard transfers are cold: caller waits on hold while Exotel dials the human agent. Premium transfers are warm: the human agent is briefed by an AI voice and confirms they're ready before the caller connects to them.

### The full flow

```
Caller triggers escalation (e.g. ESCALATE_WARM type="billing")
  ↓
Agent says (Post-Tool Speech Mode):
  "Let me get our accounts team ready for you — just one moment."
  (Agent keeps speaking while tool fires in background)
  ↓
ESCALATE_WARM tool webhook fires to n8n: POST /escalate-warm
Payload:
{
  "type": "billing",
  "caller_number": "9876543210",
  "crm_context": { "name": "Rahul Sharma", "open_tickets": 1, "last_call_reason": "billing dispute" },
  "conversation_id": "conv_xxx"
}
  ↓
n8n STEP 1 — dial the human agent:
POST https://api.exotel.com/v1/Accounts/{{SID}}/Calls/connect
From: {{EXOPHONE}}
To: {{BILLING_TEAM_NUMBER}}
Url: https://n8n.clientdomain.com/webhook/warm-briefing   ← ExoML endpoint
StatusCallback: https://n8n.clientdomain.com/webhook/transfer-status
  ↓
Human agent's phone rings and they pick up.
Exotel calls the ExoML endpoint → n8n returns this ExoML:

<Response>
  <Say voice="alice" language="en-IN">
    Transfer incoming. Caller: Rahul Sharma, existing customer.
    Reason: Billing query. They have one open ticket.
    Lifetime value: 45,000 rupees.
    Press 1 when you are ready to connect.
  </Say>
  <Gather numDigits="1" action="https://n8n.clientdomain.com/webhook/agent-ready" method="POST">
  </Gather>
</Response>
  ↓
Human agent hears the briefing, presses 1.
Exotel POST to /agent-ready with the agent call SID.
  ↓
n8n STEP 2 — bridge both call legs:
(Verify exact Exotel Conference/Bridge API before implementing —
Exotel ExoBridge capability is confirmed, exact verb syntax must be checked
at developer.exotel.com or via Exotel support before writing production code.)
  ↓
Both legs bridged. ElevenLabs agent says:
  "I've got our accounts team ready for you. Connecting you now. Have a good call!"
ElevenLabs drops off.
Caller and human agent speak directly.
```

### If human agent doesn't pick up

```
Exotel StatusCallback fires: status = "no-answer"
  ↓
n8n:
  1. Plays fallback audio to caller (Exotel pre-recorded file):
     "Our team is temporarily unavailable. We'll call you back within 30 minutes."
  2. Logs: transfer_type='warm', transfer_status='warm_transfer_failed'
  3. WhatsApp alert to team group (Meta Cloud API):
     "Missed warm transfer — BILLING — Rahul Sharma (9876543210) — 3:14pm. Needs callback."
  4. Inserts row into outbound_queue:
     flow_type='callback', customer_number='9876543210', scheduled_at=NOW()+30min
```

The outbound campaign worker picks up the callback row 30 minutes later and calls the customer back automatically.

---

## Component 5: Sentiment Analysis — Claude Haiku Post-Call

After every call, n8n sends the ElevenLabs transcript to Claude Haiku:

**Claude API call (n8n HTTP Request node):**
```
POST https://api.anthropic.com/v1/messages
x-api-key: {{CLAUDE_API_KEY}}
anthropic-version: 2023-06-01
Content-Type: application/json

{
  "model": "claude-haiku-4-5",
  "max_tokens": 200,
  "messages": [{
    "role": "user",
    "content": "Analyse this call transcript and return JSON only. No explanation.\n\nFields required:\n- sentiment: 'positive' | 'neutral' | 'negative'\n- frustration_score: integer 1-5 (1=calm, 5=very frustrated)\n- resolution: 'resolved' | 'escalated' | 'abandoned'\n- emotion_tags: string array (e.g. ['confused', 'urgent', 'satisfied'])\n- summary: string, 2 sentences max\n\nTranscript:\n{{TRANSCRIPT}}"
  }]
}
```

**Example response:**
```json
{
  "sentiment": "negative",
  "frustration_score": 4,
  "resolution": "escalated",
  "emotion_tags": ["frustrated", "urgent"],
  "summary": "Caller disputed April billing charge, said the amount was higher than agreed. Escalated to accounts team after agent confirmed invoice details."
}
```

All fields stored in `calls` table. Powers Metabase sentiment dashboard. Cost per call: fractions of a rupee.

---

## Component 6: Analytics Dashboard — Metabase

Metabase runs on the dedicated VPS (already in Docker Compose). First-time setup: go to `analytics.clientdomain.com`, connect to PostgreSQL, done in 10 minutes.

Client gets their own login — they can view all dashboards but cannot edit queries.

### 5 core dashboards and their SQL

**Dashboard 1 — Call Volume (daily)**
```sql
SELECT DATE_TRUNC('day', created_at) AS day,
       COUNT(*) AS total_calls,
       SUM(CASE WHEN direction = 'inbound' THEN 1 ELSE 0 END) AS inbound,
       SUM(CASE WHEN direction = 'outbound' THEN 1 ELSE 0 END) AS outbound
FROM calls
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1 ORDER BY 1;
```

**Dashboard 2 — Resolution Rate**
```sql
SELECT resolution,
       COUNT(*) AS calls,
       ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS pct
FROM calls
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY resolution;
```

**Dashboard 3 — Sentiment Trend (weekly)**
```sql
SELECT DATE_TRUNC('week', created_at) AS week,
       ROUND(AVG(frustration_score), 2) AS avg_frustration,
       COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS positive,
       COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) AS negative
FROM calls
WHERE created_at >= NOW() - INTERVAL '60 days'
GROUP BY 1 ORDER BY 1;
```

**Dashboard 4 — Top Call Intents**
```sql
SELECT UNNEST(tools_triggered) AS intent,
       COUNT(*) AS times
FROM calls
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1 ORDER BY 2 DESC LIMIT 10;
```

**Dashboard 5 — Language Breakdown**
```sql
SELECT language,
       COUNT(*) AS calls,
       ROUND(AVG(duration_sec) / 60.0, 1) AS avg_min,
       ROUND(AVG(frustration_score), 2) AS avg_frustration
FROM calls
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY language ORDER BY calls DESC;
```

---

## PostgreSQL Schema

```sql
CREATE TABLE calls (
  id                   SERIAL PRIMARY KEY,
  conversation_id      TEXT UNIQUE,
  caller_number        TEXT,
  direction            TEXT,                 -- 'inbound' | 'outbound'
  duration_sec         INTEGER,
  language             TEXT,                 -- 'hindi' | 'tamil' | 'telugu' | 'english'
  tools_triggered      TEXT[],
  escalation_type      TEXT,                 -- 'sales' | 'support' | 'billing' | 'manager'
  transfer_type        TEXT,                 -- 'warm' | 'cold' | null
  transfer_status      TEXT,                 -- 'answered' | 'warm_transfer_failed' | 'missed' | null
  crm_context_found    BOOLEAN,
  crm_contact_id       TEXT,
  transcript           TEXT,
  summary              TEXT,
  sentiment            TEXT,                 -- 'positive' | 'neutral' | 'negative'
  frustration_score    INTEGER,              -- 1–5
  resolution           TEXT,                 -- 'resolved' | 'escalated' | 'abandoned'
  emotion_tags         TEXT[],
  crm_synced           BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crm_contacts (
  id                   SERIAL PRIMARY KEY,
  phone                TEXT UNIQUE,
  name                 TEXT,
  crm_id               TEXT,                 -- Zoho / HubSpot contact ID
  preferred_language   TEXT,
  lifetime_value       TEXT,
  last_call_reason     TEXT,
  last_call_date       DATE,
  open_tickets         INTEGER DEFAULT 0,
  raw_crm_data         JSONB,
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE appointments (
  id                   SERIAL PRIMARY KEY,
  call_id              INTEGER REFERENCES calls(id),
  customer_name        TEXT,
  preferred_time       TEXT,
  phone                TEXT,
  language             TEXT,
  status               TEXT DEFAULT 'pending',
  reminder_sent        BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE outbound_queue (
  id                   SERIAL PRIMARY KEY,
  customer_number      TEXT,
  customer_name        TEXT,
  flow_type            TEXT,                 -- 'callback' | 'reminder' | 'follow_up' | 'payment'
  language_hint        TEXT,
  scheduled_at         TIMESTAMPTZ,
  attempted_at         TIMESTAMPTZ,
  status               TEXT DEFAULT 'pending',
  retries              INTEGER DEFAULT 0,
  payload              JSONB,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ElevenLabs Tools — Full Config

| Tool | Trigger Mode | When | n8n Endpoint |
|---|---|---|---|
| GET_CUSTOMER_CONTEXT | Immediate | First turn (system prompt instruction) | POST /crm-lookup |
| ESCALATE_WARM | Post-Tool Speech | Sales / support / billing / manager intent | POST /escalate-warm |
| BOOK_APPOINTMENT | Post-Tool Speech | Booking flow complete | POST /book-appointment |
| LOG_QUOTE_REQUEST | Immediate | Quote interest collected | POST /log-quote |
| SEND_WHATSAPP_FOLLOWUP | Immediate | Caller requests info via WhatsApp | POST /send-followup |

All tools: enable **"Wait for response"** so the agent can use the return value in its next utterance.

---

## n8n Workflow Summary

**Workflow 1 — CRM Lookup (`POST /crm-lookup`)**
```
Receive { caller_number }
  ↓
Query crm_contacts (local cache)
  → IF found + fresh (<24h) → return immediately
  → IF stale or missing → Zoho/HubSpot API → upsert crm_contacts → return
```

**Workflow 2 — Warm Transfer (`POST /escalate-warm`)**
```
Receive { type, caller_number, crm_context, conversation_id }
  ↓
Lookup agent number for escalation type (Switch node)
  ↓
Call Exotel outbound API to dial agent (Url = /warm-briefing ExoML)
  ↓
Wait for /agent-ready (agent pressed 1)
  ↓
Bridge call legs via Exotel Conference/Bridge API
  ↓
Log to calls table
  ↓
On no-answer:
  → Fallback audio
  → WhatsApp alert to team
  → Insert outbound_queue callback row
```

**Workflow 3 — Post-Call (`POST /post-call`)**
```
Receive ElevenLabs post-call payload
  ↓
Extract: transcript, duration, tools_triggered, caller_number, language
  ↓
Claude Haiku: sentiment + emotion_tags + frustration_score + resolution + summary
  ↓
Insert into calls table
  ↓
IF BOOK_APPOINTMENT → insert into appointments
  ↓
CRM sync: search contact → create if new → log call activity
  ↓
Mark crm_synced: true
```

**Workflow 4 — Outbound Campaign Worker (Cron, every 30 min)**
```
SELECT from outbound_queue WHERE status='pending' AND scheduled_at <= NOW() AND retries < 2
  ↓
For each row:
  Call Exotel outbound API (Url = ElevenLabs outbound agent WebSocket)
  Update: status='attempted', attempted_at=NOW()
  ↓
StatusCallback:
  answered → post-call webhook handles rest
  no-answer + retries=0 → retries=1, reschedule +2h
  no-answer + retries=1 → status='no_answer', WhatsApp alert to team
```

**Workflow 5 — ExoML Briefing endpoint (`GET /warm-briefing`)**
```
Called by Exotel when human agent picks up
  ↓
n8n returns ExoML with briefing text + Gather (waits for keypress)
  ↓
Agent presses 1 → Exotel calls /agent-ready
  ↓
n8n triggers bridge
```

---

## System Prompt — Premium

```
You are the voice of {{CLIENT_NAME}}, {{BUSINESS_TYPE}}.
You speak in the cloned voice of [owner name / brand voice].

VERY FIRST ACTION — before greeting the caller:
Call GET_CUSTOMER_CONTEXT with {{ system__caller_id }}.
If found: greet by name, reference their history.
If not found: greet generically.

LANGUAGE:
Detect from caller's first sentence.
Hindi → Hindi. Tamil → Tamil. Telugu → Telugu. English → English.
Hinglish → match their mix. Never switch mid-response.
If preferred_language returned from CRM → use that language.

STYLE:
Warm, professional, 1–3 sentences per response. Never lists. Never markdown.
This is the client's own voice — speak with their warmth and authority.

KNOWLEDGE:
{{Business hours}}
{{Location}}
{{Services — in natural conversational sentences}}
{{Pricing}}
{{Key team names for escalation: sales = [Name], billing = [Name], support = [Name]}}

CRM-AWARE GREETINGS (use when CRM data is returned):
open_tickets > 0: "I can see there's an open issue on your account — shall I get that sorted?"
last_call_reason known: "I see you last called about [reason] — is everything resolved?"
returning customer: "Welcome back, [name]. How can I help you today?"

[All call flows here — unlimited, client defines them at onboarding]

ESCALATION — ALL USE WARM TRANSFER:
Sales intent → "I'm getting [Sales Name] ready for you — just one moment." → ESCALATE_WARM type=sales
Support issue → "Let me get our support team on the line." → ESCALATE_WARM type=support
Billing query → "I'll get [Billing Name] for you right away." → ESCALATE_WARM type=billing
Wants manager → "Of course — connecting you with [Manager Name] now." → ESCALATE_WARM type=manager

HARD RULES:
Never fabricate. Never two questions in one turn.
If asked "are you AI?": "I'm the voice assistant for [Client Name]. How can I help?"
Silence > 5 seconds: "Hello — are you still there?"
```

---

## Order of Development

Build in this sequence — each step depends on the previous:

1. **VPS provisioning** — Hetzner CX32, Docker + Docker Compose, Nginx, SSL. ~2 hours.
2. **PostgreSQL schema** — run all CREATE TABLE statements, verify with a test insert.
3. **ElevenLabs PVC** — collect client audio, clean, upload, wait for training. Get client sign-off on voice quality.
4. **Multilingual agent** — create agent with Flash v2.5, enable 4 languages + language detection tool. Test each language with a real call.
5. **GET_CUSTOMER_CONTEXT + n8n Workflow 1** — build CRM lookup, test with known and unknown phone numbers.
6. **Post-call + sentiment — Workflow 3** — wire up Claude Haiku, verify PostgreSQL inserts, verify CRM write-back.
7. **Warm transfer — Workflow 2 + Workflow 5** — verify Exotel ExoML Conference/Bridge verb with Exotel docs first, then build. Test all paths: answered, no-answer, fallback.
8. **Metabase dashboards** — connect to PostgreSQL, create 5 dashboards, create client read-only login.
9. **Outbound campaign worker — Workflow 4** — test with your own number in outbound_queue.
10. **Full test suite** — minimum 15 test calls: all 4 languages, CRM hit + miss, warm transfer answered + no-answer, sentiment on positive + negative calls, outbound answered + no-answer, all escalation types.

---

## Monthly Retainer — What You Actually Do (₹55,000/mo)

- **Daily (5 min):** Metabase alert — check for frustration_score spikes, failed warm transfers
- **Weekly (30 min):** Full call log review — resolution rate, warm transfer success %, outbound pickup rate, CRM sync errors
- **As needed:** System prompt updates, new call flow additions (unlimited — this is a key Premium feature), voice model refresh if client updates their recording
- **Monthly (2 hours):** Metabase report to client, CRM sync audit (any missing records), Exotel credit check, VPS health (disk space, memory, Docker container health)
- **Quarterly (3 hours):** Full sentiment trend analysis + recommendations — what's frustrating callers, what flows have poor resolution rates

Realistic time per client per month: **12–15 hours.**

---

## Costs to Run This (your side)

| Item | Cost |
|---|---|
| Hetzner CX32 VPS (dedicated) | ~₹2,200/mo |
| Exotel (inbound + outbound minutes, ExoPhone) | ~₹5,000–10,000/mo |
| ElevenLabs Flash v2.5 + PVC (Premium usage) | ~₹4,000–8,000/mo |
| Claude Haiku (sentiment + summaries) | ~₹500–1,000/mo |
| Meta Cloud API (WhatsApp briefings + alerts) | Free up to 1,000 conversations/mo |
| **Total per client** | **~₹11,700–21,200/mo** |

At ₹55,000/mo retainer: margin after costs = **₹33,800–43,300/mo per client.**

---

## Caveats — Verify Before Building

1. **Exotel warm bridge syntax** — Exotel ExoBridge / conference call capability is confirmed to exist. The exact ExoML verb name and attributes for bridging two active call legs must be verified at developer.exotel.com or via Exotel support before writing this code. Do not assume the syntax.
2. **PVC voice quality per language** — Test Tamil and Telugu synthesis with the client's cloned voice on real calls before launch. If quality is poor, use an ElevenLabs library multilingual voice for those languages instead.
3. **GET_CUSTOMER_CONTEXT latency** — Adds ~500–800ms before the agent's first word. Acceptable given Exotel WebSocket setup time. If it becomes noticeable, switch to a local PostgreSQL cache hit path (skip CRM API call on first turn, sync async).

---

## What to Build First

1. Spin up VPS → Docker Compose → Nginx → SSL → confirm n8n and Metabase accessible at their subdomains
2. Run PostgreSQL schema → insert one test call row → confirm Metabase can read it
3. Create ElevenLabs agent with Flash v2.5 + your own test voice first (PVC takes 2–6 hours — start it early, test with a library voice in parallel)
4. Build and test GET_CUSTOMER_CONTEXT — call your own number, verify CRM lookup fires and returns data
5. Approve PVC with client → swap voice in agent
6. Build post-call flow with sentiment → make 3 real calls → verify PostgreSQL rows and Metabase charts
7. Build warm transfer — read Exotel docs for conference bridge first, then build and test: answered path, no-answer path
8. Build outbound worker → load 3 test rows → verify calls trigger correctly
9. Complete all 15 test calls covering every path
10. Go live

**First Premium client: 2–3 weeks.** Every client after: 1 week (mostly PVC audio collection and testing).
