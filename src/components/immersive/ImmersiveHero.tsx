'use client'

import * as React from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
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

// 8 AI Platform Logos positioned in OPEN VISUAL SPACES (zero overlap with headline text or robot head)
const ORBIT_ICONS: OrbitIcon[] = [
  { id: 1, src: '/logos/chatgpt.png',        label: 'ChatGPT',        x: '-47%', y: '-12%', delay: 0,    size: 'w-12 h-12 md:w-15 md:h-15' },
  { id: 2, src: '/logos/gemini.png',         label: 'Gemini',         x: '46%',  y: '-42%', delay: 0.1,  size: 'w-12 h-12 md:w-14 md:h-14' },
  { id: 3, src: '/logos/claude.png',         label: 'Claude',         x: '47%',  y: '-8%',  delay: 0.2,  size: 'w-12 h-12 md:w-15 md:h-15' },
  { id: 4, src: '/logos/ollama.png',         label: 'Ollama',         x: '-46%', y: '-42%', delay: 0.25, size: 'w-11 h-11 md:w-14 md:h-14' },
  { id: 5, src: '/logos/deepseek.png',       label: 'DeepSeek',       x: '0%',   y: '-38%', delay: 0.3,  size: 'w-10 h-10 md:w-13 md:h-13' },
  { id: 6, src: '/logos/meta.png',           label: 'Meta',           x: '38%',  y: '22%',  delay: 0.35, size: 'w-11 h-11 md:w-14 md:h-14' },
  { id: 7, src: '/logos/cursor.png',         label: 'Cursor',         x: '-38%', y: '22%',  delay: 0.4,  size: 'w-11 h-11 md:w-14 md:h-14' },
  { id: 8, src: '/logos/github-copilot.png', label: 'GitHub Copilot', x: '0%',   y: '34%',  delay: 0.45, size: 'w-11 h-11 md:w-14 md:h-14' },
]

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
          duration: 5 + Math.random() * 4,
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
  const mouseX = React.useRef(0)
  const mouseY = React.useRef(0)

  // GSAP ScrollTrigger Video Control
  React.useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    let st: ScrollTrigger | null = null

    const initScrollTrigger = () => {
      if (st) st.kill()

      const duration = video.duration || 5

      st = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          if (video && !isNaN(duration) && duration > 0) {
            const targetTime = self.progress * duration
            const delta = targetTime - video.currentTime
            if (Math.abs(delta) > 0.005) {
              const nextTime = video.currentTime + delta * 0.3
              if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
                ; (video as any).fastSeek(nextTime)
              } else {
                video.currentTime = nextTime
              }
            }
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
      video.removeEventListener('loadedmetadata', initScrollTrigger)
      if (st) st.kill()
    }
  }, [])

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
        {/* Full-Bleed Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="/hero-robot.jpg"
            className="w-full h-full object-cover object-center"
          >
            <source src="/hero-robot.webm" type="video/webm" />
            <source src="/hero-robot.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80 pointer-events-none" />
        </div>

        {/* Orbiting AI Logos: Positioned in open visual spaces around text and robot */}
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-10">
          {ORBIT_ICONS.map((iconData) => (
            <FloatingIcon
              key={iconData.id}
              iconData={iconData}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}
        </div>

        {/* ─── Hero Content Layout ─── */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 pt-20 pb-4 flex flex-col h-full justify-between pointer-events-none">
          
          {/* Top: Split Headline — Left and Right of Robot Head */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-8">
            {/* Left side: AI-Powered Services */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-left"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                AI-Powered <br />
                <span>Services</span>
              </h1>
            </motion.div>

            {/* Right side: for Growing Businesses */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-left md:text-right"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight drop-shadow-2xl">
                <span className="hero-serif text-[var(--bail-orange)] font-normal italic drop-shadow-[0_0_35px_rgba(237,130,28,0.6)]">
                  for Growing <br />
                  Businesses
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Middle Left: Subtitle & Glassmorphic Buttons */}
          <div className="w-full max-w-xl text-left flex flex-col gap-4 pointer-events-auto">
            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              className="text-base sm:text-lg text-white/80 leading-relaxed font-medium drop-shadow"
            >
              {hero.subheadline}
            </motion.p>

            {/* Glassmorphic Button Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-3"
            >
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
            </motion.div>
          </div>

          {/* Bottom: Spread Full-Width Transparent Glassmorphic 6-Stat Bar */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: 'easeOut' }}
            className="w-full pointer-events-auto mb-2 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-white/15"
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
