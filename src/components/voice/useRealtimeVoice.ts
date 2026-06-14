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

const REALTIME_ENDPOINT = "https://api.openai.com/v1/realtime/calls";
const BAR_COUNT = 32;

// Greeting sent immediately on session.created
const GREETING_INSTRUCTIONS =
  "Greet the user now, briefly and warmly, with exactly: " +
  '"Hi! I\'m the AI assistant for Bits AI Lab — how can I help you today?" ' +
  "Then stop and wait for them to speak.";

export function useRealtimeVoice(): UseRealtimeVoiceReturn {
  const [status, setStatus]             = useState<VoiceStatus>("idle");
  const [seconds, setSeconds]           = useState(0);
  const [levels, setLevels]             = useState<number[]>(Array(BAR_COUNT).fill(0));
  const [muted, setMuted]               = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pcRef              = useRef<RTCPeerConnection | null>(null);
  const dcRef              = useRef<RTCDataChannel | null>(null);
  const localStreamRef     = useRef<MediaStream | null>(null);
  const audioElRef         = useRef<HTMLAudioElement | null>(null);
  const analyserRef        = useRef<AnalyserNode | null>(null);
  const audioCtxRef        = useRef<AudioContext | null>(null);
  const animFrameRef       = useRef<number | null>(null);
  const timerRef           = useRef<ReturnType<typeof setInterval> | null>(null);
  const modelRef           = useRef<string>("gpt-realtime-mini");

  // ── Mic gating state ─────────────────────────────────────────────────────
  // micTrackRef: the mic audio track we gate on/off
  // mutedRef:    mirrors the `muted` state so refs stay in sync (no stale closures)
  // assistantSpeakingRef: true while output_audio_buffer.started has fired and
  //              output_audio_buffer.stopped (+ 250ms tail) has NOT yet fired
  // gateTimerRef: the tail-delay timer before we reopen the mic after assistant stops
  const micTrackRef           = useRef<MediaStreamTrack | null>(null);
  const mutedRef              = useRef(false);
  const assistantSpeakingRef  = useRef(false);
  const gateTimerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply the correct enabled state to the mic track:
  // enabled = user is NOT muted AND the assistant is NOT currently speaking.
  // This is the single source of truth for track.enabled; both toggleMute and
  // the gate call this instead of setting track.enabled directly.
  const syncTrack = useCallback(() => {
    const track = micTrackRef.current;
    if (!track) return;
    track.enabled = !mutedRef.current && !assistantSpeakingRef.current;
  }, []);

  // ── Waveform animation ──────────────────────────────────────────────────
  const animateWaveform = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const step = Math.max(1, Math.floor(data.length / BAR_COUNT));

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
        const raw = (data[i * step] ?? 0) / 255;
        // Suppress anything below the noise floor so the waveform reads flat during silence
        return raw > 0.15 ? raw : 0;
      });
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
    if (gateTimerRef.current !== null) {
      clearTimeout(gateTimerRef.current);
      gateTimerRef.current = null;
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
    micTrackRef.current = null;
    assistantSpeakingRef.current = false;
    mutedRef.current = false;
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

      // 2. Capture microphone.
      //    echoCancellation/noiseSuppression/autoGainControl are defense-in-depth
      //    (help in headphone setups); the primary echo fix is mic gating below.
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = stream;

      // Store the mic track for gating — this is the key to fixing the echo loop.
      // We gate this track off while the assistant is speaking so it physically
      // cannot hear its own output and respond to itself with "yes / got it / sure".
      micTrackRef.current = stream.getAudioTracks()[0] ?? null;

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

      // 5. Create audio element for assistant playback (kept off-DOM; matches
      //    the official OpenAI realtime-console reference implementation)
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

      // 7. Open data channel for Realtime API events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      // ── Data channel event handler ──────────────────────────────────────
      // Handles three things:
      //   a) session.created → trigger the greeting response
      //   b) output_audio_buffer.started → CLOSE the mic (assistant speaking)
      //   c) output_audio_buffer.stopped → OPEN the mic (250ms tail to let the
      //      last syllable's room echo die before VAD can re-fire)
      //
      // Why mic gating fixes the echo loop:
      //   Browser echoCancellation is unreliable on loudspeakers in a noisy room.
      //   When the assistant plays audio through the speaker, the mic picks it up,
      //   the VAD sees it as a user turn, and the model replies to its own voice
      //   with filler ("yes", "got it", "sure"). Disabling the track transmits
      //   silence to the server, so the VAD never fires on the assistant's output.
      dc.onmessage = (event: MessageEvent) => {
        try {
          const msg = JSON.parse(event.data as string) as { type: string };

          // a) Greeting: fire immediately when the session is ready.
          //    Do NOT pass `modalities` — "audio"+"text" together is invalid in GA.
          //    Omitting it lets the response inherit the session's audio-only output.
          if (msg.type === "session.created") {
            dc.send(
              JSON.stringify({
                type: "response.create",
                response: { instructions: GREETING_INSTRUCTIONS },
              })
            );
          }

          // b) Assistant started speaking → close the mic
          if (msg.type === "output_audio_buffer.started") {
            if (gateTimerRef.current) {
              clearTimeout(gateTimerRef.current);
              gateTimerRef.current = null;
            }
            assistantSpeakingRef.current = true;
            syncTrack();
          }

          // c) Assistant stopped speaking → schedule mic reopen after tail delay
          if (msg.type === "output_audio_buffer.stopped") {
            gateTimerRef.current = setTimeout(() => {
              gateTimerRef.current = null;
              assistantSpeakingRef.current = false;
              syncTrack(); // respects mutedRef — won't reopen if user manually muted
            }, 250);
          }
        } catch {
          // ignore malformed events
        }
      };

      // 8. SDP offer → send to OpenAI Realtime → apply answer.
      //    Append ?model= to match the official OpenAI realtime-console reference.
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        `${REALTIME_ENDPOINT}?model=${modelRef.current}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${client_secret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );
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
  }, [status, animateWaveform, cleanup, stop, syncTrack]);

  // ── Mute toggle ─────────────────────────────────────────────────────────
  // Uses mutedRef + syncTrack instead of directly flipping track.enabled, so
  // the gate and the manual mute never fight over the same property.
  const toggleMute = useCallback(() => {
    if (!localStreamRef.current) return;
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    syncTrack(); // applies !mutedRef.current && !assistantSpeakingRef.current
  }, [syncTrack]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return { status, seconds, levels, muted, errorMessage, start, stop, toggleMute };
}
