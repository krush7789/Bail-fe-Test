"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "../store";
import { BAYS, ORANGE, hot, type BayId } from "./layout";

// Deterministic pseudo-random so server/client and reloads match.
const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const dummy = new THREE.Object3D();
const damp = (k: number, dt: number) => 1 - Math.pow(k, dt);

// 0→1 while the bay's section is on screen (eased), so bays assemble on arrival
function useActive(id: BayId) {
  const a = useRef(0);
  useFrame((_, dt) => {
    const on = useScene.getState().section === id ? 1 : 0;
    a.current = THREE.MathUtils.lerp(a.current, on, damp(0.25, dt));
  });
  return a;
}

// A glowing base under each bay: dark disc, accent ring, accent light.
function Base({ color }: { color: string }) {
  return (
    <group position={[0, -1.55, 0]}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[4.6, 96]} />
        <meshBasicMaterial color="#0a0b0d" />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <ringGeometry args={[4.5, 4.56, 160]} />
        <meshBasicMaterial color={hot(color, 2.5)} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={7} distance={9} position={[0, 3.5, 2]} />
    </group>
  );
}

export default function Bays() {
  return (
    <>
      <group position={BAYS.hr.pos}><Base color={BAYS.hr.color} /><HrBay /></group>
      <group position={BAYS.inventory.pos}><Base color={BAYS.inventory.color} /><InventoryBay /></group>
      <group position={BAYS.referral.pos}><Base color={BAYS.referral.color} /><ReferralBay /></group>
    </>
  );
}

// ── HR: drifting people assemble into an org tree; the hire joins it ───────
const TREE: [number, number, number][] = [
  [0, 2.3, 0],                                    // 0 head
  [-2.6, 1.0, 0], [0, 1.0, 0], [2.6, 1.0, 0],     // 1-3 leads
  [-3.3, -0.3, 0], [-1.9, -0.3, 0],               // 4-5
  [-0.7, -0.3, 0], [0.7, -0.3, 0],                // 6-7
  [1.9, -0.3, 0],                                 // 8
  [3.3, -0.3, 0],                                 // 9 = the new hire (Rohan)
];
const PARENT = [-1, 0, 0, 0, 1, 1, 2, 2, 3, 3];
const HIRE = 9;

