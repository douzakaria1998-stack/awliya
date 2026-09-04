'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function InteractiveWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    // Mouse state with smooth physics interpolation
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      radius: 220,
      active: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouse.active) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (!mouse.active) {
          mouse.x = e.touches[0].clientX;
          mouse.y = e.touches[0].clientY;
        }
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Initial mouse center position
    mouse.x = width * 0.6;
    mouse.y = height * 0.5;
    mouse.targetX = width * 0.6;
    mouse.targetY = height * 0.5;

    // Floating ambient micro-particles along the beam
    const numSpecks = 28;
    const specks = Array.from({ length: numSpecks }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3 + 0.15,
      vy: (Math.random() - 0.5) * 0.2 - 0.1,
      size: Math.random() * 1.8 + 0.6,
      baseAlpha: Math.random() * 0.5 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.012;

      // Ultra-fast low-latency mouse tracking with smooth snapping
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.35;
        mouse.y += (mouse.targetY - mouse.y) * 0.35;
      } else {
        // Smooth transition to subtle autonomous breathing drift when idle
        const idleTargetX = width * 0.55 + Math.sin(time * 0.6) * (width * 0.15);
        const idleTargetY = height * 0.5 + Math.cos(time * 0.4) * (height * 0.12);
        mouse.x += (idleTargetX - mouse.x) * 0.06;
        mouse.y += (idleTargetY - mouse.y) * 0.06;
      }

      // 1. Draw Deep Space Background
      if (isDarkMode) {
        const bgGrad = ctx.createRadialGradient(
          width * 0.3,
          height * 0.6,
          width * 0.1,
          width * 0.5,
          height * 0.5,
          Math.max(width, height) * 0.9
        );
        bgGrad.addColorStop(0, '#0a0d1d');
        bgGrad.addColorStop(0.5, '#050711');
        bgGrad.addColorStop(1, '#020308');
        ctx.fillStyle = bgGrad;
      } else {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#f8fafc');
        bgGrad.addColorStop(0.6, '#f1f5f9');
        bgGrad.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = bgGrad;
      }
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Crisp Geometric Dot Grid Matrix (High density, minimized dot size, smooth dynamic wave animation)
      const dotSpacing = 15; // Increased density / dot count
      const gridCols = Math.ceil(width / dotSpacing) + 1;
      const gridRows = Math.ceil(height / dotSpacing) + 1;

      for (let c = 0; c < gridCols; c++) {
        const dotX = c * dotSpacing;

        for (let r = 0; r < gridRows; r++) {
          const dotY = r * dotSpacing;

          // Multi-frequency diagonal ambient wave animation across dots
          const wave1 = Math.sin(dotX * 0.004 + dotY * 0.003 - time * 1.4);
          const wave2 = Math.cos(dotX * 0.002 - dotY * 0.004 + time * 0.9);
          const waveValue = (wave1 + wave2 * 0.6) / 1.6; // normalized roughly -1 to 1

          // Distance from the mouse
          const dx = dotX - mouse.x;
          const dy = dotY - mouse.y;
          const distToMouse = Math.hypot(dx, dy);

          // Calculate illumination intensity from mouse and wave pulses
          let intensity = 0;

          // Subtle ambient traveling wave pulse
          if (waveValue > 0.35) {
            intensity = Math.max(intensity, ((waveValue - 0.35) / 0.65) * 0.4);
          }

          // Mouse spotlight illumination
          if (distToMouse < mouse.radius) {
            const mouseIntensity = Math.pow(1 - distToMouse / mouse.radius, 1.5);
            intensity = Math.max(intensity, mouseIntensity * 0.95);
          }

          // Minimized dot sizing
          let dotRadius = 0.6;
          let fillStyle = '';

          if (isDarkMode) {
            if (intensity > 0.05) {
              // Lit dots: Vibrant gradient color from cyan to violet/purple
              dotRadius = 0.65 + intensity * 0.75; // small max size (~1.4px)
              const colorRatio = Math.sin(dotX * 0.003 + dotY * 0.002 + time) * 0.5 + 0.5;

              if (colorRatio > 0.6) {
                // Electric Cyan / Sky
                fillStyle = `rgba(56, 189, 248, ${0.25 + intensity * 0.75})`;
              } else if (colorRatio > 0.3) {
                // Bright Indigo / Blue
                fillStyle = `rgba(129, 140, 248, ${0.25 + intensity * 0.75})`;
              } else {
                // Neon Purple / Violet
                fillStyle = `rgba(192, 132, 252, ${0.25 + intensity * 0.75})`;
              }
            } else {
              // Quiescent background dots (subtle slate blue, very clean and small)
              dotRadius = 0.55;
              fillStyle = 'rgba(100, 116, 139, 0.18)'; // Slate 500 / low opacity
            }
          } else {
            if (intensity > 0.05) {
              dotRadius = 0.65 + intensity * 0.65;
              fillStyle = `rgba(99, 102, 241, ${0.25 + intensity * 0.65})`;
            } else {
              dotRadius = 0.55;
              fillStyle = 'rgba(148, 163, 184, 0.28)'; // Slate 400
            }
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle;
          ctx.fill();

          // Subtle glow on intensely lit dots near mouse
          if (isDarkMode && intensity > 0.75) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#38bdf8';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 3. Draw Floating Ambient Energy Micro-specks
      specks.forEach((speck) => {
        speck.x += speck.vx;
        speck.y += speck.vy;

        // Wrap around bounds
        if (speck.x < 0) speck.x = width;
        if (speck.x > width) speck.x = 0;
        if (speck.y < 0) speck.y = height;
        if (speck.y > height) speck.y = 0;

        const pulse = Math.sin(time * 3 + speck.pulseOffset) * 0.3;
        const currentAlpha = Math.max(0.1, speck.baseAlpha + pulse);

        ctx.beginPath();
        ctx.arc(speck.x, speck.y, speck.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode
          ? `rgba(165, 180, 252, ${currentAlpha * 0.7})`
          : `rgba(99, 102, 241, ${currentAlpha * 0.4})`;
        ctx.fill();
      });

      // 4. Ambient Mouse Cursor Halo Light
      if (isDarkMode && mouse.active) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.1
        );
        mouseGlow.addColorStop(0, 'rgba(124, 58, 237, 0.08)');
        mouseGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
        mouseGlow.addColorStop(1, 'transparent');

        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 1 }}
    />
  );
}

