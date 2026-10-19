"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScene } from "../store";

const STEPS = ["offer letter signed", "laptop requested", "payroll profile created", "welcome mail sent"];

// Drag the new hire onto the empty org-chart slot (or tap/Enter to place).
export default function HrDemo({ live = true }: { live?: boolean }) {
  const slot = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState(false);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!placed || done >= STEPS.length) return;
    const t = setTimeout(() => setDone((d) => d + 1), 550);
    return () => clearTimeout(t);
  }, [placed, done]);

  useEffect(() => { useScene.setState({ hired: placed }); }, [placed]);

  const reset = () => { setPlaced(false); setDone(0); };

  return (
    <div className="h-full grid grid-rows-[1.3fr_1fr] sm:grid-rows-1 sm:grid-cols-[1.4fr_1fr] gap-4 p-5 text-[12px] select-none">
      {/* org chart */}
      <div className="relative flex flex-col items-center justify-center gap-6 pb-10 sm:pb-0">
        <Node label="Priya · HR Head" strong live={live} i={0} />
        <div className="h-5 w-px bg-white/15 -my-4" />
        <div className="flex gap-3 sm:gap-5">
          <Node label="Arjun · Eng" live={live} i={1} />
          <Node label="Meera · Sales" live={live} i={2} />
          <div
            ref={slot}
            className={`flex h-14 w-24 sm:w-28 items-center justify-center rounded-lg border text-center transition-all duration-300 ${
              placed ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_15%,transparent)]" : "border-dashed border-white/25 text-white/30"
            }`}
          >
            {placed ? <span className="text-white">Rohan · Design</span> : "open role"}
          </div>
        </div>

        {!placed && (
          <motion.button
            drag
            dragSnapToOrigin
            whileDrag={{ scale: 1.08, cursor: "grabbing" }}
            onDragEnd={(_, info) => {
              const r = slot.current?.getBoundingClientRect();
              if (r && info.point.x > r.left - 20 && info.point.x < r.right + 20 && info.point.y > r.top - 20 && info.point.y < r.bottom + 20) {
                setPlaced(true);
              }
            }}
            onTap={() => setPlaced(true)} // onTap (not onClick): doesn't fire after a drag
            className="absolute bottom-1 left-1 flex items-center gap-2 rounded-lg bg-[var(--accent)] text-black px-3 py-2 font-medium cursor-grab touch-none"
            aria-label="Place new hire Rohan into the open role"
          >
            <span className="h-5 w-5 rounded-full bg-black/20" /> new hire: Rohan
          </motion.button>
        )}
        {!placed && <p className="absolute bottom-1 right-1 text-white/30">drag into the open role →</p>}
      </div>

      {/* onboarding checklist */}
      <div className="flex flex-col justify-center gap-2.5 border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-4 sm:pt-0 sm:pl-4">
        <p className="os-label mb-1">onboarding</p>
        {STEPS.map((s, i) => (
          <div key={s} className={`flex items-center gap-2 transition-colors duration-300 ${i < done ? "text-white" : "text-white/30"}`}>
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] transition-all duration-300 ${
                i < done ? "bg-[var(--accent)] border-[var(--accent)] text-black" : "border-white/20"
              }`}
            >
              {i < done && "✓"}
            </span>
            {s}
          </div>
        ))}
        {done === STEPS.length && (
          <button onClick={reset} className="mt-2 self-start text-white/40 hover:text-white underline underline-offset-4">
            reset
          </button>
        )}
      </div>
    </div>
  );
}

function Node({ label, strong, live, i }: { label: string; strong?: boolean; live: boolean; i: number }) {
  return (
    <div
      style={{ transitionDelay: `${0.4 + i * 0.15}s` }}
      className={`transition-all duration-700 ${live ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} flex h-14 w-24 sm:w-28 items-center justify-center rounded-lg border text-center px-1 ${strong ? "border-white/30 text-white" : "border-white/10 text-white/60"}`}>
      {label}
    </div>
  );
}
