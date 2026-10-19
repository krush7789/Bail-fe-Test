"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { useScene } from "../store";

const RINGS = 14;
const SPACING = 4;

// Inside the Core: a slow tunnel of light rings drifting toward the viewer,
// tinted by the hovered Work card (store.workAccent). Sits behind /work pages.
function Tunnel() {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const color = useMemo(() => new THREE.Color(), []);
  const target = useMemo(() => new THREE.Color(), []);

  useFrame(({ pointer, camera }, dt) => {
    const g = group.current!;
    g.children.forEach((ring, i) => {
      ring.position.z += dt * 1.2;
      if (ring.position.z > 4) ring.position.z -= RINGS * SPACING; // loop
      ring.rotation.z += dt * 0.05 * (i % 2 ? 1 : -1);
    });
    target.set(useScene.getState().workAccent).multiplyScalar(2.2);
    color.lerp(target, 1 - Math.pow(0.1, dt));
    mats.current.forEach((m, i) => {
      const z = g.children[i].position.z;
      m.color.copy(color);
      m.opacity = THREE.MathUtils.clamp(1 - Math.abs(z + 14) / 22, 0, 1) * 0.55;
    });
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.6, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.4, 0.05);
    camera.lookAt(0, 0, -20);
  });

  return (
    <group ref={group}>
      {Array.from({ length: RINGS }, (_, i) => (
        <mesh key={i} position={[0, 0, -i * SPACING]}>
          <torusGeometry args={[5, 0.012, 8, 220]} />
          <meshBasicMaterial ref={(m) => { if (m) mats.current[i] = m; }} transparent toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function VaultBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 2]} gl={{ antialias: false }}>
        <color attach="background" args={["#08090a"]} />
        <fog attach="fog" args={["#08090a", 6, 40]} />
        <Tunnel />
        <Sparkles count={220} scale={[16, 10, 40]} position={[0, 0, -16]} size={2.2} speed={0.3} color={new THREE.Color("#ed821c").multiplyScalar(2)} opacity={0.6} />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.9} radius={0.7} />
          <Vignette offset={0.2} darkness={0.85} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
