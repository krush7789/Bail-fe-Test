"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScene } from "../store";

const SOURCES = ["Dr. Rao", "City Clinic", "Anita K.", "MedPlus", "Vikram S."].map((name, i) => ({
  name,
  x: 70,
  y: 40 + i * 45,
}));
const STAGES = [
  { name: "sent", x: 200, y: 130 },
  { name: "accepted", x: 290, y: 130 },
  { name: "converted", x: 370, y: 130 },
];

// Click a referrer: a pulse travels sent → accepted → converted.
export default function ReferralDemo({ live = true }: { live?: boolean }) {
  const [pulses, setPulses] = useState<{ id: number; from: number }[]>([]);
  const [count, setCount] = useState(128);

  const fire = (from: number) => {
    setPulses((p) => [...p, { id: Date.now() + Math.random(), from }]);
    useScene.setState((s) => ({ referralCount: s.referralCount + 1, referralFrom: from })); // same pulse in 3D
  };

  useEffect(() => {
    if (!live) return;
    const ids = [0, 2, 4].map((from, k) => setTimeout(() => fire(from), 700 + k * 450));
    return () => ids.forEach(clearTimeout);
  }, [live]);

  return (
    <div className="relative h-full p-3">
      <svg viewBox="0 0 420 260" className="h-full w-full" role="img" aria-label="Referral network">
        {SOURCES.map((s, i) => (
          <line key={i} x1={s.x} y1={s.y} x2={STAGES[0].x} y2={STAGES[0].y} stroke="white" strokeOpacity={0.1} />
        ))}
        <line x1={STAGES[0].x} y1={130} x2={STAGES[2].x} y2={130} stroke="var(--accent)" strokeOpacity={0.4} />

        {STAGES.map((s, i) => (
          <g key={s.name}>
            <circle cx={s.x} cy={s.y} r={i === 2 ? 14 : 10} fill="#141414" stroke="var(--accent)" strokeWidth={1.2} />
            <text x={s.x} y={s.y + 32} textAnchor="middle" fill="white" fillOpacity={0.5} fontSize={11}>{s.name}</text>
          </g>
        ))}

        {/* ring burst on each conversion */}
        <motion.circle
          key={count}
          cx={STAGES[2].x}
          cy={STAGES[2].y}
          fill="none"
          stroke="var(--accent)"
          initial={{ r: 14, opacity: 0.9 }}
          animate={{ r: 34, opacity: 0 }}
          transition={{ duration: 0.8 }}
        />

        {pulses.map((p) => {
          const s = SOURCES[p.from];
          return (
            <motion.circle
              key={p.id}
              r={5}
              fill="var(--accent)"
              initial={{ cx: s.x, cy: s.y }}
              animate={{ cx: [s.x, ...STAGES.map((st) => st.x)], cy: [s.y, ...STAGES.map((st) => st.y)] }}
              transition={{ duration: 1.6, times: [0, 0.4, 0.7, 1], ease: "easeInOut" }}
              onAnimationComplete={() => {
                setPulses((ps) => ps.filter((x) => x.id !== p.id));
                setCount((c) => c + 1);
              }}
            />
          );
        })}

        {SOURCES.map((s, i) => (
          <g key={s.name} onClick={() => fire(i)} className="cursor-pointer group outline-none" role="button" tabIndex={0}
             aria-label={`Send referral from ${s.name}`}
             onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fire(i)}>
            <circle cx={s.x} cy={s.y} r={8} fill="#1c1c1c" stroke="white" strokeOpacity={0.35} className="transition-all group-hover:stroke-[var(--accent)] group-focus-visible:stroke-[var(--accent)] group-focus-visible:[stroke-width:2.5]" />
            <text x={s.x - 16} y={s.y + 4} textAnchor="end" fill="white" fillOpacity={0.6} fontSize={11}>{s.name}</text>
          </g>
        ))}
      </svg>

      <div className="absolute right-5 top-4 text-right">
        <p className="os-label">converted this month</p>
        <p className="os-display text-4xl tabular-nums">{count}</p>
      </div>
      <p className="absolute left-5 bottom-3 text-[12px] text-white/30">tap a referrer to send a referral</p>
    </div>
  );
}
