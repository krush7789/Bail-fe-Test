"use client";

import React, { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

// ----- Fibonacci sphere distribution -----
function fibonacciSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    positions[i * 3] = r * Math.cos(theta) * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = r * Math.sin(theta) * radius;
  }
  return positions;
}

// ----- Random points inside sphere -----
function randomInsideSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random()) * radius * 0.8;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

// ----- Inner particle scene -----
function OrbScene() {
  const outerRef = useRef<THREE.Points>(null);
  const innerRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const displacement = useRef({ x: 0, y: 0 });

  const { gl } = useThree();

  // 3000 outer surface particles
  const outerPositions = useMemo(() => fibonacciSphere(3000, 1.0), []);
  const outerBasePositions = useMemo(() => outerPositions.slice(), [outerPositions]);

  // 500 inner cyan particles
  const innerPositions = useMemo(() => randomInsideSphere(500, 0.9), []);

  // Handle pointer move on the canvas element
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const rect = (gl.domElement as HTMLCanvasElement).getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl]);

  React.useEffect(() => {
    const canvas = gl.domElement as HTMLCanvasElement;
    canvas.addEventListener("pointermove", handlePointerMove);
    return () => canvas.removeEventListener("pointermove", handlePointerMove);
  }, [gl, handlePointerMove]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Lerp displacement toward mouse
    displacement.current.x += (mouse.current.x * 0.25 - displacement.current.x) * 0.05;
    displacement.current.y += (mouse.current.y * 0.25 - displacement.current.y) * 0.05;

    if (groupRef.current) {
      // Ambient rotation
      groupRef.current.rotation.y += 0.001;
      groupRef.current.rotation.x += 0.0005;

      // Breathing scale
      const breathe = 0.95 + Math.sin(t * 0.8) * 0.05;
      groupRef.current.scale.setScalar(breathe);
    }

    // Particle deflection on outer orb
    if (outerRef.current) {
      const positions = outerRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 3000; i++) {
        const bx = outerBasePositions[i * 3];
        const by = outerBasePositions[i * 3 + 1];
        const bz = outerBasePositions[i * 3 + 2];
        const wave = Math.sin(t * 1.5 + i * 0.01) * 0.008;
        positions[i * 3] = bx + displacement.current.x * wave * 10 + Math.sin(t + i * 0.05) * 0.004;
        positions[i * 3 + 1] = by + displacement.current.y * wave * 10;
        positions[i * 3 + 2] = bz + wave;
      }
      outerRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer orange surface particles */}
      <points ref={outerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[outerPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.012}
          color="#ed821c"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Inner cyan particles */}
      <points ref={innerRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[innerPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.008}
          color="#00d4ff"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ----- Fallback SVG for reduced-motion -----
function StaticOrbFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ maxWidth: 400, maxHeight: 400 }}>
        <defs>
          <radialGradient id="orb-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ed821c" stopOpacity="0.6" />
            <stop offset="45%" stopColor="#3d45a8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#080c1a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orb-inner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="180" fill="url(#orb-grad)" />
        <circle cx="200" cy="200" r="90" fill="url(#orb-inner)" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="#ed821c" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" fill="none" stroke="#ed821c" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="#00d4ff" strokeOpacity="0.2" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ----- Default export: NeuralOrb Canvas wrapper -----
export default function NeuralOrb() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <StaticOrbFallback />;
  }

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 2]}
      camera={{ fov: 60, position: [0, 0, 3] as [number, number, number] }}
    >
      <ambientLight intensity={0.5} />
      <OrbScene />
    </Canvas>
  );
}
