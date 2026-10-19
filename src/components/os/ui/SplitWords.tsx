"use client";

import { motion } from "framer-motion";

// Word-by-word reveal: each word rises out of a clipped line.
// `inView` reveals on scroll; otherwise it plays on mount (after `delay`).
export default function SplitWords({ text, delay = 0, inView = false, className = "" }: {
  text: string; delay?: number; inView?: boolean; className?: string;
}) {
  const words = text.split(" ");
  const anim = { y: "0%", opacity: 1 };
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="os-word inline-block"
            initial={{ y: "110%", opacity: 0 }}
            {...(inView ? { whileInView: anim, viewport: { once: true, margin: "-10%" } } : { animate: anim })}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
