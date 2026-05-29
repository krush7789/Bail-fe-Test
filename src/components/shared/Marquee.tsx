import React from "react";

interface MarqueeProps {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  reverse?: boolean;
  className?: string;
}

const speedMap = {
  slow: "60s",
  normal: "40s",
  fast: "25s",
};

export default function Marquee({
  items,
  speed = "normal",
  reverse = false,
  className = "",
}: MarqueeProps) {
  const duration = speedMap[speed];
  const trackClass = reverse ? "marquee-track-reverse" : "marquee-track";

  // Double the items to create the seamless loop illusion
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden w-full ${className}`} aria-hidden="true">
      <div
        className={trackClass}
        style={{ animationDuration: duration }}
      >
        {doubled.map((item, idx) => (
          <span
            key={idx}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70 mx-2 shrink-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
