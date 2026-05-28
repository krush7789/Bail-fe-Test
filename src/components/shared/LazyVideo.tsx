"use client";

import React, { useRef, useEffect } from "react";

interface LazyVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  fallbackClassName?: string;
}

export default function LazyVideo({
  src,
  poster,
  className = "",
  fallbackClassName = "",
}: LazyVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src || !wrapperRef.current || !videoRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Lazy-load the video src
            if (!video.src) {
              video.src = src;
              video.load();
            }

            if (prefersReducedMotion) {
              // Show poster only — don't autoplay
              video.pause();
            } else {
              video.play().catch(() => {
                // Autoplay may be blocked by browser policy — ignore
              });
            }

            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(wrapperRef.current);

    return () => observer.disconnect();
  }, [src]);

  if (!src) {
    return (
      <div
        ref={wrapperRef}
        className={`bg-gradient-to-br from-ink via-ink-2 to-bail-navy opacity-80 ${fallbackClassName}`}
      />
    );
  }

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}
