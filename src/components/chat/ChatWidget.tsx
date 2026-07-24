"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, ArrowRight, Mic } from "lucide-react";
import ReactMarkdown from "react-markdown";
import VoicePanel from "@/components/voice/VoicePanel";

// ── Types ──────────────────────────────────────────────────────────────────
type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

// ── Constants ──────────────────────────────────────────────────────────────
const GREETING_ID = "__greeting__";
const MAX_INPUT_CHARS = 600;
const MAX_HISTORY_MESSAGES = 20; // Keep last 20 in context

const GREETING: Message = {
  id: GREETING_ID,
  role: "assistant",
  content:
    "Hi there 👋 I'm the Bits AI Lab assistant. Ask me anything about our services, how we work, or describe a problem you're trying to solve — I'll map it to what we can build for you.",
};

const QUICK_PROMPTS = [
  "What services do you offer?",
  "How does the process work?",
  "Can you build a WhatsApp chatbot?",
];

// ── Streaming dots ─────────────────────────────────────────────────────────
function StreamingDots() {
  return (
    <span className="flex items-center gap-1 h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full"
          style={{
            background: "var(--bail-orange)",
            opacity: 0.6,
            animation: `chatDotBounce 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

// ── Markdown renderer styled for the dark chat bubble ─────────────────────
function BotText({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        // Headings
        h1: ({ children }) => (
          <p className="font-bold text-white/95 text-base mb-1 mt-2 first:mt-0">{children}</p>
        ),
        h2: ({ children }) => (
          <p className="font-semibold text-white/90 text-sm mb-1 mt-2 first:mt-0">{children}</p>
        ),
        h3: ({ children }) => (
          <p className="font-semibold text-white/85 text-sm mb-0.5 mt-1.5 first:mt-0">{children}</p>
        ),
        // Paragraph — tight spacing inside a chat bubble
        p: ({ children }) => (
          <p className="mb-1.5 last:mb-0 leading-relaxed">{children}</p>
        ),
        // Bold / italic
        strong: ({ children }) => (
          <strong className="font-semibold text-white/95">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-white/75">{children}</em>
        ),
        // Unordered list
        ul: ({ children }) => (
          <ul className="mb-1.5 last:mb-0 space-y-0.5 pl-1">{children}</ul>
        ),
        // Ordered list
        ol: ({ children }) => (
          <ol className="mb-1.5 last:mb-0 space-y-1 pl-1 list-decimal list-inside text-white/80">
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => {
          // ordered lists get a number from list-inside; unordered get our orange dot
          const isOrdered = (props as { ordered?: boolean }).ordered;
          return isOrdered ? (
            <li className="text-white/80 leading-relaxed">{children}</li>
          ) : (
            <li className="flex gap-2 text-white/80 leading-relaxed">
              <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--bail-orange)]" aria-hidden />
              <span>{children}</span>
            </li>
          );
        },
        // Inline code
        code: ({ children, className }) => {
          const isBlock = className?.includes("language-");
          return isBlock ? (
            <code className="block w-full rounded-lg bg-black/40 px-3 py-2 text-xs text-white/70 font-mono whitespace-pre-wrap my-1.5">
              {children}
            </code>
          ) : (
            <code className="rounded bg-black/30 px-1 py-0.5 text-xs text-[var(--bail-orange)] font-mono">
              {children}
            </code>
          );
        },
        // Code block wrapper
        pre: ({ children }) => (
          <pre className="overflow-x-auto rounded-lg bg-black/40 my-1.5">{children}</pre>
        ),
        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[var(--bail-orange)]/40 pl-3 my-1.5 text-white/60 italic">
            {children}
          </blockquote>
        ),
        // Horizontal rule
        hr: () => (
          <hr className="my-2 border-white/10" />
        ),
        // Links — open in new tab, styled orange
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--bail-orange)] underline underline-offset-2 hover:text-[var(--bail-orange)]/80"
          >
            {children}
          </a>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Listen for external "open-chat" event
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-chat", handleOpen);
    return () => window.removeEventListener("open-chat", handleOpen);
  }, []);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => {
        (inputRef.current ?? textareaRef.current)?.focus();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Auto-resize textarea
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`; // cap at ~4 lines
  };

  const send = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg || streaming) return;

      if (!hasInteracted) setHasInteracted(true);

      const userMsg: Message = {
        role: "user",
        id: `u-${Date.now()}-${Math.random()}`,
        content: msg,
      };
      const asstMsg: Message = {
        role: "assistant",
        id: `a-${Date.now()}-${Math.random()}`,
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, asstMsg]);
      setInput("");
      setError(null);
      setStreaming(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Build API messages: exclude the greeting, send only real history
      const history = [...messages, userMsg].filter(
        (m) => m.id !== GREETING_ID
      );
      const apiMessages = history
        .slice(-MAX_HISTORY_MESSAGES)
        .map(({ role, content }) => ({ role, content }));

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error ??
              `Request failed (${res.status})`
          );
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snapshot = acc;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === asstMsg.id ? { ...m, content: snapshot } : m
            )
          );
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
        // Remove the empty assistant placeholder
        setMessages((prev) => prev.filter((m) => m.id !== asstMsg.id));
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [input, messages, streaming, hasInteracted]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleClose = () => {
    abortRef.current?.abort();
    setOpen(false);
  };

  const lastMsgId = messages[messages.length - 1]?.id;

  return (
    <>
      {/* ── Keyframe injected once ── */}
      <style>{`
        @keyframes chatDotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      {/* ── Floating launcher button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Bits AI Lab assistant"}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bail-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{
          background: "linear-gradient(135deg, #ed821c 0%, #c96a10 100%)",
          boxShadow:
            "0 4px 24px rgba(237,130,28,0.45), 0 1px 4px rgba(0,0,0,0.4)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X size={20} color="white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageSquare size={20} color="white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            role="dialog"
            aria-label="Bits AI Lab chat"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-24 right-6 z-[60] flex flex-col overflow-hidden rounded-2xl"
            style={{
              width: "min(380px, calc(100vw - 24px))",
              height: "min(560px, calc(100dvh - 110px))",
              background: "var(--ink-2)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Header */}
            <div
              className="flex flex-shrink-0 items-center gap-3 px-4 py-3"
              style={{
                background: "var(--ink)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: "rgba(237,130,28,0.12)",
                  border: "1px solid rgba(237,130,28,0.3)",
                }}
              >
                <Bot size={15} color="var(--bail-orange)" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white/90 leading-none truncate">
                  Bits AI Lab
                </p>
                <p className="text-[11px] text-white/40 mt-0.5 leading-none">
                  AI Assistant · Ask me anything
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: "#34d399",
                    boxShadow: "0 0 6px #34d399",
                    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                />
                <span className="text-[11px] text-white/35">Online</span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close chat"
                className="ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/60 focus:outline-none"
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Chat / Talk toggle ── */}
            <div
              className="flex-shrink-0 flex items-center justify-center px-4 py-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="flex rounded-lg p-[3px]"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {(["chat", "voice"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-150 focus:outline-none"
                    style={{
                      background:
                        mode === m ? "rgba(237,130,28,0.14)" : "transparent",
                      color:
                        mode === m
                          ? "var(--bail-orange)"
                          : "rgba(255,255,255,0.38)",
                      border:
                        mode === m
                          ? "1px solid rgba(237,130,28,0.25)"
                          : "1px solid transparent",
                    }}
                  >
                    {m === "chat" ? (
                      <MessageSquare size={11} />
                    ) : (
                      <Mic size={11} />
                    )}
                    {m === "chat" ? "Chat" : "Talk"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Voice panel ── */}
            {mode === "voice" && (
              <div className="flex-1 min-h-0">
                <VoicePanel />
              </div>
            )}

            {/* ── Chat messages (hidden in voice mode but not unmounted) ── */}
            <div
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col gap-3"
              style={{ display: mode === "voice" ? "none" : undefined }}
            >
              {/* Quick prompts — shown before first interaction */}
              {!hasInteracted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-1.5 mb-1"
                >
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      disabled={streaming}
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs text-white/60 transition-all hover:text-white/85 focus:outline-none"
                      style={{
                        background: "var(--ink-3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {p}
                      <ArrowRight size={10} />
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Message list */}
              {messages.map((msg, idx) => {
                const isLast = idx === messages.length - 1;
                const showDots =
                  msg.role === "assistant" &&
                  msg.content === "" &&
                  streaming &&
                  isLast;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* Bot avatar */}
                    {msg.role === "assistant" && (
                      <div
                        className="mr-2 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{
                          background: "rgba(237,130,28,0.1)",
                          border: "1px solid rgba(237,130,28,0.25)",
                        }}
                      >
                        <Bot size={10} color="var(--bail-orange)" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm text-white/80"
                      } ${
                        // Highlight the streaming message with a faint pulse border
                        msg.id === lastMsgId && streaming && msg.role === "assistant"
                          ? "ring-1 ring-[var(--bail-orange)]/20"
                          : ""
                      }`}
                      style={
                        msg.role === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, #ed821c 0%, #c96a10 100%)",
                            }
                          : {
                              background: "var(--ink-3)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }
                      }
                    >
                      {showDots ? (
                        <StreamingDots />
                      ) : msg.role === "assistant" ? (
                        <BotText text={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Error state */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-red-400/80 px-2"
                >
                  {error}
                </motion.p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area — hidden in voice mode */}
            <div
              className="flex-shrink-0 px-3 pb-3 pt-2"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: mode === "voice" ? "none" : undefined,
              }}
            >
              <div
                className="flex items-end gap-2 rounded-xl p-1.5"
                style={{
                  background: "var(--ink-3)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  transition: "border-color 0.15s",
                }}
              >
                <textarea
                  ref={(el) => {
                    // assign both refs
                    (inputRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                    (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
                  }}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value.slice(0, MAX_INPUT_CHARS));
                    autoResize(e.currentTarget);
                  }}
                  onKeyDown={handleKey}
                  placeholder="Ask about our services…"
                  rows={1}
                  disabled={streaming}
                  className="flex-1 resize-none bg-transparent text-sm text-white/85 placeholder:text-white/25 px-2 py-1.5 focus:outline-none overflow-y-auto leading-relaxed disabled:opacity-50 min-h-[32px]"
                  style={{ scrollbarWidth: "none" }}
                  aria-label="Chat message"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || streaming}
                  aria-label="Send message"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bail-orange)] disabled:opacity-25 disabled:cursor-not-allowed"
                  style={{
                    background:
                      input.trim() && !streaming
                        ? "linear-gradient(135deg, #ed821c, #c96a10)"
                        : "transparent",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Send size={13} color="white" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[10px] text-white/18 select-none">
                Powered by Bits AI Lab · AI can make mistakes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
