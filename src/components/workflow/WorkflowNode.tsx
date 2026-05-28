"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import type { NodeKind } from "./nodeLayout";

type Status = "waiting" | "running" | "done";

// Icon map per kind
const kindIcon: Record<NodeKind, string> = {
  trigger: "⚡",
  action: "▣",
  branch: "⑂",
  merge: "⑂",
  watch: "▶",
  output: "✓",
};

const kindLabel: Record<NodeKind, string> = {
  trigger: "TRIGGER",
  action: "ACTION",
  branch: "BRANCH",
  merge: "MERGE",
  watch: "EXECUTE",
  output: "OUTPUT",
};

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

  const borderColor =
    status === "running" ? "var(--node-border-running)" :
    status === "done"    ? "var(--node-border-done)" :
    "var(--node-border)";

  const isOrange = accentColor === "orange";
  const headerBg = isOrange
    ? "rgba(237,130,28,0.08)"
    : "rgba(0,212,255,0.06)";
  const headerColor = isOrange ? "var(--bail-orange)" : "var(--glow-cyan)";

  const isBranchOrMerge = kind === "branch" || kind === "merge";

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
            top: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 12,
            height: 12,
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
          background: "var(--ink-3)",
          border: `1px solid ${borderColor}`,
          borderRadius: isBranchOrMerge ? 8 : 12,
          transition: "border-color 0.4s ease",
          overflow: "hidden",
          minHeight: h,
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
        {/* Header */}
        <div style={{ background: headerBg, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: headerColor }}>{kindIcon[kind]}</span>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: headerColor, fontFamily: "monospace" }}>
              {kindLabel[kind]}
            </span>
          </div>
          {/* Status chip */}
          <StatusChip status={status} />
        </div>

        {/* Body */}
        {!isBranchOrMerge && (
          <div style={{ padding: "12px 14px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 6 }}>{title}</p>
            {children}
          </div>
        )}
        {isBranchOrMerge && (
          <div style={{ padding: "6px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{title}</p>
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
              <div style={{ padding: "10px 14px" }}>
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
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 12,
            height: 12,
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
    <span style={{ fontSize: 9, fontFamily: "monospace", padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap", transition: "all 0.3s", ...styles[status] }}>
      {labels[status]}
    </span>
  );
}
