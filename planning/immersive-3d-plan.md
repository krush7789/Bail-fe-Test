# Bits AI Lab — Immersive 3D Experience: Architecture Plan

Status: **proposal, awaiting sign-off before implementation**. Covers `/os` (new home), `/work`, `/work/[slug]`.

## 0. Inputs

**Source of truth for content**
- `doc/bits-ai-lab-knowledge-base.md` — company, differentiators, process (Discover → Build → Deploy), facts, contact, pricing policy.
- `SERVICES.md` — the four pillars (Automate · Grow · Analyse · Scale).
- Owner decisions in this redesign: homepage features **only the 3 flagship products** (Bail HR, Bail Inventory, Bail Referral). Everything else (Voice agent, custom builds, services) lives under **Work**. Clicking the orb enters Work. Visual direction: **A + B hybrid** — a cinematic lab hero (A) with precise, Linear-style product sections (B).

**Technical references (patterns only — no design or content copied)**
| Reference | Pattern we take |
|---|---|
| skinnye/3d-web-pack | Stack and budgets: R3F + drei, GSAP/Lenis, postprocessing (bloom, DOF, grain), gltf-transform/Draco/KTX2, instancing, LOD, `frameloop="demand"`, stats-gl |
| jawad-portfolio-v2 | Scroll position → camera path through GSAP ScrollTrigger; a reduced-motion fallback |
| coffee-portfolio | Zustand for global scene state; postprocessing bloom + DOF; a timeline-choreographed scene |
| brylcoderr 3d-interactive-portfolio | Damped scroll-reactive camera, a cursor follower that changes state over meshes, magnetic CTAs, hover video on cards, split-text reveals |
| threejsresources R3F showcase | General benchmark for quality |
| Reference #5 | **The link in the brief was broken** (it showed only "c"). Not used. |

**Already in the repo:** `three` 0.184, `@react-three/fiber` 9, `@react-three/drei` 10, `gsap` 3.15, `lenis`, `framer-motion` 12, Tailwind 4.
**To add:** `@react-three/postprocessing` + `postprocessing`, `zustand`. Dev only: `@gltf-transform/cli` (only if we add GLBs).

## 1. Experience concept — "Enter the Lab"

The homepage is **one continuous 3D world: the Bits AI Lab.** Scrolling *is* the camera walking through the lab. There is no "page with a 3D object behind it".

- **The Core** (the orb) sits at the centre of the lab. It stands for the AI that powers everything. It is the hero, the narrative anchor, and the **door to Work**.
- Three **product bays** branch off the Core: HR, Inventory and Referral. Each bay is a 3D model of what that product *does*, not a decoration:
  - **HR bay:** a constellation of people nodes that assembles into an org tree.
  - **Inventory bay:** instanced stock crates on shelves that drain and refill.
  - **Referral bay:** a network graph where light pulses travel from referrers to conversions.
- The camera visits each bay in turn. At each stop, **HTML panels with the real interactive demo** slide over the 3D scene. 3D tells the story; HTML carries the detail.
- **"Built to work together":** the camera rises to a top-down view of all three bays wired to the Core by light conduits. One event visibly travels HR → Inventory → Referral.
- **Process:** the camera passes through three gates (Discover, Build, Deploy).
- **Contact:** the camera settles back at the Core in calm light, and a plain HTML form takes over.
- **Work** (`/work`) is the **inside of the Core**. Clicking the orb dives the camera into it. The Work page opens in a tunnel of soft orange light, and the project cards sit in HTML over a slow, quiet 3D backdrop.

Rule: **anything a visitor needs to read or use is HTML.** 3D carries the mood and the metaphor. The site stays fully usable with WebGL off.

## 2. Section-by-section 3D interaction plan

