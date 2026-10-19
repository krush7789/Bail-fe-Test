"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "../store";
import { BAYS, ORANGE, RINGS_Z, hot } from "./layout";

const damp = (k: number, dt: number) => 1 - Math.pow(k, dt);

// Arched path between two points (lifted in the middle).
const arc = (a: THREE.Vector3, b: THREE.Vector3, lift = 2.5) =>
  new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).setY(Math.max(a.y, b.y) + lift), b);

const CORE = new THREE.Vector3(0, 0, 0);
const SPOKES = [arc(CORE, BAYS.hr.pos), arc(CORE, BAYS.inventory.pos), arc(CORE, BAYS.referral.pos, 3.5)];
const CHAIN = [arc(BAYS.hr.pos, BAYS.inventory.pos, 3), arc(BAYS.inventory.pos, BAYS.referral.pos, 3)];

// "Built to work together": light conduits from the Core to every bay and
// along the chain HR → Inventory → Referral. A pulse runs the chain in step
// with the HTML story (store.togetherStep).
export function Conduits() {
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const pulse = useRef<THREE.Mesh>(null);
  const prog = useRef(0);

  useFrame((_, dt) => {
    const { section, togetherStep } = useScene.getState();
    const on = section === "together";
    mats.current.forEach((m) => { m.opacity = THREE.MathUtils.lerp(m.opacity, on ? 0.9 : 0, damp(0.2, dt));
      m.visible = m.opacity > 0.01; });

    // step 0 = at HR, 1 = at Inventory, 2+ = at Referral
    const target = togetherStep < 0 ? 0 : Math.min(togetherStep, 2) / 2;
    prog.current = THREE.MathUtils.lerp(prog.current, target, damp(0.08, dt));
    const u = prog.current * 2;
    const p = u < 1 ? CHAIN[0].getPoint(u) : CHAIN[1].getPoint(Math.min(u - 1, 1));
    pulse.current!.position.copy(p);
    pulse.current!.visible = on && togetherStep >= 0;
  });

  const tube = (c: THREE.Curve<THREE.Vector3>, i: number, color: string, r: number) => (
    <mesh key={i}>
      <tubeGeometry args={[c, 96, r, 8, false]} />
      <meshBasicMaterial
        ref={(m) => { if (m) mats.current[i] = m; }}
        color={hot(color, 2.6)}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );

  return (
    <>
      {SPOKES.map((c, i) => tube(c, i, ORANGE, 0.07))}
      {CHAIN.map((c, i) => tube(c, 3 + i, "#ffffff", 0.11))}
      <mesh ref={pulse}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color={hot(ORANGE, 4)} toneMapped={false} />
      </mesh>
    </>
  );
}

// Process: three gates the camera flies through; each ignites as it approaches.
export function ProcessRings() {
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const dim = useMemo(() => hot("#ffffff", 0.35), []);
  const lit = useMemo(() => hot(ORANGE, 3.2), []);

  useFrame(({ camera }, dt) => {
    RINGS_Z.forEach((z, i) => {
      const m = mats.current[i];
      if (!m) return;
      const near = THREE.MathUtils.clamp(1 - (camera.position.z - z) / 8, 0, 1); // 0 far ahead → 1 at/through
      m.color.lerp(near > 0.4 ? lit : dim, damp(0.1, dt));
    });
  });

  return (
    <>
      {RINGS_Z.map((z, i) => (
        <group key={z} position={[0, 1.4, z]}>
          <mesh>
            <torusGeometry args={[2.8, 0.035, 16, 200]} />
            <meshBasicMaterial ref={(m) => { if (m) mats.current[i] = m; }} color={dim} toneMapped={false} />
          </mesh>
          {/* faint inner disc so each gate reads as a portal */}
          <mesh>
            <circleGeometry args={[2.75, 96]} />
            <meshBasicMaterial color={ORANGE} transparent opacity={0.03} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}
