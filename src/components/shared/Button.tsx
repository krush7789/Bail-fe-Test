"use client";

import React from "react";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
}

export default function Button({
  label,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bail-orange cursor-pointer";

  const sizeClasses = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";

  const variantClasses =
    variant === "primary"
      ? "bg-[var(--bail-orange)] text-[var(--ink)] hover:brightness-110"
      : "bg-transparent border border-white text-white hover:bg-white/10";

  const combined = `${base} ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <a href={href} className={combined}>
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combined}>
      <span>{label}</span>
    </button>
  );
}
