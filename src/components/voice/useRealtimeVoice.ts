"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { MAX_CALL_SECONDS } from "@/lib/voice-config";

export type VoiceStatus = "idle" | "connecting" | "live" | "ending" | "error";

export interface UseRealtimeVoiceReturn {
  status: VoiceStatus;
  seconds: number;
  levels: number[]; // 0–1 amplitude per bar (BAR_COUNT bars)
  muted: boolean;
  errorMessage: string | null;
  start: () => Promise<void>;
  stop: () => void;
  toggleMute: () => void;
}

const REALTIME_ENDPOINT = "https://api.openai.com/v1/realtime";
const BAR_COUNT = 32;

export function useRealtimeVoice(): UseRealtimeVoiceReturn {
  const [status, setStatus]           = useState<VoiceStatus>("idle");
  const [seconds, setSeconds]         = useState(0);
  const [levels, setLevels]           = useState<number[]>(Array(BAR_COUNT).fill(0));
  const [muted, setMuted]             = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pcRef           = useRef<RTCPeerConnection | null>(null);
  const dcRef           = useRef<RTCDataChannel | null>(null);
  const localStreamRef  = useRef<MediaStream | null>(null);
  const audioElRef      = useRef<HTMLAudioElement | null>(null);
  const analyserRef     = useRef<AnalyserNode | null>(null);
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const animFrameRef    = useRef<number | null>(null);
  const timerRef        = useRef<ReturnType<typeof setInterval> | null>(null);
  const modelRef        = useRef<string>("gpt-4o-mini-realtime-preview");

  // ── Waveform animation ──────────────────────────────────────────────────
  const animateWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const step = Math.max(1, Math.floor(data.length / BAR_COUNT));

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bars = Array.from({ length: BAR_COUNT }, (_, i) =>
        (data[i * step] ?? 0) / 255
      );
      setLevels(bars);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Full teardown ───────────────────────────────────────────────────────
  const cleanup = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    dcRef.current?.close();
    dcRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    if (audioElRef.current) {
      audioElRef.current.srcObject = null;
    }
    analyserRef.current = null;
    setLevels(Array(BAR_COUNT).fill(0));
    setSeconds(0);
    setMuted(false);
  }, []);

  // ── Stop call ───────────────────────────────────────────────────────────
  const stop = useCallback(() => {
    setStatus("ending");
    cleanup();
    setStatus("idle");
  }, [cleanup]);

  // ── Start call ──────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (status !== "idle" && status !== "error") return;
    setStatus("connecting");
    setErrorMessage(null);

    try {
      // 1. Get ephemeral token from our server-side route
      const tokenRes = await fetch("/api/realtime-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!tokenRes.ok) {
        const data = await tokenRes.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error ??
            `Session error (${tokenRes.status})`
        );
      }
      const { client_secret, model } = (await tokenRes.json()) as {
        client_secret: string;
        model: string;
      };
      modelRef.current = model;

      // 2. Capture microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;

      // 3. RTCPeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 4. Wire AnalyserNode on mic for waveform visualisation
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      // 5. Create audio element for assistant playback (kept off-DOM)
      if (!audioElRef.current) {
        audioElRef.current = document.createElement("audio");
        audioElRef.current.autoplay = true;
      }
      pc.ontrack = (event) => {
        if (audioElRef.current) {
          audioElRef.current.srcObject = event.streams[0];
        }
      };

      // 6. Add mic tracks to the peer connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 7. Open data channel for Realtime API events (transcript, errors, etc.)
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      // Optionally: dc.onmessage = (e) => { ... JSON.parse(e.data) ... }

      // 8. SDP offer → send to OpenAI Realtime → apply answer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(`${REALTIME_ENDPOINT}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${client_secret}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });
      if (!sdpRes.ok) {
        throw new Error(`SDP exchange failed (${sdpRes.status})`);
      }
      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      // 9. Go live
      setStatus("live");
      animateWaveform();

      // 10. Elapsed-time counter + hard 3-min cap
      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed++;
        setSeconds(elapsed);
        if (elapsed >= MAX_CALL_SECONDS) {
          setErrorMessage(
            "Call ended — 3-minute limit reached. Thanks for chatting with us!"
          );
          // stop() will flip status back to idle after cleanup
          stop();
        }
      }, 1_000);
    } catch (err: unknown) {
      cleanup();
      setErrorMessage(
        err instanceof Error ? err.message : "Could not start voice call."
      );
      setStatus("error");
    }
  }, [status, animateWaveform, cleanup, stop]);

  // ── Mute toggle ─────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMuted((v) => !v);
  }, []);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { status, seconds, levels, muted, errorMessage, start, stop, toggleMute };
}
