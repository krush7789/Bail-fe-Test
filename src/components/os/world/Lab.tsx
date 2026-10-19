"use client";

import { useLayoutEffect, useRef } from "react";
import { Environment, Lightformer, MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { ORANGE, hot } from "./layout";

// The room: light pillars around the Core, a long reflective floor under the
// whole path, drifting dust, and studio reflections (no HDR download).
export default function Lab() {
  return (
    <>
      <Pillars />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, -30]}>
        <planeGeometry args={[180, 180]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0b0d"
          metalness={0.6}
          mirror={0.5}
        />
      </mesh>
      <Sparkles count={120} scale={[14, 5, 12]} position={[0, 0.5, 0]} size={2.4} speed={0.25} color={hot(ORANGE)} opacity={0.7} />
      <Sparkles count={360} scale={[44, 8, 75]} position={[0, 1, -32]} size={2} speed={0.2} color={hot("#ffffff", 1.4)} opacity={0.35} />
      <hemisphereLight args={["#ffffff", "#08090a", 0.15]} />
      <Environment resolution={256}>
        <Lightformer form="circle" intensity={0.7} position={[-1.5, 6, 1]} rotation-x={Math.PI / 2} scale={2.5} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[-6, 0.5, 0]} rotation-y={Math.PI / 2} scale={[0.4, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.5} position={[6, 0.5, 0]} rotation-y={-Math.PI / 2} scale={[0.4, 6, 1]} color="#ffffff" />
        <Lightformer form="ring" intensity={6} position={[0, 2, -5]} scale={4} color={ORANGE} />
      </Environment>
    </>
  );
}

// Back arc of light pillars around the Core — two instanced draw calls.
function Pillars() {
  const warm = useRef<THREE.InstancedMesh>(null);
  const cool = useRef<THREE.InstancedMesh>(null);
  const N = 14;
  const warmCount = Math.ceil(N / 4);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    let w = 0, c = 0;
    for (let i = 0; i < N; i++) {
      const a = Math.PI * (1.08 + (i / (N - 1)) * 0.84); // ~195°→345°, never in front of the camera
      m.makeTranslation(Math.cos(a) * 9, 1.2, Math.sin(a) * 6 - 1);
      if (i % 4 === 0) warm.current!.setMatrixAt(w++, m);
      else cool.current!.setMatrixAt(c++, m);
    }
    warm.current!.instanceMatrix.needsUpdate = true;
    cool.current!.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <instancedMesh ref={warm} args={[undefined, undefined, warmCount]}>
        <boxGeometry args={[0.05, 6, 0.05]} />
        <meshBasicMaterial color={hot(ORANGE)} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={cool} args={[undefined, undefined, N - warmCount]}>
        <boxGeometry args={[0.04, 6, 0.04]} />
        <meshBasicMaterial color={hot("#ffffff", 1.6)} transparent opacity={0.35} toneMapped={false} />
      </instancedMesh>
    </>
  );
}
