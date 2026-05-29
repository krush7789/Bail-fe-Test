"use client";

// Glow button — brand-coloured gradient aura behind a dark pill.
// Orange → violet → cyan maps exactly to our Bits AI Lab tokens.
// Keep glow on primary CTAs only; don't use on ghost / secondary buttons.

interface GlowButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  size?: "md" | "lg";
  className?: string;
}

export function GlowButton({
  label,
  href,
  onClick,
  size = "md",
  className = "",
}: GlowButtonProps) {
  const padding = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";

  const inner = (
    <span
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full bg-[var(--bail-orange)] font-semibold text-[var(--ink)] transition-all duration-200 hover:brightness-110 ${padding} ${className}`}
    >
      {label}
      {/* Arrow — slides in on hover */}
      <svg
        viewBox="0 0 10 10"
        height="10"
        width="10"
        fill="none"
        className="stroke-[var(--ink)] stroke-2 mt-px"
        aria-hidden="true"
      >
        <path
          d="M0 5h7"
          className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
        <path
          d="M1 1l4 4-4 4"
          className="transition-transform duration-200 group-hover:translate-x-[3px]"
        />
      </svg>
    </span>
  );

  return (
    <div className="relative inline-flex items-center justify-center group">
      {/* Glow aura — orange → violet → cyan, our brand palette */}
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-50 transition-opacity duration-300 group-hover:opacity-90"
        style={{
          background:
            "linear-gradient(to right, #ed821c, #7c3aed, #00d4ff)",
        }}
        aria-hidden="true"
      />
      {href ? (
        <a href={href} className="relative">
          {inner}
        </a>
      ) : (
        <button type="button" onClick={onClick} className="relative">
          {inner}
        </button>
      )}
    </div>
  );
}

// Alias so the demo import works as-is
export const Component = () => (
  <GlowButton label="Book a discovery call" href="/#contact" size="lg" />
);
