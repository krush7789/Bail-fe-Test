# Voice Assistant Plan — LiveKit Cloud + Gemini Live

**Status:** APPROVED DIRECTION — ready to implement.

**How to use this document:** Read the **"⚡ WHAT I NEED FROM YOU"** section, get the 5 values listed, paste them in, then say **"run this document and implement everything."** Everything else is automated.

---

## 1. Why we're rebuilding the voice layer

The text chatbot is live and working. The voice option (Chat / Talk toggle) was built using **raw browser WebRTC** — `getUserMedia` + `RTCPeerConnection` directly to OpenAI Realtime. It failed consistently on a loudspeaker in a noisy room: the mic picks up the assistant's own voice playing through the speaker, the voice-activity detector thinks the user spoke, and the model answers itself with filler ("yes, got it, sure").

Three rounds of fixes (echo flags, semantic VAD, manual mic-gating) did not solve it. The root cause is infrastructure, not the model.

> **The fix:** Production voice assistants (including OpenAI's own ChatGPT voice, which runs on LiveKit) use a **media server + server-side Krisp acoustic echo cancellation** with a **persistent agent worker**. We had none of that. The plan rebuilds the voice layer to match the production pattern.

- **LiveKit Cloud** — media server (SFU) + **Krisp BVC** (server-side echo cancellation). Krisp is what finally kills the echo. Included free on their Build tier.
- **Gemini Live** — speech-to-speech model. ~200ms latency, strong in noise, far cheaper than OpenAI. Free tier for Gemini API.
- **No server you run.** Push one file with the LiveKit CLI; they host and autoscale the agent worker.
- **Text chat is untouched.** Existing KB + guardrails are reused, not rewritten.

---

## 2. Architecture diagram

```
                  YOUR BROWSER (the website visitor)
          ┌─────────────────────────────────────────────────┐
          │   ChatWidget  ──►  VoicePanel  (Talk tab)         │
          │         │                                         │
          │         │  useRealtimeVoice.ts                    │
          │         │  (livekit-client SDK + native AEC)      │
          └─────────┼───────────────────────────────────────-┘
                    │
    (1) POST /api/realtime-session  ──────────────────► ┌─────────────────────────┐
        "give me a token to join"                        │  NEXT.JS on VERCEL       │
                    ◄────────────────────────────────── │  /api/realtime-session   │
    (2) { token, url, roomName }                         │  • same-origin check     │
                    │                                    │  • per-IP rate limit     │
                    │                                    │  • mints LiveKit JWT     │
                    │                                    └─────────────────────────┘
                    │  (3) room.connect(url, token)
                    ▼
     ┌───────────────────────────────────────────────────────────────┐
     │          LIVEKIT CLOUD  (ap-south / Mumbai)                    │
     │                                                               │
     │  WebRTC room  ◄────────── live mic audio ───────  browser     │
     │       │                                                       │
     │       │  (4) dispatches a job to the agent worker             │
     │       ▼                                                       │
     │  ┌──────────────────────────────────────────────────────┐    │
     │  │  AGENT WORKER  (your agent.ts, hosted by LiveKit)      │    │
     │  │                                                        │    │
     │  │  • Krisp BVC  ← the echo cancellation fix             │    │
     │  │  • buildVoiceInstructions()  ← your KB + guardrails   │    │
     │  │  • Gemini Live RealtimeModel  ◄──► GOOGLE API         │    │
     │  │  • greeting on session start                          │    │
     │  │  • authoritative 3-minute hard cap                    │    │
     │  └──────────────────────────────────────────────────────┘    │
     │       │                                                       │
     │       └──── assistant voice audio ──────────────►  browser   │
     │                                                               │
     └───────────────────────────────────────────────────────────────┘

KEY: No server of yours anywhere.
     Vercel  runs the tiny token route (/api/realtime-session).
     LiveKit runs the media server AND the agent worker.
     Google  runs Gemini.
     You only write code + push it.
```

### Who owns what

| Layer | Who hosts it | What you do |
|-------|-------------|-------------|
| Token route `/api/realtime-session` | Vercel (your existing host) | Stays on Next.js, just rewritten to mint a LiveKit JWT instead of an OpenAI token |
| Media server (WebRTC SFU + Krisp) | **LiveKit Cloud** | Nothing — it's managed; you create a project and paste the URL |
| Agent worker (Gemini session + guardrails) | **LiveKit Cloud** | Write one `agent.ts` file (~100 lines); deploy with `lk agent deploy` |
| Gemini Live model | **Google** | Create an API key in Google AI Studio |
| Browser SDK | Your repo | Replace `RTCPeerConnection` in `useRealtimeVoice.ts` with `livekit-client` |

---

## 3. Call flow (step by step)

```
  ① Visitor clicks "Talk" in the widget  [browser]

  ② Browser POSTs to /api/realtime-session
     — same-origin + rate-limit checked  [vercel]

  ③ Vercel mints a short-lived LiveKit JWT
     and returns { token, url, roomName }
     — no provider key in the response  [vercel]

  ④ Browser calls room.connect(url, token)
     and enables the mic — native AEC on  [browser]

  ⑤ LiveKit room is created; agent job is
     dispatched to the worker  [livekit cloud]

  ⑥ Agent opens Krisp BVC (noise + echo cancellation),
     loads guardrails from buildVoiceInstructions(),
     starts Gemini Live session  [agent worker] [gemini]

  ⑦ Agent speaks the greeting:
     "Hi! I'm the AI assistant for Bits AI Lab —
      how can I help you today?"  [browser hears it]

  ⑧ Visitor speaks → Krisp strips echo/noise
     → Gemini generates spoken answer
     → browser plays it back
     → natural back-and-forth  [echo-free ✓]

  ⑨ After 3 minutes the agent closes the session;
     browser shows "call ended" — next call blocked
     for 1 hour (rate limit)  [rate limit]
```

---

## 4. ⚡ What I need from you (5 values + 1 action)

To make this run end-to-end I need **5 values**. Everything else I generate. Paste these when you say "run this document."

> Do this before saying "run": Gather the 5 values below (takes ~10 min), and run `lk cloud auth` once in your terminal so the CLI is linked to your account. Then paste the values and say **"run this document and implement everything."** Everything else is automated.

| # | Value | Where to get it | Goes into |
|---|-------|-----------------|-----------|
| 1 | **`LIVEKIT_API_KEY`** | LiveKit Cloud → create a project (region **ap-south / Mumbai**) → Settings → Keys | Vercel + agent worker |
| 2 | **`LIVEKIT_API_SECRET`** | Same place as above — shown once, copy immediately | Vercel + agent worker |
| 3 | **`NEXT_PUBLIC_LIVEKIT_URL`** | LiveKit project WebSocket URL, looks like `wss://your-project-xxxx.livekit.cloud` | Vercel (public) |
| 4 | **`GOOGLE_API_KEY`** | [Google AI Studio](https://aistudio.google.com/apikey) → Create API key → enable the Gemini Live API / billing | Agent worker only |
| 5 | **LiveKit CLI auth** | Run `brew install livekit-cli` then `lk cloud auth` and approve in browser. One-time, links the CLI to your account. | Your machine |

**Also needed (action):** The OpenAI key was exposed in chat — rotate it. Go to platform.openai.com → API keys → delete the old one, create a new one, and update it in Vercel. Text chat still uses it.

### Account setup (one-time, ~10 min — do this before "run this document")

1. Go to livekit.io → sign up / log in → **Create project** → pick region **ap-south (Mumbai)**. Free Build tier, no card needed to start. Copy Values 1, 2, 3.
2. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Create API key. If prompted, enable the **Gemini Live API** and set up billing (Google may require it for Live API). Copy Value 4.
3. In your terminal: `brew install livekit-cli` (or the official installer if not on Mac). Then `lk cloud auth` and approve in browser. This is Value 5 / Action.

> **Security rule:** `GOOGLE_API_KEY` lives **only** in the agent worker environment on LiveKit Cloud — it never touches the browser or Vercel. The browser only ever gets a short-lived LiveKit JWT from `/api/realtime-session`.

---

## 5. The build — file by file

### File tree

```
bail-fe/
├── voice-agent/                          ← NEW (agent worker, deployed to LiveKit Cloud)
│   ├── package.json                      new
│   ├── agent.ts                          new — the live Gemini voice agent
│   ├── tsconfig.json                     new
│   └── livekit.toml                      new — region ap-south
├── src/app/api/realtime-session/
│   └── route.ts                          REWRITE — LiveKit JWT instead of OpenAI token
├── src/components/voice/
│   ├── useRealtimeVoice.ts               REWRITE — livekit-client, delete all mic-gating
│   └── VoicePanel.tsx                    minimal/no change (hook shape preserved)
├── src/lib/
│   ├── voice-config.ts                   EDIT — Gemini constants replace OpenAI ones
│   ├── knowledge-base.ts                 tiny EDIT — module-relative path so worker finds KB
│   ├── chat-prompt.ts                    reused unchanged (guardrails shared with agent)
│   └── *.ts                              all other lib files untouched
└── src/app/api/chat/                     text chat — untouched
```

### Step A — New `voice-agent/agent.ts` (the agent worker)

Uses `buildVoiceInstructions()` from existing `src/lib/chat-prompt.ts` (single source of guardrails + KB, no duplication). Sets up Gemini Live with `BackgroundVoiceCancellation()` (Krisp). Sends the greeting on start. Starts a 3-min timer → closes session.

```
voice-agent/package.json deps:
  @livekit/agents
  @livekit/agents-plugin-google
  @livekit/noise-cancellation-node
  dotenv
```

### Step B — Rewrite `src/app/api/realtime-session/route.ts`

Mints a **LiveKit JWT** (`AccessToken` from `livekit-server-sdk`) instead of an OpenAI ephemeral token. Returns `{ token, url, roomName }`.

Keeps existing same-origin check (403), Content-Type check (415), and per-IP rate limiter unchanged.

### Step C — Rewrite `src/components/voice/useRealtimeVoice.ts`

Replaces the raw `RTCPeerConnection` / SDP / data-channel / manual mic-gating with `livekit-client`. Keeps the **exact same hook return shape** so `VoicePanel.tsx` needs ~no change.

```
new Room({ audioCaptureDefaults: { echoCancellation, noiseSuppression, autoGainControl } })
→ fetch token from /api/realtime-session
→ room.connect(url, token)
→ room.localParticipant.setMicrophoneEnabled(true)
```

`toggleMute` → `setMicrophoneEnabled(!muted)`. Waveform driven off local mic track via Web Audio analyser.

### Step D — Edit `src/lib/voice-config.ts`

Replace OpenAI constants with:
- `GEMINI_REALTIME_MODEL = "gemini-2.5-flash-native-audio-preview"`
- `GEMINI_VOICE = "Aoede"`

Keep `MAX_CALL_SECONDS`, `CALLS_PER_HOUR`, `CALLS_PER_DAY`. The model is the single swap-point if we ever A/B OpenAI.

### Step E — Edit `src/lib/knowledge-base.ts`

Resolve the KB file path **relative to the module** (not `process.cwd()`) so both Next.js and the agent worker can find `doc/bits-ai-lab-knowledge-base.md` without any duplication.

### Step F — Env + deploy

- **Vercel:** add `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `NEXT_PUBLIC_LIVEKIT_URL`. (`OPENAI_API_KEY` stays — text chat still uses it.)
- **LiveKit Cloud:** deploy `voice-agent/` to **ap-south** with `lk agent deploy`; set agent secrets `GOOGLE_API_KEY`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`.

### Reused unchanged

`src/lib/chat-prompt.ts` (`buildVoiceInstructions`), `src/app/api/chat/route.ts`, `src/components/chat/ChatWidget.tsx` (Chat/Talk shell), text chat.

**Retired:** raw-WebRTC SDP flow + manual mic-gating (deleted in the hook rewrite).

---

## 6. Environment variables (final state)

| Variable | Where | Public? | Purpose |
|----------|-------|---------|---------|
| `LIVEKIT_API_KEY` | Vercel + agent worker | No | Sign / verify LiveKit JWTs |
| `LIVEKIT_API_SECRET` | Vercel + agent worker | No | Sign / verify LiveKit JWTs |
| `NEXT_PUBLIC_LIVEKIT_URL` | Vercel | Yes (wss URL only) | Browser uses this to connect to the room |
| `GOOGLE_API_KEY` | Agent worker only | **No — never browser** | Gemini Live auth (agent only) |
| `OPENAI_API_KEY` | Vercel | No | Text chat only (unchanged) — rotate this key first! |

---

## 7. Cost analysis

Gemini Live cost is identical whether you use LiveKit Cloud or self-host — it's Google's API billed by token: **~$0.005/min input + $0.018/min output ≈ ~₹5 per 3-min call**. Only the transport/hosting layer differs.

| Factor | LiveKit Cloud (Build, free) ✅ | Self-host on Railway ❌ |
|--------|-------------------------------|------------------------|
| Fixed monthly cost | **₹0** | ~₹4,000–5,000/mo (2 always-on services) |
| Per-call transport | **Free up to ~330 calls/mo**, then ~₹4/call | Folded into fixed cost |
| Krisp echo cancellation | ✅ included | ❌ Not available off-cloud (the dealbreaker) |
| Audio transport | UDP / WebRTC (full quality) | TCP-only on Railway (degraded) |
| Ops burden | Managed — nothing to patch | You patch/scale/monitor 2 servers |

> **Why self-hosting was rejected:** Krisp BVC for agent pipelines is **LiveKit Cloud only** — confirmed in their docs: "Enhanced noise cancellation is available when you use LiveKit Cloud for realtime transport." The open-source fallback (DTLN) is plain noise *suppression*, not acoustic echo cancellation — it would not fix loudspeaker echo, which is the exact failing scenario. Railway also runs WebRTC over TCP (no UDP), which degrades call quality. Self-hosting only wins on cost above ~500 concurrent sessions, which is far beyond an agency website.

### Monthly estimates

| Traffic (3-min cap) | LiveKit tier | Transport cost | + Gemini cost | Total/mo |
|--------------------|-------------|---------------|--------------|----------|
| ~200 calls (~600 min) | Build (free) | ₹0 | ~₹1,000 | **~₹1,000/mo** |
| ~330 calls (~990 min) | Build (free, ceiling) | ₹0 | ~₹1,650 | **~₹1,650/mo** |
| ~1,000 calls (~3,000 min) | Ship ($50/mo) | ~₹4,200 | ~₹5,000 | **~₹9,200/mo** |

---

## 8. Verification checklist (tested over HTTPS, on speakers)

This is the failing setup from before. If all 6 pass, it's done.

- [ ] Open widget → Talk → grant mic → **hear the greeting within ~1s.**
- [ ] Ask "What does Bits AI Lab do?" → concise, KB-grounded answer, **no echo, no self-answering** even on a loudspeaker in a noisy room.
- [ ] Run a fan or AC → Krisp BVC suppresses it; **no spurious turns** from background noise.
- [ ] Ask about price / phone number / founder name → **deflects to the contact form**, same as text chat.
- [ ] 3-min cap ends the call automatically. Make a 3rd call within an hour from one IP → **blocked at the token route (HTTP 429)**.
- [ ] Inspect the browser's network tab → **no provider key in any response**; only the LiveKit JWT from `/api/realtime-session`. `OPENAI_API_KEY` only used by text chat.

---

## 9. Open questions (defaults already chosen — change if you want)

| # | Question | Default | Alternatives |
|---|----------|---------|-------------|
| 1 | Gemini voice | `Aoede` (warm female) | `Kore`, `Puck`, `Charon` |
| 2 | LiveKit region | `ap-south (Mumbai)` — lowest latency for India | Any other LiveKit region |
| 3 | Call limits | 3-min cap · 2 calls/hour · 8 calls/day per IP | Change any number |
| 4 | Agent worker location | `voice-agent/` inside this repo (shares KB) | Separate repo |

---

## 10. Sources

- [OpenAI + LiveKit — ChatGPT Advanced Voice runs on LiveKit](https://livekit.com/blog/openai-livekit-partnership-advanced-voice-realtime-api)
- [Noise & echo cancellation (Krisp), Cloud-only for agents — LiveKit docs](https://docs.livekit.io/transport/media/noise-cancellation/)
- [LiveKit pricing — Build / Ship / Scale tiers](https://livekit.com/pricing)
- [Gemini Live API pricing — Google](https://ai.google.dev/gemini-api/docs/pricing)
- [LiveKit vs self-host cost analysis — Forasoft](https://www.forasoft.com/blog/article/livekit-vs-agora-cost-analysis)
- [Vapi web SDK — the alternative we compared against (no n8n required)](https://www.npmjs.com/package/@vapi-ai/web)

---

*BAIL AI Agency · Voice Assistant Plan · June 2026*

**When ready:** gather the 5 values above and say *"run this document and implement everything."*
