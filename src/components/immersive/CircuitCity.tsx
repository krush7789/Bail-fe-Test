"use client";

import React, { useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, Line } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { pillars } from "@/content/catalog";

// Brand hex values (mirrors --bail-orange / --glow-navy / --ink tokens —
// Three materials can't read CSS custom properties).
const AUTOMATE_COLOR = "#ed821c";
const GROW_COLOR = "#3d45a8";
const TRACE_COLOR = "#00d4ff";

type Building = {
  id: number;
  title: string;
  hook: string;
  whatWeBuild: string[];
  pillarLabel: string;
  x: number;
  height: number;
  color: string;
};

function buildCityLayout(): Building[] {
  const gap = 2.6;
  const districtGap = 4;
  const buildings: Building[] = [];
  let x = 0;

  pillars.forEach((pillar) => {
    pillar.services.forEach((service) => {
      buildings.push({
        id: service.id,
        title: service.title,
        hook: service.hook,
        whatWeBuild: service.whatWeBuild,
        pillarLabel: pillar.label,
        x,
        // deterministic pseudo-random height so the skyline varies without SSR/CSR drift
        height: 1.4 + ((service.id * 37) % 10) / 10 * 1.6,
        color: pillar.id === "automate" ? AUTOMATE_COLOR : GROW_COLOR,
      });
      x += gap;
    });
    x += districtGap;
  });

  return buildings;
}

function CityScene({
  buildings,
  progressRef,
  onFocusChange,
}: {
  buildings: Building[];
  progressRef: RefObject<number>;
  onFocusChange: (index: number) => void;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lastFocusRef = useRef(-1);

  const startX = buildings[0].x - 3;
  const endX = buildings[buildings.length - 1].x + 3;
  const totalWidth = endX - startX;

  useFrame(({ camera }) => {
    const progress = progressRef.current ?? 0;
    const camX = THREE.MathUtils.lerp(startX, endX, progress);
    camera.position.set(camX, 3.2, 7);
    camera.lookAt(camX, 1.2, 0);

    let closestIndex = 0;
    let closestDist = Infinity;

    buildings.forEach((b, i) => {
      const dist = Math.abs(camX - b.x);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }

      const mesh = meshRefs.current[i];
      if (mesh) {
        const revealed = THREE.MathUtils.smoothstep(camX, b.x - 5, b.x - 1);
        const focused = 1 - THREE.MathUtils.clamp(dist / 4, 0, 1);
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.clamp(
          revealed * 0.5 + focused * 1.2,
          0.08,
          1.8
        );
      }
    });

    if (closestIndex !== lastFocusRef.current) {
      lastFocusRef.current = closestIndex;
      onFocusChange(closestIndex);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 8, 4]} intensity={0.4} color="#ffffff" />

      <Grid
        position={[startX + totalWidth / 2, 0, 0]}
        args={[totalWidth + 12, 16]}
        cellColor="#1c2440"
        sectionColor={TRACE_COLOR}
        sectionThickness={1}
        cellThickness={0.5}
        fadeDistance={30}
        infiniteGrid={false}
      />

      <Line
        points={buildings.map((b) => [b.x, 0.02, 0] as [number, number, number])}
        color={TRACE_COLOR}
        lineWidth={1}
        transparent
        opacity={0.35}
      />

      {buildings.map((b, i) => (
        <mesh
          key={b.id}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[b.x, b.height / 2, 0]}
        >
          <boxGeometry args={[0.9, b.height, 0.9]} />
          <meshStandardMaterial
            color="#0d1224"
            emissive={b.color}
            emissiveIntensity={0.1}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      ))}
    </>
  );
}

export default function CircuitCity({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const prefersReduced = useReducedMotion();
  const buildings = useMemo(buildCityLayout, []);
  const [focusedIndex, setFocusedIndex] = useState(0);

  if (prefersReduced !== false) return null;

  const focused = buildings[focusedIndex];

  return (
    <div className="relative w-full h-full">
      <Canvas
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]}
        camera={{ fov: 50, position: [buildings[0].x - 3, 3.2, 7] }}
      >
        <color attach="background" args={["#080c1a"]} />
        <fog attach="fog" args={["#080c1a", 12, 34]} />
        <CityScene
          buildings={buildings}
          progressRef={progressRef}
          onFocusChange={setFocusedIndex}
        />
      </Canvas>

      {/* Detail panel synced to the currently-focused building */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center px-6">
        <div className="pointer-events-auto max-w-md w-full rounded-2xl border border-white/10 bg-[#0d1224]/80 backdrop-blur-md px-6 py-5 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] text-white/40">
              {String(focused.id).padStart(2, "0")}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: focused.color }}
            >
              {focused.pillarLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1.5">{focused.title}</h3>
          <p className="text-sm text-white/60 leading-relaxed mb-3">{focused.hook}</p>
          <div className="flex flex-wrap gap-1.5">
            {focused.whatWeBuild.slice(0, 3).map((item) => (
              <span
                key={item}
                className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/50 bg-white/5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
