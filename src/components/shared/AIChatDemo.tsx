"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const SCRIPT: Message[] = [
  {
    role: "user",
    text: "Hi, I need help tracking down a lead who filled our form but never replied.",
  },
  {
    role: "ai",
    text: "Got it. I can set up a 14-day automated WhatsApp follow-up sequence for exactly this scenario. What's your business — B2B or B2C?",
  },
  {
    role: "user",
    text: "B2B — we sell SaaS to Indian SMBs.",
  },
  {
    role: "ai",
    text: "Perfect. I'll build a sequence: Day 1 intro, Day 3 value nudge, Day 7 social proof, Day 14 final offer. Should I add a qualification question to filter serious buyers?",
  },
  {
    role: "user",
    text: "Yes please! Also can it book a demo call automatically?",
  },
  {
    role: "ai",
    text: "Absolutely — I'll add Calendly integration so qualified leads auto-book a slot. Setup takes about 3 days. Want me to show you a live demo of the flow?",
  },
];

const CHAR_DELAY = 30; // ms per character
const MESSAGE_GAP = 800; // ms between messages
const LOOP_DELAY = 3000; // ms before restarting

export default function AIChatDemo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [visibleMessages, setVisibleMessages] = useState<
    { role: "user" | "ai"; text: string; partial: boolean }[]
  >([]);
  const animating = useRef(false);
  const stopped = useRef(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const runScript = useCallback(async () => {
    if (animating.current || stopped.current) return;
    animating.current = true;

    // Clear messages
    setVisibleMessages([]);

    for (let i = 0; i < SCRIPT.length; i++) {
      if (stopped.current) break;

      const msg = SCRIPT[i];

      // Add empty bubble placeholder
      setVisibleMessages((prev) => [
        ...prev,
        { role: msg.role, text: "", partial: true },
      ]);

      // Type character by character
      for (let c = 1; c <= msg.text.length; c++) {
        if (stopped.current) break;
        await new Promise<void>((resolve) => setTimeout(resolve, CHAR_DELAY));
        if (stopped.current) return;
        setVisibleMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: msg.role,
            text: msg.text.slice(0, c),
            partial: c < msg.text.length,
          };
          return updated;
        });
        scrollToBottom();
      }

      // Mark message complete
      setVisibleMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: msg.role,
          text: msg.text,
          partial: false,
        };
        return updated;
      });

      // Gap before next message
      if (i < SCRIPT.length - 1) {
        await new Promise<void>((resolve) => setTimeout(resolve, MESSAGE_GAP));
        if (stopped.current) return;
      }
    }

    // Wait then loop
    animating.current = false;
    if (!stopped.current) {
      await new Promise<void>((resolve) => setTimeout(resolve, LOOP_DELAY));
      if (stopped.current) return;
      runScript();
    }
  }, []);

  useEffect(() => {
    stopped.current = false;
    animating.current = false;

    if (prefersReducedMotion) {
      // Show all messages statically
      setVisibleMessages(
        SCRIPT.map((m) => ({ role: m.role, text: m.text, partial: false }))
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animating.current) {
          runScript();
        }
      },
      { threshold: 0.3 }
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);

    return () => {
      stopped.current = true;
      observer.disconnect();
    };
  }, [runScript, prefersReducedMotion]);

  return (
    <div
      ref={wrapperRef}
      className="rounded-2xl overflow-hidden max-w-sm w-full"
      style={{ background: "var(--ink-3)" }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-bail-orange/20 flex items-center justify-center text-bail-orange text-xs font-bold">
          AI
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-semibold leading-none">
            Bits AI Lab · AI Assistant
          </p>
        </div>
        <span className="flex items-center gap-1 text-xs text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Online
        </span>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="px-4 py-4 flex flex-col gap-3 max-h-80 overflow-y-auto">
        {visibleMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col gap-0.5 ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`rounded-2xl px-3 py-2 text-sm text-white max-w-[85%] leading-relaxed ${
                msg.role === "user"
                  ? "bg-bail-orange/80 rounded-br-sm"
                  : "bg-white/10 rounded-bl-sm"
              }`}
            >
              {msg.text}
              {msg.partial && (
                <span className="inline-block w-0.5 h-4 bg-white/70 ml-0.5 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] text-white/30 px-1">just now</span>
          </div>
        ))}
        <div />
      </div>
    </div>
  );
}
