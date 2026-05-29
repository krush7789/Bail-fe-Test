'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  /** 'fixed' fills the full viewport (original). 'absolute' fills the nearest relative ancestor. */
  mode?: 'fixed' | 'absolute';
};

export function DottedSurface({ className, mode = 'fixed', ...props }: DottedSurfaceProps) {
  const { theme } = useTheme(); // may be undefined when no ThemeProvider is present

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points[];
    animationId: number;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const containerEl = containerRef.current;
    const getW = () => containerEl.clientWidth || window.innerWidth;
    const getH = () => containerEl.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(60, getW() / getH(), 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(getW(), getH());
    renderer.setClearColor(0x000000, 0);

    containerEl.appendChild(renderer.domElement);

    // Particle geometry
    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    // Brand navy (#3d45a8) in 0–1 range for light / undefined theme.
    // Light gray for dark theme so dots stay visible on dark backgrounds.
    const isDark = theme === 'dark';

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        );
        if (isDark) {
          colors.push(0.72, 0.72, 0.72); // soft white
        } else {
          colors.push(0.239, 0.271, 0.659); // --glow-navy #3d45a8
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const posAttr = geometry.attributes.position;
      const pos = posAttr.array as Float32Array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          pos[i * 3 + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };

    animate();

    // Resize — use ResizeObserver for container-aware sizing
    const ro = new ResizeObserver(() => {
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(containerEl);

    sceneRef.current = { scene, camera, renderer, particles: [points], animationId, count };

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animationId);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            (obj.material as THREE.Material).dispose();
          }
        }
      });

      renderer.dispose();

      if (containerEl.contains(renderer.domElement)) {
        containerEl.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none -z-0',
        mode === 'absolute' ? 'absolute inset-0' : 'fixed inset-0 -z-10',
        className,
      )}
      {...props}
    />
  );
}
