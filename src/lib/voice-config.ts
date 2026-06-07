// ── Voice assistant config — one place to change everything ──────────────
//
// REALTIME_MODEL: switch between mini (cheap) and full (higher quality)
//   "gpt-4o-mini-realtime-preview"      ← current (cheaper, fast)
//   "gpt-4o-realtime-preview"           ← flagship (~3× costlier)
//
// REALTIME_VOICE: any of the 10 Realtime-supported voices:
//   alloy, ash, ballad, coral, echo, sage, shimmer, verse, marin, cedar
//
// MAX_CALL_SECONDS: hard call-length cap enforced by a client timer.
// CALLS_PER_HOUR / CALLS_PER_DAY: per-IP limits enforced server-side
//   (ephemeral token minting is the gate — no token = no call).

export const REALTIME_MODEL =
  "gpt-4o-mini-realtime-preview" as const;

export const REALTIME_VOICE = "coral" as const;

export const MAX_CALL_SECONDS = 180; // 3 minutes

export const CALLS_PER_HOUR = 2;
export const CALLS_PER_DAY  = 8;
