import * as THREE from "three";

// World layout. The Core sits at the origin; the camera walks a path past
// three product bays, over them (together), through three gates (process)
// and back to the Core (contact).

export const ORANGE = "#ed821c";
export const hot = (hex: string, k = 3) => new THREE.Color(hex).multiplyScalar(k); // >1 → crosses bloom threshold

export const BAYS = {
  hr: { pos: new THREE.Vector3(-14, 0, -12), color: "#ed821c", side: -1 },        // text left → bay framed left
  inventory: { pos: new THREE.Vector3(14, 0, -22), color: "#34d399", side: 1 },  // text right → bay framed right
  referral: { pos: new THREE.Vector3(-14, 0, -32), color: "#8b5cf6", side: -1 },
} as const;
export type BayId = keyof typeof BAYS;

export const RINGS_Z = [-44, -50, -56];

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// Camera pose that frames a bay on the side of the screen opposite the demo.
export function bayPose(id: BayId) {
  const { pos, side } = BAYS[id];
  const shift = -side * 3.4; // move the view axis away so the bay sits off-centre
  return { pos: pos.clone().add(v(shift, 1.8, 7.5)), look: pos.clone().add(v(shift, 0.5, 0)) };
}

// Head-on "showcase" shot used while the bay assembles, before the panels arrive.
export function bayStagePose(id: BayId) {
  const { pos } = BAYS[id];
  return { pos: pos.clone().add(v(0, 2.4, 9.5)), look: pos.clone().add(v(0, 0.5, 0)) };
}

export const POSES = {
  heroStart: { pos: v(0, 0.6, 8), look: v(0, -0.75, 0) },
  heroEnd: { pos: v(0, 0.15, 4.4), look: v(0, 0.1, 0) },
  together: { pos: v(0, 22, 9), look: v(0, -2, -19) },
  processIn: { pos: v(0, 1.5, -37), look: v(0, 1.4, -48) },
  processOut: { pos: v(0, 1.5, -59), look: v(0, 1.4, -70) },
  contact: { pos: v(1.6, 0.5, 4.6), look: v(-0.6, 0.2, 0) },
};
