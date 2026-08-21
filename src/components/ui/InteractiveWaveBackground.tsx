'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface DotParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export function InteractiveWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse with smooth lerp
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 170,
    };

    // Calculate number of dots based on viewport size
    const numDots = Math.min(130, Math.max(50, Math.floor((width * height) / 11000)));

    const dots: DotParticle[] = [];

    for (let i = 0; i < numDots; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2.2 + 1.2; // Small delicate dot size
      const alpha = Math.random() * 0.45 + (isDarkMode ? 0.35 : 0.25);

      dots.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size,
        baseSize: size,
        alpha,
        baseAlpha: alpha,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let frame = 0;

    const render = () => {
      frame++;

      // Smooth mouse movement interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Ambient Mouse Spotlight Glow
      const ambientGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        15,
        mouse.x,
        mouse.y,
        mouse.radius * 2
      );

      if (isDarkMode) {
        ambientGlow.addColorStop(0, `${theme.primary}20`);
        ambientGlow.addColorStop(0.5, `${theme.primary}08`);
        ambientGlow.addColorStop(1, 'transparent');
      } else {
        ambientGlow.addColorStop(0, `${theme.primary}15`);
        ambientGlow.addColorStop(0.6, `${theme.primary}05`);
        ambientGlow.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Update and draw particles & connection lines
      const maxConnectDist = 115;
      const maxMouseDist = 175;

      // Update positions
      dots.forEach((dot) => {
        // Natural gentle drift
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Bounce from walls
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;

        // Mouse interaction: push away smoothly or attract
        const dx = dot.x - mouse.x;
        const dy = dot.y - mouse.y;
        const distToMouse = Math.hypot(dx, dy);

        if (distToMouse < maxMouseDist && distToMouse > 0) {
          const force = (1 - distToMouse / maxMouseDist) * 3.5;
          const angle = Math.atan2(dy, dx);
          dot.x += Math.cos(angle) * force;
          dot.y += Math.sin(angle) * force;
          dot.alpha = Math.min(1, dot.baseAlpha + (1 - distToMouse / maxMouseDist) * 0.6);
          dot.size = dot.baseSize + (1 - distToMouse / maxMouseDist) * 1.8;
        } else {
          // Gradual return to base alpha and size
          dot.alpha += (dot.baseAlpha - dot.alpha) * 0.05;
          dot.size += (dot.baseSize - dot.size) * 0.05;
        }
      });

      // Draw connection lines between nearby dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dX = dots[i].x - dots[j].x;
          const dY = dots[i].y - dots[j].y;
          const dist = Math.hypot(dX, dY);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * (isDarkMode ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = isDarkMode
              ? `${theme.primary}${Math.floor(lineAlpha * 255).toString(16).padStart(2, '0')}`
              : `${theme.primary}${Math.floor(lineAlpha * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw dynamic line from dot to mouse if close
        const distToMouse = Math.hypot(dots[i].x - mouse.x, dots[i].y - mouse.y);
        if (distToMouse < maxMouseDist) {
          const mouseLineAlpha = (1 - distToMouse / maxMouseDist) * (isDarkMode ? 0.35 : 0.22);
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `${theme.primary}${Math.floor(mouseLineAlpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      }

      // Draw all dots
      dots.forEach((dot) => {
        const pulse = Math.sin(frame * dot.pulseSpeed + dot.pulseOffset) * 0.4;
        const currentRadius = Math.max(1, dot.size + pulse);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, currentRadius, 0, Math.PI * 2);

        // Dot color
        const alphaHex = Math.min(255, Math.max(0, Math.floor(dot.alpha * 255)))
          .toString(16)
          .padStart(2, '0');

        ctx.fillStyle = `${theme.primary}${alphaHex}`;
        ctx.fill();

        // Extra subtle glow for brighter dots
        if (dot.alpha > 0.6) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = theme.primary;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: 0.95 }}
    />
  );
}
