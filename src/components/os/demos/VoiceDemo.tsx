"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRealtimeVoice } from "@/components/voice/useRealtimeVoice";
import { VOICE_SESSION } from "../products";

// Two ways in: replay a recorded session (transcript synced to audio), or
// talk to the live agent (existing realtime voice hook).
export default function VoiceDemo() {
  const live = useRealtimeVoice();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0); // seconds into the session

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    const id = setInterval(() => {
      const now = VOICE_SESSION.audio && audio.current ? audio.current.currentTime : (performance.now() - start) / 1000;
      if (now >= VOICE_SESSION.duration || audio.current?.ended) setPlaying(false);
      else setT(now);
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  const isLive = live.status === "live" || live.status === "connecting";

  const togglePlay = () => {
    if (playing) { audio.current?.pause(); setPlaying(false); return; }
    if (isLive) live.stop();
    if (audio.current) { audio.current.currentTime = 0; audio.current.play().catch(() => {}); }
    setT(0);
    setPlaying(true);
  };
  const toggleLive = () => {
    if (isLive) { live.stop(); return; }
    audio.current?.pause();
    setPlaying(false);
    live.start();
  };

  let idx = -1;
  if (playing) VOICE_SESSION.lines.forEach((l, i) => { if (l.t <= t) idx = i; });
  const line = idx >= 0 ? VOICE_SESSION.lines[idx] : null;
  const level = isLive ? live.levels.reduce((a, b) => a + b, 0) / live.levels.length : 0;
  const speaking = playing ? line?.who : isLive && level > 0.05 ? "agent" : null;

  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-5 text-center">
      {VOICE_SESSION.audio && <audio ref={audio} src={VOICE_SESSION.audio} preload="metadata" />}

      {/* orb */}
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60 transition-colors duration-300"
          style={{ background: speaking === "caller" ? "#ffffff" : "var(--accent)", transform: `scale(${1 + level * 0.8})` }}
        />
        <div
          className="absolute inset-0 rounded-full border border-white/20"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${speaking === "caller" ? "#ffffff" : "var(--accent)"}, #0a0a0a 70%)`,
            animation: speaking ? "os-talk 0.6s ease-in-out infinite" : "os-breathe 4s ease-in-out infinite",
            transform: isLive ? `scale(${1 + level * 0.5})` : undefined,
          }}
        />
      </div>

      {/* transcript */}
      <div className="min-h-[64px] max-w-md">
        <AnimatePresence mode="wait">
          {line ? (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="os-display text-xl sm:text-2xl leading-snug"
            >
              <span className="os-label block mb-1">{line.who === "agent" ? "bail voice" : "caller"}</span>
              {line.text}
            </motion.p>
          ) : (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-sm">
              {live.status === "connecting" ? "connecting…" : isLive ? "listening — go ahead, speak" : live.errorMessage ?? "hear a real call, or talk to the agent yourself."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={togglePlay} className="os-btn">
          {playing ? "■ stop" : "▶ hear a real call"}
        </button>
        <button onClick={toggleLive} className="os-btn ghost">
          {isLive ? "end call" : "● talk to it live"}
        </button>
      </div>
      {!VOICE_SESSION.audio && <p className="os-label">preview transcript · recording coming soon</p>}
    </div>
  );
}
