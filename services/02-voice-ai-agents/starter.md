# Voice AI Agents — Starter

**Price:** ₹59,999 one-time | ₹8,000/mo retainer | ₹1,39,999/yr bundled

---

## What this is

A conversational AI voice agent that answers your phone like a real person. No button-pressing, no "press 1 for sales" IVR menus. The caller speaks naturally — the AI listens, understands, and talks back in real time.

Built on **ElevenLabs Conversational AI** (voice + speech understanding + LLM) connected to **Exotel** (Indian virtual phone number). When someone calls the business number, the AI picks up, handles the conversation, and either books appointments or transfers to a human.

Starter covers:
- **2 inbound call flows** (the client defines what matters most — usually general enquiry + appointment booking)
- **Inbound only** (client's customers call in — no outbound dialling)
- **1 language** — Hindi OR English (client's choice)
- **Human escalation** — live call transfer to the client's mobile when needed

---

## How This Actually Works

This is important to understand before setting anything up. It is not a phone tree. It is not recorded responses being played back. It is a live, streaming, two-way conversation happening in real time:

```
Caller dials the Exotel virtual number
  ↓
Exotel receives the incoming call
  ↓
Exotel opens a WebSocket connection to ElevenLabs (real-time audio stream)
  ↓
ElevenLabs receives caller's voice → speech-to-text → LLM processes it → text-to-speech
  ↓
ElevenLabs streams the AI voice response back to Exotel via WebSocket
  ↓
Caller hears the AI voice — sub-second latency
  ↓
Conversation continues naturally, back and forth
```

The caller has no idea they are talking to an AI unless they ask. ElevenLabs voices are that good.

---

## Tech Stack

| Tool | Role |
|---|---|
| **Exotel** | Indian virtual phone number (ExoPhone) + telephony infrastructure |
| **ElevenLabs Conversational AI** | The voice agent — speech recognition + LLM reasoning + voice synthesis |
| **n8n** (self-hosted) | Receives post-call webhooks, handles call logging, triggers call transfer |
| **Google Sheets** | Call log — every call's transcript, duration, trigger, timestamp |
| **UptimeRobot** | Free uptime monitoring |

No Twilio. No BSP. No cloud telephony reseller markup. Exotel is the Indian-native provider with a direct, official ElevenLabs integration.

---

## The 2 Call Flows — What They Actually Mean

A "call flow" is one complete conversation scenario the agent knows how to handle from start to finish. Starter includes 2. The client defines what their 2 most important scenarios are during onboarding.

**Typical 2 flows for a small business:**

**Flow 1 — General Enquiry**
The caller asks about services, hours, location, or pricing. The AI answers from the knowledge you put in the system prompt. No menus, no routing — just a natural conversation. Ends with either resolving the caller's question or offering to transfer to the team.

**Flow 2 — Appointment / Callback Booking**
The caller wants to book or get a callback. The AI collects:
1. Caller's name
2. Preferred date and time
3. Phone number to confirm on

Then confirms verbally and triggers the logging webhook. The client sees the booking in their Google Sheet immediately.

Anything outside these 2 flows → AI says "Let me connect you with our team" → live transfer to client's mobile.

The client defines their 2 flows in a 1-hour onboarding call before you configure anything.

---

## Exotel Setup — Step by Step

### 1. Account Setup

1. Go to exotel.com → sign up (15-day free trial, ₹1,000 credits included)
2. Create the account **under the client's details** — not your own. Same principle as Meta Cloud API. You get admin access to manage it.

### 2. Get a Virtual Number (ExoPhone)

1. In Exotel dashboard → Phone Numbers → Buy Number
2. Choose an Indian mobile or landline number in the client's city/state if possible
3. This is the number clients will publish on their website, Google Business, visiting cards

### 3. Connect Exotel to ElevenLabs

Exotel has a native WebSocket integration with ElevenLabs — no SIP provisioning needed.

1. In ElevenLabs dashboard → go to your agent → Integrations → Exotel
2. ElevenLabs gives you a **WebSocket URL** specific to this agent
3. In Exotel dashboard → your ExoPhone → App Settings → Incoming Calls
4. Set the call handling to **WebSocket** and paste the ElevenLabs WebSocket URL
5. Save — the connection is live

Now when someone dials the Exotel number, Exotel automatically opens a WebSocket stream to ElevenLabs. The AI answers.

### 4. Test the Connection

Dial the ExoPhone from your own mobile. ElevenLabs should answer with the first message. Speak — hear the AI respond in real time. If it works, the infrastructure is set up.

---

## ElevenLabs Agent Setup — Step by Step

1. Go to elevenlabs.io → Agents → Create New Agent
2. **Voice:** Pick from the ElevenLabs voice library. For Hindi, choose a Hindi-native voice. For English, choose a professional Indian-accent or neutral English voice. (Voice cloning of the client's own voice is a Premium tier feature.)
3. **LLM:** ElevenLabs uses its own built-in LLM by default. This is fine for Starter — it handles conversational reasoning well. Optionally plug in Claude or GPT-4o if you want more control.
4. **First message:** What the AI says the moment it picks up. Example: *"Hello, thank you for calling [Business Name]. How can I help you today?"*
5. **System prompt:** See next section.
6. Go to Phone Numbers → Add Number → select **Exotel** → paste Exotel credentials → ElevenLabs auto-configures the WebSocket

---

## System Prompt — How to Write It for Voice

Voice system prompts are completely different from chatbot prompts. The AI is speaking out loud, not displaying text. Key rules:

- **Short responses** — callers cannot re-read. Each AI response should be 1–3 sentences max.
- **No markdown** — no bullet points, no bold, no headers. Pure natural speech.
- **Interruption-ready** — callers interrupt. The prompt must tell the AI to handle this gracefully.
- **One thing at a time** — ask one question per turn, never a list of questions.

**Template to fill in per client:**

```
You are a friendly voice assistant for {{CLIENT_NAME}}, a {{BUSINESS_TYPE}} based in {{CITY}}.

YOUR PERSONALITY:
Warm, professional, and concise. You speak in short, natural sentences.
You respond in {{LANGUAGE}} only. Never switch languages.
If you don't understand something, ask the caller to repeat it once.

WHAT YOU KNOW:
{{Business hours — written as: "We are open Monday to Saturday, 10am to 7pm."}}
{{Location — written as: "We are located at [address], near [landmark]."}}
{{Services — written as sentences: "We offer [service 1], [service 2], and [service 3]."}}
{{Pricing — written as: "Our [service] starts at [price]."}}

CALL FLOW 1 — General Enquiry:
If the caller asks about services, hours, location, or pricing:
Answer from the information above. Keep each answer under two sentences.
After answering, ask: "Is there anything else I can help you with?"
If they are done, say: "Thank you for calling [Business Name]. Have a great day!"
If they want to speak to someone: say "Of course, let me connect you with our team."
Then trigger: TRANSFER_CALL

CALL FLOW 2 — Appointment or Callback Booking:
If the caller wants to book an appointment or get a callback:
Step 1: "Sure! Could I get your name please?"
Step 2: "Thank you [name]. What date and time works best for you?"
Step 3: "And what's the best number to confirm on? Is [caller's number] okay, or a different one?"
Step 4: "Perfect. I've noted that down. Our team will confirm your appointment within 2 hours. Is there anything else I can help you with?"
Then trigger: BOOK_APPOINTMENT

ESCALATION — Everything Else:
If the caller asks anything you cannot answer from the information above:
Say: "That's a great question. Let me connect you with our team who can help you better."
Then trigger: TRANSFER_CALL

IMPORTANT RULES:
- Never make up information. If you don't know, say so and offer to transfer.
- Never ask more than one question at a time.
- If the caller is unclear, ask them to repeat once: "I'm sorry, could you say that again?"
- Keep every response under 3 sentences.
```

The `BOOK_APPOINTMENT` and `TRANSFER_CALL` triggers are how ElevenLabs signals n8n. ElevenLabs fires these as part of the post-call webhook data — you configure what triggers exist inside the ElevenLabs agent settings.

---

## Human Escalation — Call Transfer

When `TRANSFER_CALL` is triggered, the call transfers live to the client's mobile number. Here is exactly what happens:

```
Caller is mid-conversation with the AI
  ↓
AI says: "Let me connect you with our team right away."
  ↓
ElevenLabs ends the AI session and fires a post-call webhook to n8n
  ↓
n8n calls the Exotel Call Transfer API
  ↓
Exotel connects the caller to the client's registered mobile number
  ↓
Client's phone rings — they pick up and speak directly to the caller
```

**Exotel Call Transfer API call** (n8n HTTP Request node):

```
POST https://api.exotel.com/v1/Accounts/{{ACCOUNT_SID}}/Calls/connect
Auth: Basic (Exotel API key + API token)
Content-Type: application/x-www-form-urlencoded

From: {{EXOPHONE}}
To: {{CLIENT_MOBILE_NUMBER}}
CallerId: {{EXOPHONE}}
```

**If the client doesn't pick up:**

Exotel plays a fallback pre-recorded message ("Our team is unavailable right now. Please call back during business hours or leave a message.") — you upload this audio file to Exotel's App Dashboard. At this point the AI is no longer involved. This is a Starter limitation — Standard tier handles voicemail and callback logging.

---

## Call Logging — Google Sheets

ElevenLabs fires a webhook after every call ends. This webhook contains the full conversation data.

**What ElevenLabs sends in the post-call webhook:**
- Full conversation transcript (every line of the conversation, speaker-labelled)
- Call duration in seconds
- Which trigger was fired (`BOOK_APPOINTMENT`, `TRANSFER_CALL`, or none)
- Agent ID, conversation ID

**n8n extracts and appends a row to the client's Google Sheet:**

| Caller Number | Duration | Flow Triggered | Transcript (Summary) | Timestamp |
|---|---|---|---|---|
| 9876543210 | 2m 14s | BOOK_APPOINTMENT | Booked for Fri 25 Apr, 11am | 2026-04-20 14:32 |
| 9812345678 | 0m 47s | TRANSFER_CALL | Asked about bulk pricing | 2026-04-20 15:01 |
| 9900112233 | 1m 58s | — | Asked about hours, resolved | 2026-04-20 15:44 |

For `BOOK_APPOINTMENT` rows: n8n also appends to a separate **Appointments** sheet tab:

| Name | Preferred Time | Contact Number | Logged At |
|---|---|---|---|
| Rahul Sharma | Fri 25 Apr, 11am | 9876543210 | 2026-04-20 14:32 |

Both sheets are shared with the client — they see every call in real time without needing any extra tool.

---

## n8n Webhook Flow

```
ElevenLabs fires post-call webhook (after every call)
  ↓
n8n Webhook trigger receives the payload
  ↓
Extract: caller_number, duration, transcript, trigger_type
  ↓
Switch on trigger_type:
  ├── BOOK_APPOINTMENT
  │     → Extract name + preferred time from transcript
  │     → Append to Appointments sheet
  │     → Append to Calls log sheet
  │
  ├── TRANSFER_CALL
  │     → (Transfer already happened live — no action needed now)
  │     → Append to Calls log sheet
  │
  └── (no trigger / normal call end)
        → Append to Calls log sheet only
```

The transcript extraction for `BOOK_APPOINTMENT` uses a simple n8n **Function** node with regex or keyword matching — look for the name and time in the AI's confirmation line ("I've noted that down for [name] on [date/time]...").

---

## Template Approach (how to scale this)

Build **one ElevenLabs agent template** with the system prompt filled with placeholder variables. For each new Starter client:

1. Duplicate the agent in ElevenLabs
2. Run a **1-hour onboarding call** with the client: collect their 2 flow scenarios, business info (hours, location, services, pricing), escalation number
3. Fill in the system prompt template with their specific info
4. Connect their Exotel ExoPhone to the duplicated agent
5. Make 5 test calls through every scenario: general enquiry, booking, edge cases, escalation
6. Tune the system prompt based on test results (responses too long, wrong language, missed intent)
7. Share the Google Sheets log with the client

**Time per new Starter client after the template is ready: 2–3 days.**

Most of that time is on steps 5 and 6 — testing call quality and tuning the prompt. The infrastructure setup is under 1 hour.

---

## Monthly Retainer — What You Actually Do (₹8,000/mo)

- **Weekly call log review** — scan the Google Sheet for failed transfers, dropped calls, unanswered questions. Usually takes 15 minutes.
- **System prompt edits** — when the client changes hours, adds a new service, or updates pricing. Up to 5 edits/month. Each edit: under 30 minutes.
- **Exotel top-ups** — Exotel credit is consumed per call minute. Monitor balance, top up before it runs dry. Set up auto-recharge if possible.
- **ElevenLabs monitoring** — UptimeRobot watches the Exotel number by making a short test call. You get an email if the agent stops answering.
- **Monthly call report** — pull from Google Sheets: total calls, calls handled vs. transferred, bookings captured this month. Send as a simple doc to the client.

Realistic time per client per month: **2–3 hours.**

---

## Costs to Run This (your side)

| Item | Cost |
|---|---|
| Exotel virtual number + call minutes | ~₹2,000–4,000/mo (depends on call volume; ~₹1–2 per minute) |
| ElevenLabs Conversational AI | ~₹1,000–2,500/mo per client (depends on call volume at their new pricing) |
| n8n (self-hosted, shared across clients) | ~₹500/mo shared |
| Google Sheets | Free |
| UptimeRobot | Free |
| **Total per client** | **~₹3,500–7,000/mo** |

At ₹8,000/mo retainer, margin after costs is ₹1,000–4,500/mo per client. Tight for Starter, so keep the template clean and the time per client under 2 hours/month.

---

## What to Build First

1. Create your own Exotel trial account → get a test ExoPhone
2. Create an ElevenLabs account → build a test agent with the system prompt template
3. Connect Exotel to ElevenLabs via WebSocket (follow the official ElevenLabs Exotel integration guide)
4. Call your own test number — hear the AI answer, have a real conversation
5. Build the n8n webhook flow for post-call logging → verify rows appear in Google Sheets
6. Test all scenarios: general enquiry, appointment booking, escalation (does the transfer work?), edge cases (caller speaks Hindi when prompt is English, caller hangs up mid-flow)
7. Tune the system prompt until every test call feels natural

That working stack — Exotel number + ElevenLabs agent + n8n log flow + Google Sheet — is your Starter Voice AI product.

First client takes 2–3 days end-to-end. Every client after that takes under 1 day to configure.
