"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useScene } from "../store";
import { ORANGE, hot } from "./layout";
import CoreHeart from "./CoreHeart";

const HOT = hot(ORANGE);

// The Core: glass shell, burning faceted heart, two rings. Hover opens seams of
// light across the shell ("cracks"); click dives in. Typing in the contact
// form makes it flare.
export default function Core({ onEnter }: { onEnter: () => void }) {
  const group = useRef<THREE.Group>(null);
  const heart = useRef<THREE.Mesh>(null);
  const heat = useRef(0.9); // drives the molten heart shader (HDR multiplier)
  const cracks = useRef<THREE.LineSegments>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const scale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  // seams = edges of a low-poly shell just outside the glass
  const crackGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.17, 1)), []);

  useFrame((state, dt) => {
    const { orbHover, diving, typingAt } = useScene.getState();
    const t = state.clock.elapsedTime;
    if (!group.current || !heart.current || !cracks.current) return;

    group.current.position.y = 0.1 + Math.sin(t * 0.8) * 0.06;
    heart.current.rotation.y += dt * 0.15; // slow spin; the shader does the churning
    cracks.current.rotation.y += dt * 0.05;
    ringA.current!.rotation.z += dt * (orbHover ? 0.9 : 0.25);
    ringB.current!.rotation.z -= dt * 0.15;

    // typing in the contact form → short flare that decays
    const typing = Math.max(0, 1 - (performance.now() - typingAt) / 600);
    const target = diving ? 7 : orbHover ? 2.2 : 0.9 + Math.sin(t * 2) * 0.12 + typing * 1.5;
    heat.current = THREE.MathUtils.lerp(heat.current, target, 0.1);
    light.current!.intensity = 14 + heat.current * 4;

    const crackMat = cracks.current.material as THREE.LineBasicMaterial;
    crackMat.opacity = THREE.MathUtils.lerp(crackMat.opacity, orbHover || diving ? 1 : 0, 0.12);

    const s = orbHover || diving ? 1.06 : 1;
    group.current.scale.lerp(scale.set(s, s, s), 0.08);
  });

  const set = useScene.setState;
  return (
    <group ref={group} position={[0, 0.1, 0]}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); set({ orbHover: true }); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { set({ orbHover: false }); document.body.style.cursor = ""; }}
        onClick={(e) => { e.stopPropagation(); onEnter(); }}
      >
        <sphereGeometry args={[1.15, 128, 128]} />
        <MeshTransmissionMaterial
          samples={10}
          resolution={1024}
          thickness={0.45}
          roughness={0.06}
          ior={1.22}
          chromaticAberration={0.015}
          anisotropy={0.2}
          distortion={0.12}
          distortionScale={0.4}
          temporalDistortion={0.04}
          backside
          color="#ffffff"
        />
      </mesh>

      <lineSegments ref={cracks} geometry={crackGeo}>
        <lineBasicMaterial color={HOT} transparent opacity={0} toneMapped={false} />
      </lineSegments>

      <CoreHeart ref={heart} heat={heat} />
      <pointLight ref={light} color={ORANGE} intensity={18} distance={7} />

      <mesh ref={ringA} rotation={[Math.PI / 2.25, 0, 0]}>
        <torusGeometry args={[1.7, 0.006, 16, 240]} />
        <meshBasicMaterial color={HOT} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.8, 0.4, 0]}>
        <torusGeometry args={[2.05, 0.004, 16, 240]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}
