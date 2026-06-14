import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat-prompt";

export const maxDuration = 30;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Abuse limits ───────────────────────────────────────────────────────────
const MAX_BODY_BYTES      = 12_288;  // 12 KB — reject oversized bodies before parsing
const MAX_HISTORY         = 10;      // last 10 messages sent to OpenAI (~5 exchanges)
const MAX_MSG_CHARS       = 800;     // per message (widget caps at 600; server is generous)
const MAX_TOTAL_CHARS     = 4_000;   // all messages combined (~1 k tokens of user input)
const MAX_OUTPUT_TOKENS   = 800;     // hard cap on generated response length
const RATE_PER_MIN        = 15;      // requests per IP per minute
const RATE_PER_DAY        = 150;     // requests per IP per day

// ── In-memory rate limiter ─────────────────────────────────────────────────
interface RateEntry { min: number; minReset: number; day: number; dayReset: number }
const rateMap = new Map<string, RateEntry>();

function checkRate(ip: string): "ok" | "minute" | "day" {
  const now = Date.now();

  // Prune stale entries to keep memory bounded
  if (rateMap.size > 5_000) {
    for (const [k, v] of rateMap) {
      if (v.dayReset < now) rateMap.delete(k);
    }
  }

  const e = rateMap.get(ip);
  if (!e || e.dayReset < now) {
    rateMap.set(ip, { min: 1, minReset: now + 60_000, day: 1, dayReset: now + 86_400_000 });
    return "ok";
  }

  // Reset per-minute bucket if window expired
  if (e.minReset < now) { e.min = 0; e.minReset = now + 60_000; }

  if (e.min  >= RATE_PER_MIN) return "minute";
  if (e.day  >= RATE_PER_DAY) return "day";

  e.min++;
  e.day++;
  return "ok";
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Same-origin check — blocks external scripts from calling this endpoint
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
      return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
    }

    // 3. Body size guard — reject before parsing
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    // 4. Rate limit (per-minute + per-day)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateResult = checkRate(ip);
    if (rateResult === "minute") {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    if (rateResult === "day") {
      return NextResponse.json(
        { error: "Daily message limit reached. Please try again tomorrow." },
        { status: 429, headers: { "Retry-After": "86400" } }
      );
    }

    // 5. Parse body
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "messages array is required." }, { status: 400 });
    }

    // 6. Validate and cap history
    const rawMessages: { role: string; content: string }[] = body.messages.slice(-MAX_HISTORY);

    // Last message must be from the user (prevents assistant-only context injection)
    if (rawMessages[rawMessages.length - 1]?.role !== "user") {
      return NextResponse.json({ error: "Last message must be from the user." }, { status: 400 });
    }

    // Role and per-message length validation (length cap applies to user messages only)
    const validShape = rawMessages.every(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0 &&
        (m.role !== "user" || m.content.length <= MAX_MSG_CHARS)
    );
    if (!validShape) {
      return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
    }

    // Total conversation size guard
    const totalChars = rawMessages.reduce((sum, m) => sum + m.content.length, 0);
    if (totalChars > MAX_TOTAL_CHARS) {
      return NextResponse.json({ error: "Conversation too long." }, { status: 400 });
    }

    // 7. Build system prompt (KB memoized — read once per warm instance)
    const systemPrompt = await buildSystemPrompt();

    // System prompt goes first and byte-identical across requests so OpenAI
    // automatic prompt caching hits (~50% discount after the first call).
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...rawMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // 8. Stream completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages,
      max_tokens: MAX_OUTPUT_TOKENS, // hard cap on output length
      temperature: 0.4,
    });

    // Pipe OpenAI async iterable → Web ReadableStream → Response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "X-Accel-Buffering": "no",
        "Cache-Control": "no-cache, no-store",
      },
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
