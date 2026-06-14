import { NextRequest, NextResponse } from "next/server";
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
    // 1. Same-origin check
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

    // 4. Mint ephemeral token via direct fetch to the GA client_secrets endpoint.
    //    We bypass the OpenAI SDK here because the SDK v6.42 still calls the
    //    old /realtime/sessions path which returns 404 since the May 2026 GA release.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("[realtime-session] OPENAI_API_KEY not set");
      return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
    }

    const instructions = await buildVoiceInstructions();

    const openaiRes = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model: REALTIME_MODEL,
            instructions,
            audio: {
              output: { voice: REALTIME_VOICE },
              input: {
                // far_field optimises the server-side noise reduction for a
                // speakerphone / loudspeaker setup (mic at a distance from the
                // speaker). If the client_secrets endpoint rejects this with
                // "Unknown parameter", remove noise_reduction and keep the rest.
                noise_reduction: { type: "far_field" },
                turn_detection: {
                  // semantic_vad uses the model to detect speech intent rather than
                  // raw volume — far more robust against fan/AC noise and room echo
                  // fragments than server_vad with a volume threshold.
                  type: "semantic_vad",
                  eagerness: "high", // respond quickly once the user finishes speaking
                  // interrupt_response: false because the mic is gated off while the
                  // assistant speaks — barge-in is not possible and not needed.
                  interrupt_response: false,
                },
              },
            },
          },
        }),
      }
    );

    if (!openaiRes.ok) {
      const errBody = await openaiRes.text();
      console.error(
        `[realtime-session] OpenAI ${openaiRes.status}:`,
        errBody
      );
      return NextResponse.json(
        { error: "Could not create voice session. Please try again." },
        { status: 502 }
      );
    }

    // New GA response: ephemeral token is at data.value (not data.client_secret.value)
    const data = (await openaiRes.json()) as {
      value: string;
      expires_at: number;
    };

    return NextResponse.json({
      client_secret: data.value,
      expires_at: data.expires_at,
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
