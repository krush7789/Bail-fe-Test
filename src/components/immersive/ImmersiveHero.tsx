'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SplineScene } from '@/components/ui/splite'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import Button from '@/components/shared/Button'
import { GlowButton } from '@/components/ui/button-1'
import { hero } from '@/content/catalog'

const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

export default function ImmersiveHero() {
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative w-full min-h-screen"
      aria-labelledby="immersive-hero-heading"
    >
      <Card className="w-full min-h-screen relative overflow-hidden rounded-none border-0" style={{ background: "linear-gradient(135deg, #2e337a 0%, #1e2257 60%, #0d1040 100%)" }}>
        <Spotlight size={600} />

        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen pt-20">
          {/* ── Left: text content ── */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-16 lg:py-0 order-2 lg:order-1">
            {/* Eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-1.5 border border-[var(--bail-orange)]/30 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--bail-orange)] bg-[var(--bail-orange)]/10">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[var(--bail-orange)] inline-block"
                  style={prefersReduced ? {} : { animation: 'glow-pulse 2s ease-in-out infinite' }}
                />
                {hero.eyebrow}
              </span>
            </motion.div>

            {/* Headline — gradient text matching demo style */}
            <motion.h1
              id="immersive-hero-heading"
              className="text-4xl md:text-6xl xl:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-[1.08] tracking-tight mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-label={hero.headline.replace('\n', ' ')}
            >
              {hero.headline.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              className="text-neutral-300 max-w-lg text-lg leading-relaxed mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            >
              {hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: 'easeOut' }}
            >
              <GlowButton
                label={hero.cta.label}
                href={hero.cta.href}
                size="lg"
              />
              <Button
                label={hero.ctaSecondary.label}
                href={hero.ctaSecondary.href}
                variant="ghost"
                size="lg"
              />
            </motion.div>
          </div>

          {/* ── Right: Spline 3D scene ── */}
          <div className="flex-1 relative min-h-[360px] lg:min-h-full order-1 lg:order-2">
            {!prefersReduced && (
              <SplineScene
                scene={SPLINE_SCENE}
                className="w-full h-full absolute inset-0"
              />
            )}
            {/* Reduced-motion fallback: subtle gradient orb */}
            {prefersReduced && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-64 h-64 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(237,130,28,0.15) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          aria-hidden="true"
        >
          <span className="text-xs text-white/30 tracking-widest uppercase">scroll</span>
          <motion.div
            animate={prefersReduced ? { y: 0 } : { y: [0, 6, 0] }}
            transition={prefersReduced ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </motion.div>
      </Card>
    </section>
  )
}