| # | Section (HTML) | 3D state | Interaction |
|---|---|---|---|
| 0 | Loader | The Core assembles from particles (~1.5 s, first visit only) | none |
| 1 | Hero: "three systems. zero busywork." + product dock | Wide shot of the lab: Core, light pillars, reflective floor, dust | Cursor parallax on the camera. **Hover Core:** cracks of light open, the label reads "enter the lab". **Click:** the dive into Work. Clicking a dock icon flies the camera to that bay. |
| 2 | Bail HR panel + live demo | Camera at the HR bay. People nodes drift, then snap into an org tree when the panel enters view. | Hovering a node brightens its links. **The demo is linked to the scene:** placing "Rohan" in the HTML demo spawns a new node in 3D. |
| 3 | Bail Inventory panel + demo | Inventory bay: instanced crates on shelves | The demo's "sales" slider **drains the 3D shelves in sync**. Low stock pulses those crates orange. |
| 4 | Bail Referral panel + demo | Referral bay: graph of nodes and edges | Clicking a referrer in the demo **fires the same pulse through the 3D graph** |
| 5 | Built to work together | Top-down crane shot: three bays plus conduits to the Core | Scroll-scrubbed: an event travels HR → Inventory → Referral along the conduits, in sync with the HTML tiles |
| 6 | Process (01 / 02 / 03) | The camera passes through three rings | Each ring lights up as its numeral fills (already scroll-scrubbed in HTML) |
| 7 | Contact | Back at the Core, close-up and calm | The Core reacts gently while the visitor types (glow follows input). Submitting sends a ripple. |
| W | `/work` | Inside the Core: orange light tunnel → dark vault | On arrival the light drains away. Hovering a card faintly tints the backdrop in that card's colour. |
| C | `/work/[slug]` | HTML-first. A small accent-coloured particle field behind the hero only. | Images and video carry these pages; no heavy 3D |

## 3. Camera choreography

**One `CameraRig`** driven by a single GSAP timeline scrubbed by ScrollTrigger (synced with Lenis, which `LenisProvider` already does). Each keyframe holds a camera position and a look-at target. Movement is damped (`easing.damp3`) so it never snaps.

| Key | Scroll anchor | Position → look-at | Move |
|---|---|---|---|
| K0 hero | top | (0, 0.6, 8) → Core | slow dolly-in plus cursor parallax (±0.5) |
| K1 HR | `#hr` top | (−6, 1.2, 3) → HR bay | arc left, 20° yaw |
| K2 Inventory | `#inventory` | (0, 0.8, −5) → Inventory bay | glide behind the Core |
| K3 Referral | `#referral` | (6, 1.4, 3) → Referral bay | arc right |
| K4 together | `#together` | (0, 11, 2) → Core | crane up to top-down |
| K5 process | `#process` | z −10 → −22 through the rings | straight push-through |
| K6 contact | `#contact` | (0, 0.4, 3.2) → Core | settle, close and calm |
| Dive | orb click | lerp to (0, 0.1, 0.4) in 1.1 s, FOV 40 → 70 | then the light flood and route change |

Clicking a dock icon or the progress rail tweens to that section's keyframe and scrolls Lenis there, so the camera and the page stay in agreement.

## 4. 3D asset requirements

Everything is **procedural or instanced**, so **no large GLB downloads are required**. That's the main reason this can stay fast.

| Asset | Build | Budget |
|---|---|---|
| Core | Sphere with `MeshTransmissionMaterial` (desktop) or `MeshPhysicalMaterial` (mobile), emissive icosahedron core, 2 rings | ~20k tris |
| Lab | Instanced light pillars (1 draw call), reflective floor (`MeshReflectorMaterial`, desktop only), fog | <2k tris |
| HR people | `InstancedMesh` capsules (~40) + line segments for edges | 1–2 draw calls |
| Inventory crates | `InstancedMesh` boxes (~120), per-instance colour/scale | 1 draw call |
| Referral graph | Instanced spheres + a `LineSegments` buffer; pulses as instanced sprites | 2–3 draw calls |
| Conduits | `TubeGeometry` along CatmullRom curves, scrolling emissive shader | 3 draw calls |
| Particles | drei `Sparkles` (desktop 80 / mobile 25) | — |
| Lighting | `Environment` built from `Lightformer`s (no HDR download), 1 key spot light with soft shadows on desktop only | — |
| Optional GLB | Only if you later want a sculpted lab platform or a branded object: export, run gltf-transform (Draco geometry + KTX2 textures), target <500 KB, lazy-loaded with `useGLTF` | — |

Total budget: **<150k triangles, <60 draw calls, no single texture over 1k on mobile.**

## 5. Animation timeline (homepage)

