// src/components/workflow/nodeLayout.ts

export const WORLD_W = 1600;
export const WORLD_H = 3600;
export const NODE_W = 280;
export const SERVICE_W = 240;
export const NODE_H_DEFAULT = 160;

export type NodeKind = "trigger" | "action" | "branch" | "merge" | "watch" | "output";

export interface NodeDef {
  id: string;
  kind: NodeKind;
  x: number;  // center x
  y: number;  // center y
  w: number;
  h: number;
}

export const nodes: NodeDef[] = [
  // TRIGGER — centered
  { id: "trigger",   kind: "trigger", x: 800, y: 160,  w: NODE_W,    h: 180 },
  // QUALIFY
  { id: "qualify",   kind: "action",  x: 800, y: 440,  w: NODE_W,    h: 200 },
  // SPLIT branch node
  { id: "split",     kind: "branch",  x: 800, y: 700,  w: 180,       h: 60  },
  // AUTOMATE lane (left) — 4 service nodes
  { id: "svc-1",     kind: "action",  x: 380, y: 900,  w: SERVICE_W, h: 170 },
  { id: "svc-2",     kind: "action",  x: 380, y: 1120, w: SERVICE_W, h: 170 },
  { id: "svc-3",     kind: "action",  x: 380, y: 1340, w: SERVICE_W, h: 170 },
  { id: "svc-4",     kind: "action",  x: 380, y: 1560, w: SERVICE_W, h: 170 },
  // GROW lane (right) — 4 service nodes
  { id: "svc-5",     kind: "action",  x: 1220, y: 900,  w: SERVICE_W, h: 170 },
  { id: "svc-6",     kind: "action",  x: 1220, y: 1120, w: SERVICE_W, h: 170 },
  { id: "svc-7",     kind: "action",  x: 1220, y: 1340, w: SERVICE_W, h: 170 },
  { id: "svc-8",     kind: "action",  x: 1220, y: 1560, w: SERVICE_W, h: 170 },
  // MERGE
  { id: "merge",     kind: "merge",   x: 800, y: 1780,  w: 180,       h: 60  },
  // WATCH IT RUN
  { id: "watch",     kind: "watch",   x: 800, y: 2000,  w: 680,       h: 300 },
  // PROVE (case study)
  { id: "prove",     kind: "action",  x: 800, y: 2420,  w: NODE_W,    h: 220 },
  // INTEGRATIONS
  { id: "integrations", kind: "action", x: 800, y: 2740, w: NODE_W + 60, h: 160 },
  // SHIP IT (CTA + contact)
  { id: "ship",      kind: "action",  x: 800, y: 3000,  w: NODE_W + 120, h: 260 },
  // DEPLOYED
  { id: "done",      kind: "output",  x: 800, y: 3380,  w: NODE_W,    h: 100 },
];

// Wire connections: from node output port to node input port
export interface WireDef {
  id: string;
  from: string;
  to: string;
  variant?: "orange" | "cyan";  // color
}

export const wires: WireDef[] = [
  { id: "w-trigger-qualify",    from: "trigger",      to: "qualify" },
  { id: "w-qualify-split",      from: "qualify",      to: "split"   },
  { id: "w-split-svc1",         from: "split",        to: "svc-1",   variant: "orange" },
  { id: "w-split-svc2",         from: "split",        to: "svc-2",   variant: "orange" },
  { id: "w-split-svc3",         from: "split",        to: "svc-3",   variant: "orange" },
  { id: "w-split-svc4",         from: "split",        to: "svc-4",   variant: "orange" },
  { id: "w-split-svc5",         from: "split",        to: "svc-5",   variant: "cyan"   },
  { id: "w-split-svc6",         from: "split",        to: "svc-6",   variant: "cyan"   },
  { id: "w-split-svc7",         from: "split",        to: "svc-7",   variant: "cyan"   },
  { id: "w-split-svc8",         from: "split",        to: "svc-8",   variant: "cyan"   },
  { id: "w-svc1-merge",         from: "svc-1",        to: "merge",   variant: "orange" },
  { id: "w-svc2-merge",         from: "svc-2",        to: "merge",   variant: "orange" },
  { id: "w-svc3-merge",         from: "svc-3",        to: "merge",   variant: "orange" },
  { id: "w-svc4-merge",         from: "svc-4",        to: "merge",   variant: "orange" },
  { id: "w-svc5-merge",         from: "svc-5",        to: "merge",   variant: "cyan"   },
  { id: "w-svc6-merge",         from: "svc-6",        to: "merge",   variant: "cyan"   },
  { id: "w-svc7-merge",         from: "svc-7",        to: "merge",   variant: "cyan"   },
  { id: "w-svc8-merge",         from: "svc-8",        to: "merge",   variant: "cyan"   },
  { id: "w-merge-watch",        from: "merge",        to: "watch"   },
  { id: "w-watch-prove",        from: "watch",        to: "prove"   },
  { id: "w-prove-integrations", from: "prove",        to: "integrations" },
  { id: "w-integrations-ship",  from: "integrations", to: "ship"    },
  { id: "w-ship-done",          from: "ship",         to: "done"    },
];

// Helper: get node def by id
export function getNode(id: string): NodeDef {
  const n = nodes.find(n => n.id === id);
  if (!n) throw new Error(`Node not found: ${id}`);
  return n;
}

// Camera waypoints: at each progress value [0..1], camera centers on the target node at the given scale
// Progress is evenly spread across the 18 nodes/stages
export interface Waypoint {
  progress: number;   // 0..1 scroll progress
  nodeId: string;     // which node to center on
  scale: number;      // camera zoom (1 = full, 0.6 = zoomed out to see branches)
}

export const waypoints: Waypoint[] = [
  { progress: 0.00, nodeId: "trigger",      scale: 1.0  },
  { progress: 0.07, nodeId: "qualify",      scale: 1.0  },
  { progress: 0.14, nodeId: "split",        scale: 0.55 },  // zoom out to see full split
  { progress: 0.20, nodeId: "svc-1",        scale: 0.85 },
  { progress: 0.24, nodeId: "svc-2",        scale: 0.85 },
  { progress: 0.28, nodeId: "svc-3",        scale: 0.85 },
  { progress: 0.32, nodeId: "svc-4",        scale: 0.85 },
  { progress: 0.36, nodeId: "svc-5",        scale: 0.85 },
  { progress: 0.40, nodeId: "svc-6",        scale: 0.85 },
  { progress: 0.44, nodeId: "svc-7",        scale: 0.85 },
  { progress: 0.48, nodeId: "svc-8",        scale: 0.85 },
  { progress: 0.54, nodeId: "merge",        scale: 0.55 },  // zoom out to see merge
  { progress: 0.62, nodeId: "watch",        scale: 0.85 },
  { progress: 0.72, nodeId: "prove",        scale: 0.95 },
  { progress: 0.80, nodeId: "integrations", scale: 0.95 },
  { progress: 0.88, nodeId: "ship",         scale: 0.85 },
  { progress: 1.00, nodeId: "done",         scale: 1.0  },
];
