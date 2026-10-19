"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode, type ChromaticAberrationEffect } from "postprocessing";
import * as THREE from "three";
import { useScene } from "../store";

// Cinematic pass: bloom on the emissive parts, a lens split that opens only
// during the dive, vignette, ACES. (Depth of field was tried and dropped: it
// smeared the Core's burning heart into an oversized bokeh disc.)
const CA_OFFSET = new THREE.Vector2(0, 0);

export default function Effects() {
  const ca = useRef<ChromaticAberrationEffect>(null);

  useFrame((_, dt) => {
    const k = useScene.getState().diving ? 0.012 : 0;
    CA_OFFSET.setScalar(THREE.MathUtils.lerp(CA_OFFSET.x, k, 1 - Math.pow(0.05, dt)));
    if (ca.current) ca.current.offset.copy(CA_OFFSET);
  });

  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.85} radius={0.6} />
      <ChromaticAberration ref={ca} offset={CA_OFFSET} radialModulation modulationOffset={0.2} />
      <Vignette offset={0.25} darkness={0.75} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