```
load ──▶ 0.0s  Core assembles from particles (first visit; skip if session-cached)
         1.2s  headline split-text reveal (staggered words)
         1.6s  product dock rises; cursor parallax enabled
scroll ─▶ hero→HR      camera arc (K0→K1); HR nodes snap into a tree; panel slides in; frame edge sweep
          HR→Inv       glide behind the Core (K1→K2); crates fill shelf by shelf
          Inv→Ref      arc right (K2→K3); graph edges draw in
          Ref→together crane up (K3→K4); conduits light; event travels HR→Inv→Ref (scrubbed)
          →process     push through rings (K5); numerals fill (scrubbed)
          →contact     settle at Core (K6); post-processing calms (less bloom, grain only)
click  ─▶ orb          hover cracks → dive (1.1s) → light flood → /work → light drains (1.4s)
```

## 6. Scroll interaction map

| Scroll driver | Drives | How |
|---|---|---|
| Lenis | page smoothness | already wired to the GSAP ticker |
| ScrollTrigger (one master timeline, `scrub: 1`) | `CameraRig` keyframes, the "together" event, process rings | timeline progress → Zustand `scene.progress` → read in `useFrame` (no React re-renders) |
| ScrollTrigger per section (`onEnter` / `onLeaveBack`) | `scene.section` (which bay is active), bay "assemble" animations, demo `live` flag | toggled once, not scrubbed |
| Framer `whileInView` | HTML panel reveals, frame edge sweep | already in place |
| HTML demo events → Zustand | 3D bay reactions (new hire node, crate drain, referral pulse) | demos call `useScene.getState().emit(...)` |

## 7. Mobile and fallback strategy

Quality tiers are picked once at startup (`useQualityTier`), and drei `PerformanceMonitor` can step the tier down at runtime:

| Tier | Who | What changes |
|---|---|---|
| **Full** | desktops, laptops **and tablets** | full scene, transmission orb, reflector floor, bloom + vignette + grain (+ DOF on hero only), DPR up to 2. Under sustained low fps, `PerformanceMonitor` lowers the DPR only. |
| **Low** | phones (coarse pointer, <768 px) | camera keyframes become **fixed shots per section with crossfades** instead of a free flight; no post-processing; DPR 1; bays simplified |
| **Static** | `prefers-reduced-motion`, no WebGL, or context loss | a pre-rendered poster image per section; everything else is plain HTML. The orb is a button that navigates directly. |

On touch, the orb needs two taps (arm, then enter), which is already built.

## 8. Performance strategy

- **One `<Canvas>` for the homepage**, mounted once and fixed behind the page. No canvas per section.
- **Lazy load:** the canvas chunk loads via `next/dynamic` after the first paint. The hero shows its poster until the scene is ready, then crossfades.
- **Render only when needed:** `frameloop="demand"` while idle. Pause entirely when the tab is hidden or the canvas is off screen (e.g. on case-study pages). Invalidate on scroll and pointer movement.
- **Instancing** for every repeated object (pillars, crates, people, graph nodes).
- **Post-processing kept lean:** one `EffectComposer` with Bloom (mipmap blur, threshold so only emissive parts glow), Vignette and Noise. DOF only on the hero, high tier only. ChromaticAberration only during the dive.
- **Measure, don't guess:** `stats-gl` in development. Targets: 60 fps desktop, ≥45 fps mid-range Android, LCP <2.5 s (poster plus HTML is what LCP measures).
- **WebGPU decision:** **WebGL2 now, WebGPU later.** The effects this design relies on (drei `MeshTransmissionMaterial`, `MeshReflectorMaterial` and pmndrs `postprocessing`) are WebGL-based. Switching renderers now would mean rewriting them in TSL for little visible gain. The architecture keeps materials isolated in `world/materials/` so a WebGPU path can be added later.

## 9. Component architecture

