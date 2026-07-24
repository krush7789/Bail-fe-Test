'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { hero, stats } from '@/content/catalog'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface OrbitIcon {
  id: number
  src: string
  label: string
  x: string
  y: string
  delay: number
  size: string
}



function FloatingIcon({ iconData, mouseX, mouseY }: {
  iconData: OrbitIcon
  mouseX: React.MutableRefObject<number>
  mouseY: React.MutableRefObject<number>
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 120, damping: 22 })
  const springY = useSpring(y, { stiffness: 120, damping: 22 })

  React.useEffect(() => {
    const handleMouseMove = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dist = Math.sqrt(Math.pow(mouseX.current - cx, 2) + Math.pow(mouseY.current - cy, 2))
      if (dist < 130) {
        const angle = Math.atan2(mouseY.current - cy, mouseX.current - cx)
        const force = (1 - dist / 130) * 35
        x.set(-Math.cos(angle) * force)
        y.set(-Math.sin(angle) * force)
      } else {
        x.set(0)
        y.set(0)
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, y, mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY,
        left: `calc(50% + ${iconData.x})`,
        top: `calc(50% + ${iconData.y})`,
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.4 + iconData.delay,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
    >
      <motion.div
        className={`${iconData.size} flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl p-2.5 hover:border-white/40 hover:bg-white/20 transition-all hover:scale-110`}
        animate={{
          y: [0, -6, 0, 6, 0],
          x: [0, 4, 0, -4, 0],
          rotate: [0, 3, 0, -3, 0],
        }}
        transition={{
          duration: 5 + (iconData.id * 0.6),
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        title={iconData.label}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconData.src}
          alt={iconData.label}
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </motion.div>
    </motion.div>
  )
}

export default function ImmersiveHero() {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const mouseX = React.useRef(0)
  const mouseY = React.useRef(0)

  // Touch/iOS can't scroll-scrub a <video>, so those devices scrub an image sequence on a canvas.
  // Starts false (SSR + desktop default) and flips on the client for touch devices.
  const [isTouch, setIsTouch] = React.useState(false)
  React.useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches)
  }, [])

  const rawProgress = useMotionValue(0)
  const smoothProgress = useSpring(rawProgress, { stiffness: 90, damping: 22, mass: 0.4 })

  // Subheadline & CTA buttons enter FIRST — from 0 to 0.3 scroll progress — and settle before the stats bar begins
  const heroSubOpacity = useTransform(smoothProgress, [0, 0.3], [0, 1], { clamp: true })
  const heroSubY = useTransform(smoothProgress, [0, 0.3], [50, 0], { clamp: true })

  // Headline sits lower on screen initially (220px lower), and animates upward alongside the subheadline/buttons
  const headlineY = useTransform(smoothProgress, [0, 0.3], [220, 0], { clamp: true })

  // Stats band enters AFTER the text/buttons have settled (0.35), stretched all the way to 0.95 so it finishes
  // in step with the video scrub — no 2-3s of empty video tail once everything else is done
  const statsOpacity = useTransform(smoothProgress, [0.35, 0.95], [0, 1], { clamp: true })
  const statsY = useTransform(smoothProgress, [0.35, 0.95], [80, 0], { clamp: true })
  const statsScale = useTransform(smoothProgress, [0.35, 0.95], [0.94, 1], { clamp: true })

  // Scroll-scrub the hero. Desktop scrubs the all-intra <video> via currentTime.
  // Touch/iOS can't repaint a paused <video> on seek, so it scrubs a preloaded image
  // sequence on a <canvas> instead — same frame-changes-with-scroll experience.
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let st: ScrollTrigger | null = null

    // ── Touch: image-sequence scrub on canvas ──
    if (isTouch) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      const FRAME_COUNT = 60
      const images: HTMLImageElement[] = []
      let progress = 0

      const draw = (p: number) => {
        progress = p
        const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))))
        const img = images[idx]
        if (!img || !img.complete || !img.naturalWidth) return
        const cw = canvas.width
        const ch = canvas.height
        const ir = img.naturalWidth / img.naturalHeight
        // object-cover: fill the canvas, crop the overflow
        let dw = cw, dh = cw / ir, dx = 0, dy = (ch - dh) / 2
        if (cw / ch <= ir) {
          dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0
        }
        ctx.clearRect(0, 0, cw, ch)
        ctx.drawImage(img, dx, dy, dw, dh)
      }

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = canvas.clientWidth * dpr
        canvas.height = canvas.clientHeight * dpr
        draw(progress)
      }

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image()
        img.src = `/hero-frames/frame-${String(i + 1).padStart(3, '0')}.jpg`
        if (i === 0) img.onload = () => draw(progress)
        images.push(img)
      }

      resize()
      window.addEventListener('resize', resize)

      st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          rawProgress.set(self.progress)
          draw(self.progress)
        },
      })

      return () => {
        window.removeEventListener('resize', resize)
        if (st) st.kill()
      }
    }

    // ── Desktop: scrub the <video> frame-by-frame (video stays paused) ──
    const video = videoRef.current
    if (!video) return

    let targetTime = 0
    let rafId = 0

    const renderLoop = () => {
      if (video && !isNaN(video.duration) && video.duration > 0) {
        const delta = targetTime - video.currentTime
        if (Math.abs(delta) > 0.0005) {
          video.currentTime += delta * 0.18
        }
      }
      rafId = requestAnimationFrame(renderLoop)
    }
    rafId = requestAnimationFrame(renderLoop)

    const initScrollTrigger = () => {
      if (st) st.kill()
      const duration = video.duration || 5
      st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          rawProgress.set(self.progress)
          if (!isNaN(duration) && duration > 0) {
            targetTime = self.progress * duration
          }
        },
      })
    }

    if (video.readyState >= 1) {
      initScrollTrigger()
    } else {
      video.addEventListener('loadedmetadata', initScrollTrigger)
    }

    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener('loadedmetadata', initScrollTrigger)
      if (st) st.kill()
    }
  }, [isTouch, rawProgress])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.current = e.clientX
    mouseY.current = e.clientY
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[250vh] bg-black"
    >
      {/* Pinned Sticky Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Full-Bleed Scrub Background — poster behind prevents any black flash while loading */}
        <div
          className="absolute inset-0 w-full h-full bg-black bg-cover bg-center"
          style={{ backgroundImage: "url(/hero-poster.jpg)" }}
        >
          {isTouch ? (
            <canvas ref={canvasRef} className="block w-full h-full" />
          ) : (
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              poster="/hero-poster.jpg"
              className="w-full h-full object-cover object-center"
            >
              {/* WebM first for Chrome/Firefox (all-intra, scrubs smoothly); MP4 fallback for Safari/iOS (no WebM support) */}
              <source src="/hero-robot.webm" type="video/webm" />
              <source src="/hero-robot.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />
        </div>


        {/* ─── Hero Content Layout ─── */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 pt-20 pb-8 flex flex-col h-full justify-center gap-20 lg:gap-28 pointer-events-none">

          {/* Top: Centered Headline + Serif Subheading — animates upward as subheadline arrives */}
          <motion.div
            style={{ y: headlineY }}
            className="w-full flex flex-col items-center text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold text-white leading-[0.95] tracking-[-0.03em] drop-shadow-2xl"
            >
              AI-Powered Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hero-serif mt-4 md:mt-5 text-3xl sm:text-4xl md:text-5xl font-normal italic text-[var(--bail-orange)] leading-[1.1] tracking-tight drop-shadow-[0_0_35px_rgba(237,130,28,0.6)]"
            >
              for Growing Businesses
            </motion.p>
          </motion.div>

          {/* Middle Centered: Subtitle Vertical List & Glassmorphic Buttons — commented out per request */}
          {false && (
          <motion.div
            style={{ opacity: heroSubOpacity, y: heroSubY }}
            className="w-full max-w-xl mx-auto text-center flex flex-col items-center gap-6 pointer-events-auto"
          >
            {/* Subheadline - Vertical Stacked Centered List */}
            <div className="flex flex-col items-center gap-2.5 font-medium drop-shadow">
              {['Intelligent automation', 'Sales growth', 'Workflow efficiency'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-base sm:text-lg text-white/90 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[var(--bail-orange)] shadow-[0_0_10px_rgba(237,130,28,0.8)] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Glassmorphic Button Row - Centered */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
              {/* Book a call — Orange Pill with White Circular Arrow Badge */}
              <a
                href={hero.cta.href}
                className="inline-flex items-center justify-between gap-4 pl-7 pr-2 py-2 rounded-full bg-[var(--bail-orange)] text-white font-bold text-sm hover:brightness-110 transition-all duration-200 shadow-xl shadow-[var(--bail-orange)]/40 hover:scale-105 group"
              >
                <span>Book a call</span>
                <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black shrink-0 shadow-md group-hover:translate-x-0.5 transition-transform">
                  <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>

              {/* See what we build — Glassmorphic Secondary Button */}
              <a
                href={hero.ctaSecondary.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white font-semibold text-sm hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-lg"
              >
                See what we build
              </a>
            </div>
          </motion.div>
          )}

          {/* Bottom: Spread Full-Width Transparent Glassmorphic 6-Stat Bar */}
          <motion.div
            style={{
              opacity: statsOpacity,
              y: statsY,
              scale: statsScale,
            }}
            className="w-full pointer-events-auto rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15"
          >
            {stats.map((stat, i) => (
              <div key={i} className="p-4 flex flex-col items-center text-center justify-center">
                <span className="text-2xl lg:text-3xl font-extrabold text-[var(--bail-orange)] drop-shadow-md">
                  {stat.value}
                </span>
                <span className="text-[10px] text-white/75 font-medium leading-tight mt-1.5 max-w-[130px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>

        {/* Scroll indicator prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 right-8 flex flex-col items-end gap-1 z-30 pointer-events-none"
        >
          <span className="text-[10px] text-white/60 tracking-widest uppercase font-mono">Scroll down</span>
          <div className="w-[30px] h-[2px] rounded-full bg-white/40 animate-pulse" />
        </motion.div>
      </div>
    </div>
  )
}
