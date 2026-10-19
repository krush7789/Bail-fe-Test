"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { n: "01", title: "discover", text: "We map your workflows and pick the highest-ROI system to build first." },
  { n: "02", title: "build", text: "Weekly milestones, your team reviewing every step. No black boxes." },
  { n: "03", title: "deploy", text: "We go live, monitor and iterate. You own the code, models and infra." },
];

// Outlined numerals fill solid, one after another, as you scroll.
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fills = gsap.utils.toArray<HTMLElement>(".os-numeral > span");
      const texts = gsap.utils.toArray<HTMLElement>("[data-step-text]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      fills.forEach((f, i) => {
        tl.to(f, { clipPath: "inset(0% 0 0 0)", ease: "none" }, i);
        tl.to(texts[i], { opacity: 1, ease: "none" }, i + 0.5);
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="process" className="relative h-[220vh] px-4 sm:px-8">
      {/* sticky: the steps stay put while the camera flies through the three gates */}
      <div className="sticky top-0 mx-auto flex h-[100svh] max-w-6xl flex-col justify-center">
        <p className="os-label">how we build</p>
        <h2 className="os-display mt-4 text-[clamp(40px,6vw,72px)] leading-none">three steps. no surprises.</h2>

        <div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-8">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="os-numeral" aria-hidden>
                {s.n}
                <span>{s.n}</span>
              </div>
              <div data-step-text className="mt-6 opacity-30">
                <h3 className="text-2xl">{s.title}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-[var(--os-dim)]">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
