'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import Button from '@/components/shared/Button'
import { GlowButton } from '@/components/ui/button-1'
import { hero } from '@/content/catalog'

const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

// Drop-shadow values reused on every text element
const TEXT_SHADOW =
  '0 0 8px rgba(0,0,0,1), 0 0 24px rgba(0,0,0,1), 0 0 55px rgba(0,0,0,0.95), 0 0 110px rgba(0,0,0,0.80), 0 0 180px rgba(0,0,0,0.55)'

export default function ImmersiveHero() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative w-full min-h-screen"
      aria-labelledby="immersive-hero-heading"
    >
      <Card
        className="w-full min-h-screen relative overflow-hidden rounded-none border-0"
        style={{ background: 'linear-gradient(135deg, #2e337a 0%, #1e2257 60%, #0d1040 100%)' }}
      >
        <Spotlight size={600} />

        <div className="relative z-10 min-h-screen pt-20">

          {/* ── Spline: spans the full hero so the robot is never clipped ── */}
          {!prefersReduced && (
            <div className="relative w-full min-h-[360px] lg:absolute lg:inset-0 lg:min-h-0">
              <SplineScene
                scene={SPLINE_SCENE}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/*
            Narrow bottom-only vignette so text is legible.
            Stops well before the robot body — only the floor / leg zone.
          */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
            style={{
              height: '28%',
              background:
                'linear-gradient(to top, rgba(10,12,40,0.72) 0%, rgba(10,12,40,0.2) 55%, transparent 100%)',
            }}
          />

          {/*
            ── Text block ──
            • Mobile : in normal flow, below the 360 px Spline container
            • Desktop: pinned bottom-left, inside the vignette zone
                       max-w-xl (≈576 px) keeps the headline on two lines
                       No card. No box. Text-shadow on each element for contrast.
          */}
          <div
            className="
              relative z-10
              px-8 lg:px-0 py-12
              lg:absolute lg:bottom-48 lg:left-1/2 lg:-translate-x-1/2 lg:py-0
              max-w-full lg:text-center
            "
          >
            {/* Headline — 2 explicit lines, large & impactful */}
            <motion.h1
              id="immersive-hero-heading"
              className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-5"
              style={{ textShadow: TEXT_SHADOW }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              aria-label={hero.headline.replace('\n', ' ')}
            >
              {hero.headline.split('\n').map((line, i) => (
                <span key={i} className="block whitespace-nowrap">{line}</span>
              ))}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-neutral-300 text-[1.375rem] leading-relaxed whitespace-nowrap mt-4 mb-6"
              style={{ textShadow: TEXT_SHADOW }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.44, ease: 'easeOut' }}
            >
              Agents, voice AI, and automation — built to grow your business.
            </motion.p>

            {/* CTAs — below the headline, on one row */}
            <motion.div
              className="flex flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.58, ease: 'easeOut' }}
            >
              <GlowButton label={hero.cta.label} href={hero.cta.href} size="lg" />
              <Button
                label={hero.ctaSecondary.label}
                href={hero.ctaSecondary.href}
                variant="ghost"
                size="lg"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator — sits below the text with clear gap */}
        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          aria-hidden="true"
        >
          <span className="text-xs text-white/30 tracking-widest uppercase">scroll</span>
          <motion.div
            animate={prefersReduced ? { y: 0 } : { y: [0, 6, 0] }}
            transition={
              prefersReduced ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
            }
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </Card>
    </section>
  )
}
