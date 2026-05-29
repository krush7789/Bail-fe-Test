"use client";
// Renders all bezier wires as an SVG layer and animates data packets along them.
// Two sibling elements: SVG for wires, absolute div overlay for packets (offset-path CSS).

import React from "react";
import { nodes, wires, type NodeDef } from "./nodeLayout";

// Get the output port (bottom-center) of a node
function outPort(n: NodeDef): { x: number; y: number } {
  return { x: n.x, y: n.y + n.h / 2 };
}
// Get the input port (top-center) of a node
function inPort(n: NodeDef): { x: number; y: number } {
  return { x: n.x, y: n.y - n.h / 2 };
}

function bezierPath(from: NodeDef, to: NodeDef): string {
  const o = outPort(from);
  const i = inPort(to);
  const dy = Math.abs(i.y - o.y) * 0.45;
  return `M ${o.x} ${o.y} C ${o.x} ${o.y + dy} ${i.x} ${i.y - dy} ${i.x} ${i.y}`;
}

function getNodeById(id: string): NodeDef {
  const n = nodes.find(n => n.id === id);
  if (!n) throw new Error(`Node not found: ${id}`);
  return n;
}

interface WireLayerProps {
  worldW: number;
  worldH: number;
}

export default function WireLayer({ worldW, worldH }: WireLayerProps) {
  const pathMap = wires.map(wire => {
    const fromNode = getNodeById(wire.from);
    const toNode = getNodeById(wire.to);
    return {
      wire,
      d: bezierPath(fromNode, toNode),
    };
  });

  return (
    <>
      {/* Wire SVG layer */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: worldW,
          height: worldH,
          pointerEvents: "none",
          overflow: "visible",
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        {pathMap.map(({ wire, d }) => {
          const isOrange = wire.variant === "orange";
          const isCyan = wire.variant === "cyan";
          const strokeColor = isCyan
            ? "rgba(0,212,255,0.3)"
            : isOrange
            ? "rgba(237,130,28,0.3)"
            : "rgba(255,255,255,0.1)";

          return (
            <path
              key={wire.id}
              d={d}
              fill="none"
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* Packet overlay — div-based, uses offset-path CSS */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: worldW,
          height: worldH,
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden="true"
      >
        {pathMap.map(({ wire, d }, i) => {
          const isCyan = wire.variant === "cyan";
          const isLong = wire.from === "split" || wire.to === "merge";
          return (
            <div
              key={wire.id}
              className={`packet${isCyan ? " packet-cyan" : ""}`}
              style={{
                offsetPath: `path("${d}")`,
                animationDelay: `${(i * 0.37) % 2.4}s`,
                animationDuration: isLong ? "3.2s" : "2.4s",
              } as React.CSSProperties}
            />
          );
        })}
      </div>
    </>
  );
}
