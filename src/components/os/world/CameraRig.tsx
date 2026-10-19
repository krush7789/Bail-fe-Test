"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "../store";
import { POSES, bayPose, bayStagePose } from "./layout";

interface Key { at: number; pos: THREE.Vector3; look: THREE.Vector3 }

// per-frame scratch (module scope: mutated every frame, never part of React state)
const pos = new THREE.Vector3();
const look = new THREE.Vector3();
const smoothLook = new THREE.Vector3(0, -0.75, 0);

const top = (id: string) => {
  const el = document.getElementById(id);
  return el ? { y: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight } : null;
};

// Scroll-position keyframes, rebuilt whenever the page layout changes.
// Each section "holds" its pose while it is read, and the camera travels
// between poses during the viewport-height of scroll in between.
function buildKeys(): Key[] {
  const vh = window.innerHeight;
  const keys: Key[] = [];
  const add = (at: number, p: { pos: THREE.Vector3; look: THREE.Vector3 }) => keys.push({ at, ...p });
  const hero = top("hero");
  add(0, POSES.heroStart);
  if (hero) add(hero.y + hero.h - vh, POSES.heroEnd);
  for (const id of ["hr", "inventory", "referral"] as const) {
    const s = top(id);
    if (!s) continue;
    // stage: head-on while the bay assembles → then slide aside for the panels
    const stage = bayStagePose(id), side = bayPose(id);
    add(s.y, stage);
    add(s.y + vh * 0.35, stage);
    add(s.y + vh, side);
    add(s.y + Math.max(vh + 1, s.h - vh), side);
  }
  const t = top("together");
  if (t) { add(t.y, POSES.together); add(t.y + Math.max(1, t.h - vh), POSES.together); }
  const p = top("process");
  if (p) { add(p.y, POSES.processIn); add(p.y + p.h - vh, POSES.processOut); }
  const c = top("contact");
  if (c) add(c.y, POSES.contact);
  return keys.sort((a, b) => a.at - b.at);
}

const ease = (t: number) => t * t * (3 - 2 * t);

export default function CameraRig() {
  const keys = useRef<Key[]>([]);

  useEffect(() => {
    const rebuild = () => { keys.current = buildKeys(); };
    rebuild();
    const ro = new ResizeObserver(rebuild);
    ro.observe(document.body);
    window.addEventListener("resize", rebuild);
    return () => { ro.disconnect(); window.removeEventListener("resize", rebuild); };
  }, []);

  useFrame(({ camera, pointer, size, clock, scene }, dt) => {
    const cam = camera as THREE.PerspectiveCamera;
    const { diving, section } = useScene.getState();
    const k = keys.current;

    if (diving) {
      cam.position.lerp(pos.set(0, 0.1, 0.4), 1 - Math.pow(0.02, dt));
      smoothLook.lerp(look.set(0, 0.1, 0), 1 - Math.pow(0.02, dt));
      cam.fov = THREE.MathUtils.lerp(cam.fov, 70, 1 - Math.pow(0.05, dt));
      cam.updateProjectionMatrix();
    } else if (k.length) {
      // locate the scroll position between two keyframes and blend
      const y = window.scrollY;
      let i = 0;
      while (i < k.length - 1 && y >= k[i + 1].at) i++;
      const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
      const t = b.at > a.at ? ease(THREE.MathUtils.clamp((y - a.at) / (b.at - a.at), 0, 1)) : 0;
      pos.lerpVectors(a.pos, b.pos, t);
      look.lerpVectors(a.look, b.look, t);

      // life: pointer parallax + a slow breathing drift
      const time = clock.elapsedTime;
      pos.x += pointer.x * 0.45 + Math.sin(time * 0.25) * 0.15;
      pos.y += pointer.y * 0.25 + Math.sin(time * 0.33) * 0.08;

      cam.position.lerp(pos, 1 - Math.pow(0.04, dt));
      smoothLook.lerp(look, 1 - Math.pow(0.04, dt));

      // portrait: widen the lens instead of dollying back
      const fov = Math.min(64, 40 * Math.max(1, 0.75 / (size.width / size.height)));
      if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = THREE.MathUtils.lerp(cam.fov, fov, 0.1); cam.updateProjectionMatrix(); }
    }
    cam.lookAt(smoothLook);

    // the top-down "together" shot sees much further — open the fog up there
    const fog = scene.fog as THREE.Fog | null;
    if (fog) fog.far = THREE.MathUtils.lerp(fog.far, section === "together" ? 80 : 24, 0.05);
  });

  return null;
}