function HrBay() {
  const nodes = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const active = useActive("hr");
  const hire = useRef(0);
  const cur = useMemo(() => TREE.map((_, i) => new THREE.Vector3((rand(i) - 0.5) * 9, (rand(i + 9) - 0.3) * 5, (rand(i + 19) - 0.5) * 5)), []);
  const scatter = useMemo(() => cur.map((v) => v.clone()), [cur]);
  const tree = useMemo(() => TREE.map(([x, y, z]) => new THREE.Vector3(x, y, z)), []);
  const linePos = useMemo(() => new Float32Array((TREE.length - 1) * 6), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const a = active.current;
    hire.current = THREE.MathUtils.lerp(hire.current, useScene.getState().hired ? 1 : 0, damp(0.05, dt));
    for (let i = 0; i < TREE.length; i++) {
      // drift while scattered, settle into the tree as the section arrives
      tmp.copy(scatter[i]).add(new THREE.Vector3(Math.sin(t * 0.4 + i) * 0.4, Math.cos(t * 0.3 + i) * 0.3, 0));
      tmp.lerp(tree[i], THREE.MathUtils.smootherstep(a, 0, 1));
      if (i === HIRE) tmp.lerp(new THREE.Vector3(6, 4, 3), 1 - hire.current); // hire flies in from outside
      cur[i].lerp(tmp, damp(0.02, dt));
      const s = (i === 0 ? 0.17 : i <= 3 ? 0.13 : 0.1) * (i === HIRE ? hire.current : 1) * (1 + Math.sin(t * 2 + i) * 0.05);
      dummy.position.copy(cur[i]);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodes.current!.setMatrixAt(i, dummy.matrix);
      if (i > 0) {
        const p = cur[PARENT[i]], o = (i - 1) * 6;
        // the hire's link grows out of its manager only once they're placed
        const end = i === HIRE ? tmp.lerpVectors(p, cur[i], hire.current) : cur[i];
        linePos.set([p.x, p.y, p.z, end.x, end.y, end.z], o);
      }
    }
    nodes.current!.instanceMatrix.needsUpdate = true;
    const g = lines.current!.geometry;
    (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (lines.current!.material as THREE.LineBasicMaterial).opacity = 0.15 + a * 0.55;
  });

  return (
    <>
      <instancedMesh ref={nodes} args={[undefined, undefined, TREE.length]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color={hot(BAYS.hr.color, 2.2)} toneMapped={false} />
      </instancedMesh>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={hot(BAYS.hr.color, 1.3)} transparent opacity={0.2} toneMapped={false} />
      </lineSegments>
    </>
  );
}

// ── Inventory: shelves of crates that drain with the demo's sales slider ───
const SHELVES = [-2.6, 0, 2.6];
const LEVELS = 4;
const PER = 5; // crates per level per shelf
const CRATES = SHELVES.length * LEVELS * PER;

function InventoryBay() {
  const frame = useRef<THREE.InstancedMesh>(null);
  const crates = useRef<THREE.InstancedMesh>(null);
  const active = useActive("inventory");
  const scale = useMemo(() => new Float32Array(CRATES), []);
  const color = useMemo(() => new THREE.Color(), []);
  const normal = useMemo(() => hot(BAYS.inventory.color, 0.6), []);
  const low = useMemo(() => hot(ORANGE, 2.6), []);

  // shelf frames are static: 2 uprights + 4 boards per shelf
  useLayoutEffect(() => {
    let n = 0;
    SHELVES.forEach((sx) => {
      for (const ux of [-1.08, 1.08]) {
        dummy.position.set(sx + ux, 0.15, 0); dummy.scale.set(0.06, 3.5, 0.6); dummy.updateMatrix();
        frame.current!.setMatrixAt(n++, dummy.matrix);
      }
      for (let l = 0; l < LEVELS; l++) {
        dummy.position.set(sx, l * 0.85 - 1.2, 0); dummy.scale.set(2.2, 0.04, 0.6); dummy.updateMatrix();
        frame.current!.setMatrixAt(n++, dummy.matrix);
      }
    });
    frame.current!.instanceMatrix.needsUpdate = true;
    // instance colours must exist before the first render, or the shader compiles without them
    for (let i = 0; i < CRATES; i++) crates.current!.setColorAt(i, normal);
  }, [normal]);

  useFrame(({ clock }, dt) => {
    const a = active.current;
    const stock = useScene.getState().stock;
    let i = 0;
    for (let l = 0; l < LEVELS; l++) {
      const pct = stock[l] ?? 1;
      const keep = Math.round(pct * SHELVES.length * PER);
      const isLow = pct < 0.2;
      for (let s = 0; s < SHELVES.length; s++) {
        for (let c = 0; c < PER; c++, i++) {
          const slot = s * PER + c;
          scale[i] = THREE.MathUtils.lerp(scale[i], slot < keep ? 1 : 0, damp(0.02, dt));
          // drop in from above, staggered, as the section arrives
          const local = THREE.MathUtils.clamp(a * 1.6 - (i / CRATES) * 0.6, 0, 1);
          const drop = (1 - THREE.MathUtils.smootherstep(local, 0, 1)) * 5;
          dummy.position.set(SHELVES[s] - 0.8 + c * 0.4, l * 0.85 - 1.0 + drop, 0);
          dummy.rotation.set(0, (1 - local) * 2, 0);
          const sc = 0.32 * scale[i] * (isLow ? 1 + Math.sin(clock.elapsedTime * 6) * 0.06 : 1);
          dummy.scale.setScalar(sc);
          dummy.updateMatrix();
          crates.current!.setMatrixAt(i, dummy.matrix);
          crates.current!.setColorAt(i, isLow ? low : color.copy(normal));
        }
      }
    }
    crates.current!.instanceMatrix.needsUpdate = true;
    if (crates.current!.instanceColor) crates.current!.instanceColor.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={frame} args={[undefined, undefined, SHELVES.length * (2 + LEVELS)]}>
        <boxGeometry />
        <meshStandardMaterial color="#2a2e34" metalness={0.25} roughness={0.55} envMapIntensity={0.3} />
      </instancedMesh>
      <instancedMesh ref={crates} args={[undefined, undefined, CRATES]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  );
}

// ── Referral: a network; referrals pulse source → sent → accepted → converted ──
const SOURCES = Array.from({ length: 5 }, (_, i) => new THREE.Vector3(-3.4, 2 - i * 0.95, 0));
const STAGES = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.7, 0, 0), new THREE.Vector3(3.4, 0, 0)];
const BG = Array.from({ length: 28 }, (_, i) => new THREE.Vector3((rand(i + 50) - 0.5) * 9, (rand(i + 80) - 0.4) * 5, -1.5 - rand(i + 110) * 2.5));
const ALL = [...SOURCES, ...STAGES, ...BG];
const POOL = 16;
const PULSE_S = 1.6;

function ReferralBay() {
  const nodes = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const bright = useRef<THREE.LineSegments>(null);
  const faint = useRef<THREE.LineSegments>(null);
  const burst = useRef<THREE.Mesh>(null);
  const active = useActive("referral");
  const live = useRef<{ from: number; t0: number }[]>([]);
  const seen = useRef(0);
  const lastAmbient = useRef(0);
  const burstT = useRef(-10);

  const brightPos = useMemo(() => {
    const segs: number[] = [];
    SOURCES.forEach((s) => segs.push(s.x, s.y, s.z, STAGES[0].x, STAGES[0].y, STAGES[0].z));
    for (let i = 0; i < 2; i++) segs.push(STAGES[i].x, STAGES[i].y, STAGES[i].z, STAGES[i + 1].x, STAGES[i + 1].y, STAGES[i + 1].z);
    return new Float32Array(segs);
  }, []);
  const faintPos = useMemo(() => {
    const segs: number[] = [];
    BG.forEach((p, i) => {
      // link each background node to its two nearest neighbours
      const near = BG.map((q, j) => ({ j, d: i === j ? Infinity : p.distanceTo(q) })).sort((x, y) => x.d - y.d).slice(0, 2);
      near.forEach(({ j }) => segs.push(p.x, p.y, p.z, BG[j].x, BG[j].y, BG[j].z));
    });
    return new Float32Array(segs);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = active.current;
    const st = useScene.getState();

    // demo-fired referrals
    if (st.referralCount !== seen.current) {
      if (st.referralCount > seen.current) live.current.push({ from: st.referralFrom, t0: t });
      seen.current = st.referralCount;
    }
    // ambient referrals while on screen
    if (a > 0.6 && t - lastAmbient.current > 2.4) {
      live.current.push({ from: Math.floor(rand(t) * SOURCES.length), t0: t });
      lastAmbient.current = t;
    }

    for (let i = 0; i < ALL.length; i++) {
      const isStage = i >= SOURCES.length && i < SOURCES.length + STAGES.length;
      const isBg = i >= SOURCES.length + STAGES.length;
      const appear = THREE.MathUtils.clamp(a * 1.5 - (i / ALL.length) * 0.5, 0, 1);
      const base = isStage ? (i === SOURCES.length + 2 ? 0.22 : 0.16) : isBg ? 0.06 : 0.12;
      dummy.position.copy(ALL[i]);
      if (isBg) dummy.position.y += Math.sin(t * 0.5 + i) * 0.08;
      dummy.scale.setScalar(base * (isBg ? 0.4 + appear * 0.6 : 0.25 + appear * 0.75));
      dummy.updateMatrix();
      nodes.current!.setMatrixAt(i, dummy.matrix);
    }
    nodes.current!.instanceMatrix.needsUpdate = true;

    // pulses travel source → sent → accepted → converted
    live.current = live.current.filter((p) => {
      if (t - p.t0 < PULSE_S) return true;
      burstT.current = t;
      return false;
    }).slice(-POOL);
    for (let k = 0; k < POOL; k++) {
      const p = live.current[k];
      if (!p) { dummy.scale.setScalar(0); dummy.updateMatrix(); pulses.current!.setMatrixAt(k, dummy.matrix); continue; }
      const u = (t - p.t0) / PULSE_S;
      const pts = [SOURCES[p.from], ...STAGES];
      const seg = u < 0.4 ? 0 : u < 0.7 ? 1 : 2;
      const span = [[0, 0.4], [0.4, 0.7], [0.7, 1]][seg];
      const lu = THREE.MathUtils.smoothstep((u - span[0]) / (span[1] - span[0]), 0, 1);
      dummy.position.lerpVectors(pts[seg], pts[seg + 1], lu);
      dummy.scale.setScalar(0.11);
      dummy.updateMatrix();
      pulses.current!.setMatrixAt(k, dummy.matrix);
    }
    pulses.current!.instanceMatrix.needsUpdate = true;

    // conversion burst at the last stage
    const b = THREE.MathUtils.clamp((t - burstT.current) / 0.8, 0, 1);
    burst.current!.scale.setScalar(0.3 + b * 1.4);
    (burst.current!.material as THREE.MeshBasicMaterial).opacity = 1 - b;

    (bright.current!.material as THREE.LineBasicMaterial).opacity = 0.2 + a * 0.6;
    (faint.current!.material as THREE.LineBasicMaterial).opacity = 0.05 + a * 0.15;
  });

  return (
    <>
      <instancedMesh ref={nodes} args={[undefined, undefined, ALL.length]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color={hot(BAYS.referral.color, 2.2)} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={pulses} args={[undefined, undefined, POOL]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={hot("#ffffff", 3)} toneMapped={false} />
      </instancedMesh>
      <lineSegments ref={bright}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[brightPos, 3]} /></bufferGeometry>
        <lineBasicMaterial color={hot(BAYS.referral.color, 1.4)} transparent opacity={0.3} toneMapped={false} />
      </lineSegments>
      <lineSegments ref={faint}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[faintPos, 3]} /></bufferGeometry>
        <lineBasicMaterial color={BAYS.referral.color} transparent opacity={0.08} />
      </lineSegments>
      <mesh ref={burst} position={STAGES[2]}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial color={hot(BAYS.referral.color, 3)} transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}
