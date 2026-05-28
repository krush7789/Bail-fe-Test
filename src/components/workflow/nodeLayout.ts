// src/components/workflow/nodeLayout.ts

export const WORLD_W = 1000;          // narrower world — fits viewport better
export const WORLD_H = 4000;
export const CX = 500;               // horizontal center of world (WORLD_W / 2)

export type NodeKind = "trigger" | "action" | "branch" | "merge" | "watch" | "output";

export interface NodeDef {
  id: string;
  kind: NodeKind;
  x: number;   // center x in world coords
  y: number;   // center y in world coords
  w: number;
  h: number;
}

// Branch nodes sit at x=220 (left) and x=780 (right) — symmetric around CX=500
// The camera NEVER pans left/right; at the branch zoom level (scale=0.40) both columns fit in frame

export const nodes: NodeDef[] = [
  // TRIGGER — centered, tall (fills viewport at scale=1)
  { id: "trigger",      kind: "trigger", x: CX,  y: 300,  w: 720, h: 460 },
  // QUALIFY — centered
  { id: "qualify",      kind: "action",  x: CX,  y: 920,  w: 660, h: 280 },
  // SPLIT — centered, thin horizontal bar
  { id: "split",        kind: "branch",  x: CX,  y: 1280, w: 220, h: 56  },
  // AUTOMATE lane — 4 nodes at x=220
  { id: "svc-1",        kind: "action",  x: 220, y: 1500, w: 340, h: 210 },
  { id: "svc-2",        kind: "action",  x: 220, y: 1760, w: 340, h: 210 },
  { id: "svc-3",        kind: "action",  x: 220, y: 2020, w: 340, h: 210 },
  { id: "svc-4",        kind: "action",  x: 220, y: 2280, w: 340, h: 210 },
  // GROW lane — 4 nodes at x=780
  { id: "svc-5",        kind: "action",  x: 780, y: 1500, w: 340, h: 210 },
  { id: "svc-6",        kind: "action",  x: 780, y: 1760, w: 340, h: 210 },
  { id: "svc-7",        kind: "action",  x: 780, y: 2020, w: 340, h: 210 },
  { id: "svc-8",        kind: "action",  x: 780, y: 2280, w: 340, h: 210 },
  // MERGE — centered
  { id: "merge",        kind: "merge",   x: CX,  y: 2540, w: 220, h: 56  },
  // WATCH IT RUN — wide centered node
  { id: "watch",        kind: "watch",   x: CX,  y: 2840, w: 720, h: 340 },
  // PROVE — centered
  { id: "prove",        kind: "action",  x: CX,  y: 3300, w: 660, h: 260 },
  // SHIP IT — centered, tallest (has contact form)
  { id: "ship",         kind: "action",  x: CX,  y: 3700, w: 660, h: 340 },
  // DEPLOYED
  { id: "done",         kind: "output",  x: CX,  y: 4000, w: 500, h: 100 },
];

export interface WireDef {
  id: string;
  from: string;
  to: string;
  variant?: "orange" | "cyan";
}

export const wires: WireDef[] = [
  { id: "w-trigger-qualify",  from: "trigger",  to: "qualify" },
  { id: "w-qualify-split",    from: "qualify",  to: "split"   },
  { id: "w-split-svc1",       from: "split",    to: "svc-1",  variant: "orange" },
  { id: "w-split-svc2",       from: "split",    to: "svc-2",  variant: "orange" },
  { id: "w-split-svc3",       from: "split",    to: "svc-3",  variant: "orange" },
  { id: "w-split-svc4",       from: "split",    to: "svc-4",  variant: "orange" },
  { id: "w-split-svc5",       from: "split",    to: "svc-5",  variant: "cyan"   },
  { id: "w-split-svc6",       from: "split",    to: "svc-6",  variant: "cyan"   },
  { id: "w-split-svc7",       from: "split",    to: "svc-7",  variant: "cyan"   },
  { id: "w-split-svc8",       from: "split",    to: "svc-8",  variant: "cyan"   },
  { id: "w-svc1-merge",       from: "svc-1",    to: "merge",  variant: "orange" },
  { id: "w-svc2-merge",       from: "svc-2",    to: "merge",  variant: "orange" },
  { id: "w-svc3-merge",       from: "svc-3",    to: "merge",  variant: "orange" },
  { id: "w-svc4-merge",       from: "svc-4",    to: "merge",  variant: "orange" },
  { id: "w-svc5-merge",       from: "svc-5",    to: "merge",  variant: "cyan"   },
  { id: "w-svc6-merge",       from: "svc-6",    to: "merge",  variant: "cyan"   },
  { id: "w-svc7-merge",       from: "svc-7",    to: "merge",  variant: "cyan"   },
  { id: "w-svc8-merge",       from: "svc-8",    to: "merge",  variant: "cyan"   },
  { id: "w-merge-watch",      from: "merge",    to: "watch"   },
  { id: "w-watch-prove",      from: "watch",    to: "prove"   },
  { id: "w-prove-ship",       from: "prove",    to: "ship"    },
  { id: "w-ship-done",        from: "ship",     to: "done"    },
];

// Helper: get node def by id
export function getNode(id: string): NodeDef {
  const n = nodes.find(n => n.id === id);
  if (!n) throw new Error(`Node not found: ${id}`);
  return n;
}

export interface Waypoint {
  progress: number;
  nodeId: string;
  scale: number;
}

// Key principle: camera NEVER moves left/right — only Y and scale change.
// For branch section: zoom out to 0.38 so both columns (x=220, x=780) are visible simultaneously.
export const waypoints: Waypoint[] = [
  { progress: 0.00, nodeId: "trigger",  scale: 0.95 },   // hero — nearly full screen
  { progress: 0.10, nodeId: "qualify",  scale: 0.85 },   // qualify
  { progress: 0.20, nodeId: "split",    scale: 0.38 },   // zoom out to show both branches
  { progress: 0.35, nodeId: "svc-2",    scale: 0.38 },   // hold at branch view (auto-status fires)
  { progress: 0.50, nodeId: "svc-3",    scale: 0.38 },   // still in branch view
  { progress: 0.62, nodeId: "merge",    scale: 0.55 },   // zoom back in for merge
  { progress: 0.70, nodeId: "watch",    scale: 0.80 },   // watch it run
  { progress: 0.80, nodeId: "prove",    scale: 0.85 },   // case study
  { progress: 0.90, nodeId: "ship",     scale: 0.80 },   // contact
  { progress: 1.00, nodeId: "done",     scale: 0.95 },   // deployed
];
