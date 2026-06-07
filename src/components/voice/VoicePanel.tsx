"use client";

import React from "react";
import { Mic, MicOff, PhoneOff, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRealtimeVoice, type VoiceStatus } from "./useRealtimeVoice";
import { MAX_CALL_SECONDS } from "@/lib/voice-config";

// ── Helpers ────────────────────────────────────────────────────────────────
function formatTime(s: number): string {
  const m   = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function statusCopy(status: VoiceStatus, muted: boolean): string {
  switch (status) {
    case "idle":       return "Tap the mic to start talking";
    case "connecting": return "Connecting…";
    case "live":       return muted ? "Microphone muted" : "Listening…";
    case "ending":     return "Ending call…";
    case "error":      return "Call ended";
  }
}

// ── Live waveform ──────────────────────────────────────────────────────────
function Waveform({ levels, active }: { levels: number[]; active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-[2px] h-16 w-full">
      {levels.map((v, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: active ? `${Math.max(4, v * 64)}px` : "4px",
            background: active
              ? `rgba(237,130,28,${0.3 + v * 0.7})`
              : "rgba(255,255,255,0.10)",
            transition: "height 80ms ease, background 80ms ease",
          }}
        />
      ))}
    </div>
  );
}

// ── Main VoicePanel ────────────────────────────────────────────────────────
export default function VoicePanel() {
  const {
    status,
    seconds,
    levels,
    muted,
    errorMessage,
    start,
    stop,
    toggleMute,
  } = useRealtimeVoice();

  const isLive       = status === "live";
  const isConnecting = status === "connecting";
  const canStart     = status === "idle" || status === "error";
  const remaining    = MAX_CALL_SECONDS - seconds;

  return (
    <div className="flex flex-col items-center h-full py-6 px-4 gap-4">

      {/* ── Status + timer ── */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          {isLive && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "#34d399",
                boxShadow: "0 0 6px #34d399",
                animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
          )}
          {isConnecting && (
            <span
              className="h-2 w-2 rounded-full border-2 border-[var(--bail-orange)] border-t-transparent"
              style={{ animation: "voiceSpin 0.8s linear infinite" }}
            />
          )}
          <span className="text-xs text-white/45">{statusCopy(status, muted)}</span>
        </div>

        {isLive && (
          <div className="flex flex-col items-center mt-1">
            <span className="text-3xl font-mono font-semibold text-white/85 tabular-nums tracking-tight">
              {formatTime(seconds)}
            </span>
            {remaining <= 60 && (
              <span className="text-[10px] text-amber-400/70 mt-0.5">
                {remaining}s remaining
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Waveform (fills available space) ── */}
      <div className="flex-1 flex items-center justify-center w-full min-h-0">
        <Waveform levels={levels} active={isLive} />
      </div>

      {/* ── Idle hint ── */}
      {(status === "idle") && (
        <p className="text-xs text-white/30 text-center px-4 -mt-2">
          Speak directly with our AI assistant — sports-coach energy, same expert answers.
        </p>
      )}

      {/* ── Error / limit message ── */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 w-full px-3 py-2.5 rounded-xl text-xs text-amber-300/80 flex-shrink-0"
          style={{
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.15)",
          }}
        >
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* ── Controls ── */}
      <div className="flex items-center gap-5 flex-shrink-0">
        {/* Mute — only shown while live */}
        {isLive && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={toggleMute}
            aria-label={muted ? "Unmute microphone" : "Mute microphone"}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none"
            style={{
              background: muted ? "rgba(239,68,68,0.14)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${muted ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.09)"}`,
            }}
          >
            {muted ? (
              <MicOff size={16} color="#f87171" />
            ) : (
              <Mic size={16} color="rgba(255,255,255,0.55)" />
            )}
          </motion.button>
        )}

        {/* Primary mic / end-call button */}
        <motion.button
          whileHover={{ scale: canStart || isLive ? 1.07 : 1 }}
          whileTap={{ scale: canStart || isLive ? 0.93 : 1 }}
          onClick={isLive ? stop : canStart ? start : undefined}
          disabled={isConnecting || status === "ending"}
          aria-label={isLive ? "End voice call" : "Start voice call"}
          className="flex h-16 w-16 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bail-orange)] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isLive
              ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
              : isConnecting
              ? "rgba(237,130,28,0.25)"
              : "linear-gradient(135deg, #ed821c 0%, #c96a10 100%)",
            boxShadow: isLive
              ? "0 4px 24px rgba(239,68,68,0.38)"
              : isConnecting
              ? "none"
              : "0 4px 24px rgba(237,130,28,0.38)",
          }}
        >
          {isConnecting ? (
            <span
              className="h-6 w-6 rounded-full border-[2.5px] border-white/70 border-t-transparent"
              style={{ animation: "voiceSpin 0.8s linear infinite" }}
            />
          ) : isLive ? (
            <PhoneOff size={22} color="white" />
          ) : (
            <Mic size={22} color="white" />
          )}
        </motion.button>

        {/* Invisible spacer keeps mic centred when mute button is hidden */}
        {isLive && <div className="h-10 w-10" aria-hidden />}
      </div>

      {/* ── Fine print ── */}
      <p className="text-center text-[10px] text-white/18 select-none flex-shrink-0">
        Max 3 min per call · Powered by Bits AI Lab
      </p>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes voiceSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
