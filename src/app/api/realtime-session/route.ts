import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildVoiceInstructions } from "@/lib/chat-prompt";
import {
  REALTIME_MODEL,
  REALTIME_VOICE,
  CALLS_PER_HOUR,
  CALLS_PER_DAY,
} from "@/lib/voice-config";

// Token minting is fast; 15 s is generous.
export const maxDuration = 15;

// ── In-memory per-IP rate limiter (mirrors chat route pattern) ─────────────
interface VoiceRateEntry {
  hour: number;
  hourReset: number;
  day: number;
  dayReset: number;
}
const voiceRateMap = new Map<string, VoiceRateEntry>();

function checkVoiceRate(ip: string): "ok" | "hour" | "day" {
  const now = Date.now();

  // Prune stale entries so memory stays bounded
  if (voiceRateMap.size > 5_000) {
    for (const [k, v] of voiceRateMap) {
      if (v.dayReset < now) voiceRateMap.delete(k);
    }
  }

  const e = voiceRateMap.get(ip);
  if (!e || e.dayReset < now) {
    voiceRateMap.set(ip, {
      hour: 1,
      hourReset: now + 3_600_000,
      day: 1,
      dayReset: now + 86_400_000,
    });
    return "ok";
  }

  // Reset hourly bucket if window expired
  if (e.hourReset < now) {
    e.hour = 0;
    e.hourReset = now + 3_600_000;
  }

  if (e.hour >= CALLS_PER_HOUR) return "hour";
  if (e.day  >= CALLS_PER_DAY)  return "day";

  e.hour++;
  e.day++;
  return "ok";
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Same-origin check — blocks external scripts
    const origin = req.headers.get("origin");
    if (origin) {
      const host = req.headers.get("host") ?? "";
      let originHost = "";
      try { originHost = new URL(origin).host; } catch { /* malformed */ }
      if (originHost !== host) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
    }

    // 2. Content-Type must be JSON
    const ct = req.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json." },
        { status: 415 }
      );
    }

    // 3. Rate limit
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateResult = checkVoiceRate(ip);
    if (rateResult === "hour") {
      return NextResponse.json(
        {
          error:
            "Voice call limit reached. You can start 2 calls per hour — please wait before trying again.",
        },
        { status: 429, headers: { "Retry-After": "3600" } }
      );
    }
    if (rateResult === "day") {
      return NextResponse.json(
        { error: "Daily voice call limit reached. Please try again tomorrow." },
        { status: 429, headers: { "Retry-After": "86400" } }
      );
    }

    // 4. Mint ephemeral token.
    //    Key is read here (inside the handler) — not at module top-level —
    //    so the route is build-safe even if the env var is absent at build time.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[realtime-session] OPENAI_API_KEY not set");
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey });
    const instructions = await buildVoiceInstructions();

    const session = await openai.beta.realtime.sessions.create({
      model: REALTIME_MODEL,
      voice: REALTIME_VOICE,
      instructions,
      modalities: ["audio", "text"],
      turn_detection: { type: "server_vad" },
      max_response_output_tokens: 400, // keep voice replies short
      temperature: 0.8,               // recommended for audio models
    });

    return NextResponse.json({
      client_secret: session.client_secret.value,
      expires_at: session.client_secret.expires_at,
      model: REALTIME_MODEL,
      voice: REALTIME_VOICE,
    });
  } catch (err) {
    console.error("[realtime-session] error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
