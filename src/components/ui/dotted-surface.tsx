'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  mode?: 'fixed' | 'absolute';
};

export function DottedSurface({ className, mode = 'fixed', ...props }: DottedSurfaceProps) {
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reduced particle grid for better performance (28×35 = 980 vs original 2400)
    const SEPARATION = 130;
    const AMOUNTX = 28;
    const AMOUNTY = 35;

    const containerEl = containerRef.current;
    const getW = () => containerEl.clientWidth || window.innerWidth;
    const getH = () => containerEl.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    // Lower camera elevation so dots fill the full vertical area of the section
    const camera = new THREE.PerspectiveCamera(60, getW() / getH(), 1, 10000);
    camera.position.set(0, 150, 950);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(getW(), getH());
    renderer.setClearColor(0x000000, 0);

    containerEl.appendChild(renderer.domElement);

    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    const isDark = theme === 'dark';

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions.push(
          ix * SEPARATION - (AMOUNTX * SEPARATION) / 2,
          0,
          iy * SEPARATION - (AMOUNTY * SEPARATION) / 2,
        );
        if (isDark) {
          colors.push(0.72, 0.72, 0.72);
        } else {
          // Brand navy — more saturated for better visibility
          colors.push(0.18, 0.20, 0.60);
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 13,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;
    let isVisible = true;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

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
      count += 0.07; // slightly slower wave — easier on CPU
    };

    animate();

    // Pause rendering when section is scrolled out of view
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(containerEl);

    const ro = new ResizeObserver(() => {
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(containerEl);

    return () => {
      io.disconnect();
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
