"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { nodes, wires, waypoints, WORLD_W, WORLD_H, getNode } from "./nodeLayout";
import WorkflowNode from "./WorkflowNode";
import StickyNote from "./StickyNote";
import DotGridBackground from "./DotGridBackground";
import Button from "@/components/shared/Button";
import AIChatDemo from "@/components/shared/AIChatDemo";
import VoiceWaveform from "@/components/shared/VoiceWaveform";
import { hero, stats, pillars, whyUs, caseStudy, techStack, cta, contact } from "@/content/catalog";

// --- Wire SVG layer (wires only) ---
function WirePaths() {
  function getNodeById(id: string) {
    return nodes.find(n => n.id === id)!;
  }
  function outPort(n: (typeof nodes)[0]) { return { x: n.x, y: n.y + n.h / 2 }; }
  function inPort(n: (typeof nodes)[0]) { return { x: n.x, y: n.y - n.h / 2 }; }
  function bezier(from: (typeof nodes)[0], to: (typeof nodes)[0]) {
    const o = outPort(from), i = inPort(to);
    const dy = Math.abs(i.y - o.y) * 0.45;
    return `M ${o.x} ${o.y} C ${o.x} ${o.y + dy} ${i.x} ${i.y - dy} ${i.x} ${i.y}`;
  }

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: WORLD_W,
        height: WORLD_H,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      {wires.map(wire => {
        const f = getNodeById(wire.from), t = getNodeById(wire.to);
        const d = bezier(f, t);
        const stroke =
          wire.variant === "cyan"
            ? "rgba(0,212,255,0.3)"
            : wire.variant === "orange"
            ? "rgba(237,130,28,0.3)"
            : "rgba(255,255,255,0.1)";
        return (
          <path
            key={wire.id}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

// --- Data packet overlays (div-based, offset-path CSS) ---
function PacketLayer() {
  function getNodeById(id: string) { return nodes.find(n => n.id === id)!; }
  function outPort(n: (typeof nodes)[0]) { return { x: n.x, y: n.y + n.h / 2 }; }
  function inPort(n: (typeof nodes)[0]) { return { x: n.x, y: n.y - n.h / 2 }; }
  function bezier(from: (typeof nodes)[0], to: (typeof nodes)[0]) {
    const o = outPort(from), i = inPort(to);
    const dy = Math.abs(i.y - o.y) * 0.45;
    return `M ${o.x} ${o.y} C ${o.x} ${o.y + dy} ${i.x} ${i.y - dy} ${i.x} ${i.y}`;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: WORLD_W,
        height: WORLD_H,
        pointerEvents: "none",
        zIndex: 2,
      }}
      aria-hidden="true"
    >
      {wires.map((wire, i) => {
        const f = getNodeById(wire.from), t = getNodeById(wire.to);
        const d = bezier(f, t);
        return (
          <div
            key={wire.id}
            className={`packet${wire.variant === "cyan" ? " packet-cyan" : ""}`}
            style={{
              offsetPath: `path("${d}")`,
              animationDelay: `${(i * 0.37) % 2.4}s`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

// --- Contact form ---
type FormStatus = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setFormStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      setFormStatus(res.ok ? "success" : "error");
    } catch {
      setFormStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "white",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    display: "block",
    marginBottom: 4,
  };

  if (formStatus === "success") {
    return (
      <div style={{ padding: 16, textAlign: "center" }}>
        <p style={{ fontSize: 24, marginBottom: 8 }}>✓</p>
        <p style={{ color: "var(--status-done)", fontWeight: 700, fontSize: 14 }}>Message sent!</p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>
          We&apos;ll reply within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <label htmlFor="wf-name" style={labelStyle}>Name</label>
        <input
          id="wf-name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
          required
        />
      </div>
      <div>
        <label htmlFor="wf-email" style={labelStyle}>Email</label>
        <input
          id="wf-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
      </div>
      <div>
        <label htmlFor="wf-msg" style={labelStyle}>What are you building?</label>
        <textarea
          id="wf-msg"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
          required
        />
      </div>
      <button
        type="submit"
        disabled={formStatus === "sending"}
        style={{
          background: "var(--bail-orange)",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "9px 18px",
          fontWeight: 700,
          fontSize: 13,
          cursor: "pointer",
          opacity: formStatus === "sending" ? 0.6 : 1,
        }}
      >
        {formStatus === "sending" ? "Sending…" : "Send message →"}
      </button>
      {formStatus === "error" && (
        <p style={{ color: "#f87171", fontSize: 11 }}>
          Something went wrong — email us at {contact.email}
        </p>
      )}
    </form>
  );
}

// --- Canvas world (all nodes placed absolutely) ---
function CanvasWorld() {
  const allTools = techStack.flatMap(g => g.tools);

  const stickyNotes = [
    { ...whyUs[0], x: 120, y: 440, rotate: -1.5 },
    { ...whyUs[1], x: 1480, y: 440, rotate: 1.2 },
    { ...whyUs[2], x: 120, y: 2000, rotate: -0.8 },
    { ...whyUs[3], x: 1480, y: 2000, rotate: 1.5 },
  ];

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: WORLD_W, height: WORLD_H }}>
      <DotGridBackground w={WORLD_W} h={WORLD_H} />
      <WirePaths />
      <PacketLayer />

      {/* === TRIGGER node === */}
      <WorkflowNode
        nodeId="trigger"
        kind="trigger"
        title={hero.headline.replace("\n", " ")}
        x={getNode("trigger").x}
        y={getNode("trigger").y}
        w={getNode("trigger").w}
        h={getNode("trigger").h}
      >
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
          {hero.subheadline}
        </p>
        <Button label={hero.cta.label} href="/#contact" variant="primary" size="md" />
      </WorkflowNode>

      {/* === QUALIFY node === */}
      <WorkflowNode
        nodeId="qualify"
        kind="action"
        title="Qualify: output data"
        x={getNode("qualify").x}
        y={getNode("qualify").y}
        w={getNode("qualify").w}
        h={getNode("qualify").h}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
          {stats.slice(0, 4).map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{s.value}</span>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </WorkflowNode>

      {/* === SPLIT === */}
      <WorkflowNode
        nodeId="split"
        kind="branch"
        title="⑂  Route by capability"
        x={getNode("split").x}
        y={getNode("split").y}
        w={getNode("split").w}
        h={getNode("split").h}
      />

      {/* === AUTOMATE lane (left 4) === */}
      {pillars[0].services.map((svc, i) => {
        const nodeId = `svc-${i + 1}`;
        const n = getNode(nodeId);
        return (
          <WorkflowNode
            key={nodeId}
            nodeId={nodeId}
            kind="action"
            title={svc.title}
            x={n.x}
            y={n.y}
            w={n.w}
            h={n.h}
            accentColor="orange"
            expandable
            expandContent={
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Problem</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{svc.problem}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Solution</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{svc.solution}</p>
              </div>
            }
          >
            <p style={{ fontSize: 10, color: "var(--bail-orange)", marginBottom: 6 }}>{svc.hook}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {svc.whatWeBuild.slice(0, 3).map(item => (
                <span
                  key={item}
                  style={{
                    fontSize: 9,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 99,
                    padding: "2px 6px",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </WorkflowNode>
        );
      })}

      {/* === Automate lane label === */}
      <div style={{ position: "absolute", left: 140, top: 820, textAlign: "center", width: 240, zIndex: 2 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(237,130,28,0.7)", textTransform: "uppercase" }}>
          ⚙ Automate
        </p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Replace manual work</p>
      </div>

      {/* === GROW lane (right 4) === */}
      {pillars[1].services.map((svc, i) => {
        const nodeId = `svc-${i + 5}`;
        const n = getNode(nodeId);
        return (
          <WorkflowNode
            key={nodeId}
            nodeId={nodeId}
            kind="action"
            title={svc.title}
            x={n.x}
            y={n.y}
            w={n.w}
            h={n.h}
            accentColor="cyan"
            expandable
            expandContent={
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Problem</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{svc.problem}</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Solution</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{svc.solution}</p>
              </div>
            }
          >
            <p style={{ fontSize: 10, color: "var(--glow-cyan)", marginBottom: 6 }}>{svc.hook}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {svc.whatWeBuild.slice(0, 3).map(item => (
                <span
                  key={item}
                  style={{
                    fontSize: 9,
                    background: "rgba(0,212,255,0.04)",
                    border: "1px solid rgba(0,212,255,0.1)",
                    borderRadius: 99,
                    padding: "2px 6px",
                    color: "rgba(0,212,255,0.6)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </WorkflowNode>
        );
      })}

      {/* === Grow lane label === */}
      <div style={{ position: "absolute", left: 1100, top: 820, textAlign: "center", width: 240, zIndex: 2 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(0,212,255,0.7)", textTransform: "uppercase" }}>
          📈 Grow
        </p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>Fill your pipeline</p>
      </div>

      {/* === MERGE === */}
      <WorkflowNode
        nodeId="merge"
        kind="merge"
        title="⑂  Merge results"
        x={getNode("merge").x}
        y={getNode("merge").y}
        w={getNode("merge").w}
        h={getNode("merge").h}
      />

      {/* === WATCH IT RUN === */}
      <WorkflowNode
        nodeId="watch"
        kind="watch"
        title="Watch it run — live"
        x={getNode("watch").x}
        y={getNode("watch").y}
        w={getNode("watch").w}
        h={getNode("watch").h}
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              AI Chatbot · Live
            </p>
            <AIChatDemo />
          </div>
          <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Voice AI · Active call
            </p>
            <VoiceWaveform />
          </div>
        </div>
      </WorkflowNode>

      {/* === PROVE node (case study) === */}
      <WorkflowNode
        nodeId="prove"
        kind="action"
        title={caseStudy.headline}
        x={getNode("prove").x}
        y={getNode("prove").y}
        w={getNode("prove").w}
        h={getNode("prove").h}
      >
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
          {caseStudy.client}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {caseStudy.outcomes.slice(0, 3).map(o => (
            <span key={o} style={{ fontSize: 9, color: "rgba(34,197,94,0.8)" }}>✓ {o}</span>
          ))}
        </div>
      </WorkflowNode>

      {/* === INTEGRATIONS node === */}
      <WorkflowNode
        nodeId="integrations"
        kind="action"
        title="Integrations — 30+ tools"
        x={getNode("integrations").x}
        y={getNode("integrations").y}
        w={getNode("integrations").w}
        h={getNode("integrations").h}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {allTools.slice(0, 8).map(tool => (
            <span
              key={tool}
              style={{
                fontSize: 9,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 4,
                padding: "2px 6px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </WorkflowNode>

      {/* === SHIP IT node (CTA + contact) === */}
      <WorkflowNode
        nodeId="ship"
        kind="action"
        title={cta.headline}
        x={getNode("ship").x}
        y={getNode("ship").y}
        w={getNode("ship").w}
        h={getNode("ship").h}
      >
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
          {cta.subheadline}
        </p>
        <ContactForm />
      </WorkflowNode>

      {/* === DEPLOYED (output) === */}
      <WorkflowNode
        nodeId="done"
        kind="output"
        title="✓ Pipeline deployed"
        x={getNode("done").x}
        y={getNode("done").y}
        w={getNode("done").w}
        h={getNode("done").h}
      />

      {/* === Sticky notes (whyUs) at canvas edges === */}
      {stickyNotes.map((n, i) => (
        <StickyNote key={i} title={n.title} body={n.description} x={n.x} y={n.y} rotate={n.rotate} />
      ))}

      {/* === Process stage labels === */}
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 300,
          color: "rgba(255,255,255,0.1)",
          fontSize: 80,
          fontWeight: 900,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        01
      </div>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 820,
          color: "rgba(255,255,255,0.05)",
          fontSize: 80,
          fontWeight: 900,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        02
      </div>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 2350,
          color: "rgba(255,255,255,0.05)",
          fontSize: 80,
          fontWeight: 900,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        03
      </div>
    </div>
  );
}

// --- Reduced-motion / mobile fallback: plain vertical list ---
function FallbackView() {
  return (
    <div style={{ background: "var(--ink)", minHeight: "100vh", padding: "80px 24px" }}>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 40,
        }}
      >
        <div>
          <p
            style={{
              color: "var(--bail-orange)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Automation Pipeline
          </p>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            {hero.headline}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: 12, marginBottom: 20 }}>
            {hero.subheadline}
          </p>
          <Button label={hero.cta.label} href="/#contact" variant="primary" size="lg" />
        </div>
        {pillars.flatMap(p => p.services).map(svc => (
          <div key={svc.id} style={{ borderLeft: "2px solid var(--bail-orange)", paddingLeft: 16 }}>
            <p style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>
              ✓ {String(svc.id).padStart(2, "0")}
            </p>
            <p style={{ fontWeight: 700, color: "white", marginBottom: 4 }}>{svc.title}</p>
            <p style={{ fontSize: 13, color: "var(--bail-orange)" }}>{svc.hook}</p>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 32 }}>
          <h2 style={{ fontWeight: 700, color: "white", fontSize: 24, marginBottom: 16 }}>
            {cta.headline}
          </h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

// --- Main canvas with camera ---
export default function WorkflowCanvas() {
  const prefersReduced = useReducedMotion();
  const [isMobileNarrow, setIsMobileNarrow] = useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobileNarrow(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobileNarrow(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const showFallback = prefersReduced || isMobileNarrow;

  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { damping: 40, stiffness: 100 });

  // Compute camera x, y, scale from waypoints using useTransform
  const progressValues = waypoints.map(w => w.progress);

  // Lens center — use fixed 800×450 for SSR safety
  const LCX = 800;
  const LCY = 450;
  const worldXValues = waypoints.map(w => {
    const n = nodes.find(n => n.id === w.nodeId)!;
    return LCX - n.x * w.scale;
  });
  const worldYValues = waypoints.map(w => {
    const n = nodes.find(n => n.id === w.nodeId)!;
    return LCY - n.y * w.scale;
  });
  const scaleValues = waypoints.map(w => w.scale);

  const cameraX = useTransform(smoothProgress, progressValues, worldXValues);
  const cameraY = useTransform(smoothProgress, progressValues, worldYValues);
  const cameraScale = useTransform(smoothProgress, progressValues, scaleValues);

  // Scroll height: ~22 "screens" of travel
  const scrollHeight = "2200vh";

  if (showFallback) return <FallbackView />;

  return (
    <div ref={outerRef} style={{ position: "relative", height: scrollHeight }}>
      {/* Sticky lens — viewport window */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--ink)",
        }}
      >
        {/* Camera — transforms the world */}
        <motion.div
          style={{
            x: cameraX,
            y: cameraY,
            scale: cameraScale,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
            width: WORLD_W,
            height: WORLD_H,
          }}
        >
          <CanvasWorld />
        </motion.div>

        {/* HUD overlay — progress indicator (always on top, not transformed) */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
          }}
        >
          <p
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Pipeline progress
          </p>
          <div
            style={{
              width: 2,
              height: 80,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 1,
              position: "relative",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                background: "var(--bail-orange)",
                borderRadius: 1,
                scaleY: smoothProgress,
                transformOrigin: "top",
              }}
            />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 24, left: 24, zIndex: 20 }}>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            ↕ scroll to run the pipeline
          </p>
        </div>
      </div>
    </div>
  );
}

