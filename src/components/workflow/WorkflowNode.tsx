"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import type { NodeKind } from "./nodeLayout";

type Status = "waiting" | "running" | "done";

interface WorkflowNodeProps {
  nodeId: string;
  kind: NodeKind;
  title: string;
  x: number;       // center x in world coords
  y: number;       // center y in world coords
  w: number;
  h: number;
  accentColor?: "orange" | "cyan";
  expandable?: boolean;
  expandContent?: React.ReactNode;  // shown when expanded
  children?: React.ReactNode;       // main body content
}

export default function WorkflowNode({
  nodeId, kind, title, x, y, w, h,
  accentColor = "orange",
  expandable = false,
  expandContent,
  children,
}: WorkflowNodeProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [status, setStatus] = useState<Status>(prefersReduced ? "done" : "waiting");
  const [expanded, setExpanded] = useState(false);

  // Status state machine — fires when node enters view
  React.useEffect(() => {
    if (prefersReduced || !isInView || status !== "waiting") return;
    const t1 = setTimeout(() => setStatus("running"), 300);
    const t2 = setTimeout(() => setStatus("done"), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView, prefersReduced, status]);

  const isBranchOrMerge = kind === "branch" || kind === "merge";
  const isTriggerOrOutput = kind === "trigger" || kind === "output";

  // Accent border color based on status and accentColor
  let accentBorderColor: string;
  if (isTriggerOrOutput) {
    accentBorderColor = "var(--bail-orange)";
  } else if (accentColor === "cyan") {
    accentBorderColor =
      status === "done"    ? "var(--glow-cyan)" :
      status === "running" ? "var(--glow-cyan)" :
      "rgba(0,212,255,0.3)";
  } else {
    accentBorderColor =
      status === "done"    ? "var(--status-done)" :
      status === "running" ? "var(--bail-orange)" :
      "rgba(237,130,28,0.3)";
  }

  const borderColor =
    status === "running" ? "var(--node-border-running)" :
    status === "done"    ? "var(--node-border-done)" :
    "var(--node-border)";

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        zIndex: 3,
      }}
      data-node-id={nodeId}
    >
      {/* Input port dot (top) — hidden for trigger */}
      {kind !== "trigger" && (
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ink-2)",
            border: `2px solid ${borderColor}`,
            transition: "border-color 0.4s",
            zIndex: 2,
          }}
          aria-hidden="true"
        />
      )}

      {/* Node card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "rgba(11,15,30,0.85)",
          border: `1px solid ${borderColor}`,
          borderLeft: `3px solid ${accentBorderColor}`,
          borderRadius: 16,
          transition: "border-color 0.4s ease, border-left-color 0.4s ease",
          overflow: "hidden",
          minHeight: h,
          backdropFilter: "blur(8px)",
        }}
        onClick={expandable ? () => setExpanded(v => !v) : undefined}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        onKeyDown={expandable ? (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(v => !v);
          }
        } : undefined}
        aria-expanded={expandable ? expanded : undefined}
      >
        {/* Status row at top */}
        <div style={{ padding: "10px 18px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}>
            {nodeId.toUpperCase()}
          </span>
          <StatusChip status={status} />
        </div>

        {/* Body */}
        {!isBranchOrMerge && (
          <div style={{ padding: "8px 18px" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1.3, marginBottom: 10 }}>{title}</p>
            {children}
          </div>
        )}
        {isBranchOrMerge && (
          <div style={{ padding: "6px 14px", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{title}</p>
          </div>
        )}

        {/* Inline expand panel */}
        <AnimatePresence initial={false}>
          {expanded && expandContent && (
            <motion.div
              key="expand"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div style={{ padding: "10px 18px" }}>
                {expandContent}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Output port dot (bottom) — hidden for output kind */}
      {kind !== "output" && (
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "var(--ink-2)",
            border: `2px solid ${borderColor}`,
            transition: "border-color 0.4s",
            zIndex: 2,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

function StatusChip({ status }: { status: Status }) {
  const styles: Record<Status, React.CSSProperties> = {
    waiting: { color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
    running: { color: "var(--bail-orange)", background: "rgba(237,130,28,0.1)", border: "1px solid rgba(237,130,28,0.3)" },
    done:    { color: "var(--status-done)", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" },
  };
  const labels: Record<Status, string> = {
    waiting: "● Waiting",
    running: "◌ Running…",
    done:    "✓ Done",
  };

  return (
    <span style={{ fontSize: 12, fontFamily: "monospace", padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap", transition: "all 0.3s", ...styles[status] }}>
      {labels[status]}
    </span>
  );
}
