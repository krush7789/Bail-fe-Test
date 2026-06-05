import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
  variant?: "dark" | "light";
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  id,
  variant = "dark",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const isLight = variant === "light";

  return (
    <div className={`${isCenter ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <p className="uppercase tracking-[0.2em] text-xs text-bail-orange font-semibold mb-3">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className={`text-4xl md:text-5xl font-bold leading-tight ${isLight ? "text-black/85" : "text-white"}`}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg mt-4 max-w-2xl ${isCenter ? "mx-auto" : ""} ${isLight ? "text-black/55" : "text-white/60"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
