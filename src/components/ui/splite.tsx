'use client'

import { Suspense, lazy, useRef, useEffect, useCallback } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const appRef = useRef<Application | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Called once after Spline finishes loading the scene
  const handleLoad = useCallback((app: Application) => {
    appRef.current = app
  }, [])

  // Pause the WebGL render loop when the hero is scrolled out of view
  // and resume when it's visible again — frees the main thread for the
  // rest of the page while the robot isn't on screen.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        const app = appRef.current
        if (!app) return
        if (entry.isIntersecting) {
          app.play()
        } else {
          app.stop()
        }
      },
      { threshold: 0 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
          </div>
        }
      >
        <Spline
          scene={scene}
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>
    </div>
  )
}