```
src/app/os/page.tsx                 → <HomeExperience/>
src/app/work/page.tsx               → <WorkPage/>
src/app/work/[slug]/page.tsx        → <CaseStudy/>

src/components/os/
  Shell.tsx                         nav, footer, grain, Lenis (exists)
  store.ts                          Zustand: progress, section, tier, hover, portal, events
  quality.ts                        useQualityTier()
  world/                            ── everything WebGL ──
    World.tsx                       the single <Canvas>; tier-aware; poster fallback
    CameraRig.tsx                   keyframes + damping; reads store.progress
    Effects.tsx                     EffectComposer (Bloom / Vignette / Noise / DOF / CA)
    Lab.tsx                         pillars (instanced), floor, fog, lights, environment
    Core.tsx                        orb: transmission / physical by tier; hover cracks; dive
    bays/HrBay.tsx                  instanced people + edges; listens for "hire" events
    bays/InventoryBay.tsx           instanced crates; listens for "stock" events
    bays/ReferralBay.tsx            graph + pulses; listens for "referral" events
    Conduits.tsx                    "together" light paths
    ProcessRings.tsx                three gates
    materials/                      isolated shaders/materials (WebGPU seam)
  sections/                         ── everything HTML ──
    Hero.tsx  ProductPanel.tsx  Together.tsx  Process.tsx  Contact.tsx
  demos/                            HrDemo, InventoryDemo, ReferralDemo, VoiceDemo (exist; emit store events)
  ui/                               Cursor.tsx (state-aware follower), Magnetic.tsx, SplitText.tsx, AppIcon.tsx
  work/                             WorkPage, WorkCard, CaseStudy, VaultBackdrop.tsx (light 3D)
  content/                          products.ts, works.ts (exist)
```

Reuse instead of rebuild: `LenisProvider`, the existing demos and `MediaFrame`, `MagneticButton` (immersive/), `useRealtimeVoice`, `/api/contact`.

## 10. Implementation plan (each phase ends with a browser check at desktop and 390 px)

| Phase | Scope | Done when |
|---|---|---|
| **1. Foundation** | Add `@react-three/postprocessing`, `zustand`. `store.ts`, `quality.ts`, single `World` canvas behind `/os`, `Effects` (real bloom), move the existing orb and lab into `world/`. | Hero looks like today but with real bloom; tiers switch; poster fallback works with WebGL off |
| **2. Camera choreography** | `CameraRig` + master ScrollTrigger timeline, K0–K6 keyframes, dock and rail fly-to | Scrolling flies the camera through all stops smoothly; mobile uses fixed shots |
| **3. Product bays** | HR, Inventory and Referral bays (instanced), demo ↔ scene events | Each HTML demo visibly drives its 3D bay |
| **4. Together + Process + Contact** | Conduits, rings, the Core's contact reactions | Story reads end to end |
| **5. Portal + Work** | Orb hover cracks, dive with FOV + CA, Work light tunnel and `VaultBackdrop` | Orb → Work feels like one continuous move |
| **6. Polish** | Loader, split-text reveals, state-aware cursor, magnetic CTAs, sound toggle (optional) | — |
| **7. Performance pass** | stats-gl profiling, `PerformanceMonitor`, demand frameloop, Lighthouse, real devices | Hits the targets in §8 |
| **8. Launch** | Real assets in, sample content replaced, `/os` becomes `/` (`HOME` constant + `app/page.tsx`) | Owner sign-off |

## Decisions (owner, signed off)

1. **Prices are not published.** "Pricing" CTAs become **"get a quote"**, which goes to the contact form. `/price` stays in the repo, unlinked. **Nothing is deleted from the repo.**
2. **Service pillars become Work filters:** all · products · automate · grow · analyse · scale. Selecting a pillar also shows its services (from `SERVICES.md`).
3. **Laptops and tablets get the Full tier.** Only phones (shortest screen side under 600 px) get Low. `PerformanceMonitor` may lower the DPR at runtime but never removes effects. The knowledge base and `SERVICES.md` are the blueprint.

## Build log (phases 2–7)

- **Quality-first (owner decision):** every device gets the full scene and all effects. There is no reduced-motion fallback and no runtime downgrade. The only fallback is the static CSS orb, for browsers without WebGL2.
- **Depth of field was dropped.** In testing it smeared the Core's bright heart into an oversized bokeh disc. The final pass is bloom, a chromatic-aberration lens split during the dive only, vignette and ACES tone mapping.
- **Each product section opens with a "stage" shot:** the camera frames the bay head-on while it assembles, then slides aside for the copy and demo panels.
- **Process is now a 220vh sticky section,** so the camera flight through the three gates has room to breathe.
- **Bays sit deeper along the path** (z −12 / −22 / −32), so the fog hides them from the hero shot.
