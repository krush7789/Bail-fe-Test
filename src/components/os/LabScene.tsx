"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useScene } from "./store";
import CameraRig from "./world/CameraRig";
import Core from "./world/Core";
import Lab from "./world/Lab";
import Bays from "./world/Bays";
import { Conduits, ProcessRings } from "./world/Story";
import Effects from "./world/Effects";

// The lab world: one canvas, fixed behind the whole homepage. Scroll walks the
// camera from the Core past the three product bays, over them, through the
// process gates and back. Quality-first: full effects on every device.
export default function LabScene({ onEnter }: { onEnter: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 8], fov: 40, near: 0.1, far: 120 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      aria-hidden
    >
      <color attach="background" args={["#08090a"]} />
      <fog attach="fog" args={["#08090a", 7, 24]} />
      <Ready />
      <CameraRig />
      <Lab />
      <Core onEnter={onEnter} />
      <Bays />
      <Conduits />
      <ProcessRings />
      <Effects />
    </Canvas>
  );
}

// Flags the first rendered frame so the loader can step aside.
function Ready() {
  useFrame(() => { if (!useScene.getState().ready) useScene.setState({ ready: true }); });
  return null;
}
