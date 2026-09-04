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
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);

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

      // Smooth mouse lerp
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
      } else {
        // Subtle autonomous breathing drift when idle
        mouse.x = width * 0.55 + Math.sin(time * 0.6) * (width * 0.15);
        mouse.y = height * 0.5 + Math.cos(time * 0.4) * (height * 0.12);
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

      // 2. Draw Multi-layered Glowing Diagonal Aurora Light Beams (Stitch AI signature wave)
      // The wave travels diagonally from bottom-left to mid/top-right
      ctx.save();
      ctx.globalCompositeOperation = isDarkMode ? 'screen' : 'multiply';

      const drawAuroraWave = (
        baseYOffset: number,
        amplitude: number,
        frequency: number,
        speed: number,
        thickness: number,
        colorStart: string,
        colorMid: string,
        colorEnd: string,
        opacity: number
      ) => {
        const points: { x: number; y: number }[] = [];
        const step = 20;

        for (let x = -50; x <= width + 50; x += step) {
          // Diagonal slope + sinusoidal motion + mouse interaction
          const progress = x / width;
          const diagonalY = height * 0.72 - progress * (height * 0.42) + baseYOffset;

          // Multi-frequency wave
          const wave1 = Math.sin(x * frequency + time * speed) * amplitude;
          const wave2 = Math.cos(x * (frequency * 0.6) - time * (speed * 0.8)) * (amplitude * 0.5);

          // Mouse gravity pull on the beam
          const dx = x - mouse.x;
          const dy = diagonalY - mouse.y;
          const distToMouse = Math.hypot(dx, dy);
          let mousePull = 0;
          if (distToMouse < 320) {
            const force = (1 - distToMouse / 320);
            mousePull = Math.sin(force * Math.PI) * 45;
          }

          const y = diagonalY + wave1 + wave2 + mousePull;
          points.push({ x, y });
        }

        if (points.length < 2) return;

        // Draw broad soft atmospheric glow
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - thickness * 1.8);
        for (let i = 1; i < points.length; i++) {
          const xc = (points[i - 1].x + points[i].x) / 2;
          const yc = (points[i - 1].y + points[i].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y - thickness * 1.8, xc, yc - thickness * 1.8);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y + thickness * 1.8);
        for (let i = points.length - 1; i > 0; i--) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y + thickness * 1.8, xc, yc + thickness * 1.8);
        }
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, height * 0.8, width, height * 0.2);
        grad.addColorStop(0, colorStart);
        grad.addColorStop(0.45, colorMid);
        grad.addColorStop(1, colorEnd);

        ctx.fillStyle = grad;
        ctx.globalAlpha = opacity;
        ctx.filter = 'blur(42px)';
        ctx.fill();

        // Draw sharp focused core ribbon
        ctx.filter = 'blur(16px)';
        ctx.globalAlpha = opacity * 1.4;
        ctx.fill();

        ctx.filter = 'none';
      };

      if (isDarkMode) {
        // Deep purple/magenta base atmospheric glow
        drawAuroraWave(
          40,
          55,
          0.0022,
          1.1,
          95,
          'rgba(147, 51, 234, 0.45)', // Purple 600
          'rgba(168, 85, 247, 0.55)', // Purple 500
          'rgba(99, 102, 241, 0.35)', // Indigo 500
          0.65
        );

        // Electric blue & violet core beam (from the picture)
        drawAuroraWave(
          0,
          42,
          0.0028,
          1.4,
          65,
          'rgba(124, 58, 237, 0.7)',  // Violet 600
          'rgba(99, 102, 241, 0.85)', // Indigo 500
          'rgba(59, 130, 246, 0.75)', // Blue 500
          0.75
        );

        // Vibrant cyan/sky shimmer highlights
        drawAuroraWave(
          -25,
          32,
          0.0035,
          1.7,
          40,
          'rgba(99, 102, 241, 0.6)',  // Indigo
          'rgba(56, 189, 248, 0.85)', // Cyan / Sky 400
          'rgba(147, 51, 234, 0.65)', // Purple
          0.7
        );
      } else {
        // Light mode gentle pastel aurora
        drawAuroraWave(
          0,
          35,
          0.0025,
          1.2,
          60,
          'rgba(147, 51, 234, 0.18)',
          'rgba(99, 102, 241, 0.22)',
          'rgba(59, 130, 246, 0.16)',
          0.4
        );
      }

      ctx.restore();

      // 3. Draw Crisp Geometric Dot Grid Matrix (Matching Image 1)
      const dotSpacing = 26; // Exact clean grid spacing
      const gridCols = Math.ceil(width / dotSpacing) + 1;
      const gridRows = Math.ceil(height / dotSpacing) + 1;

      // Calculate the approximate centerline of the aurora beam across the canvas
      const getBeamCenterY = (x: number) => {
        const progress = x / width;
        const diagonalY = height * 0.72 - progress * (height * 0.42);
        const wave = Math.sin(x * 0.0028 + time * 1.4) * 42;
        return diagonalY + wave;
      };

      for (let c = 0; c < gridCols; c++) {
        const dotX = c * dotSpacing;
        const beamY = getBeamCenterY(dotX);

        for (let r = 0; r < gridRows; r++) {
          const dotY = r * dotSpacing;

          // Distance from the aurora beam
          const distToBeam = Math.abs(dotY - beamY);

          // Distance from the mouse
          const dx = dotX - mouse.x;
          const dy = dotY - mouse.y;
          const distToMouse = Math.hypot(dx, dy);

          // Calculate illumination intensity
          let intensity = 0;

          // Beam illumination (dots lit up by the glowing aurora wave)
          if (distToBeam < 140) {
            intensity = Math.max(intensity, (1 - distToBeam / 140) * 0.85);
          }

          // Mouse spotlight illumination
          if (distToMouse < mouse.radius) {
            const mouseIntensity = (1 - distToMouse / mouse.radius);
            intensity = Math.max(intensity, mouseIntensity * 0.95);
          }

          // Determine dot color & size
          let dotRadius = 1.1;
          let fillStyle = '';

          if (isDarkMode) {
            if (intensity > 0.05) {
              // Lit dots: Vibrant gradient color from cyan to violet/purple
              dotRadius = 1.2 + intensity * 1.6;
              const colorRatio = Math.sin(dotX * 0.003 + time) * 0.5 + 0.5;

              if (colorRatio > 0.6) {
                // Electric Cyan / Sky
                fillStyle = `rgba(56, 189, 248, ${0.35 + intensity * 0.65})`;
              } else if (colorRatio > 0.3) {
                // Bright Indigo / Blue
                fillStyle = `rgba(129, 140, 248, ${0.35 + intensity * 0.65})`;
              } else {
                // Neon Purple / Violet
                fillStyle = `rgba(192, 132, 252, ${0.35 + intensity * 0.65})`;
              }
            } else {
              // Quiescent background dots (subtle deep slate blue)
              dotRadius = 0.9;
              fillStyle = 'rgba(71, 85, 105, 0.22)'; // Slate 600 / low opacity
            }
          } else {
            if (intensity > 0.05) {
              dotRadius = 1.2 + intensity * 1.3;
              fillStyle = `rgba(99, 102, 241, ${0.3 + intensity * 0.5})`;
            } else {
              dotRadius = 0.9;
              fillStyle = 'rgba(148, 163, 184, 0.35)'; // Slate 400
            }
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = fillStyle;
          ctx.fill();

          // Add extra intense glow on highly lit dots near the beam core
          if (isDarkMode && intensity > 0.65) {
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#38bdf8';
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // 4. Draw Floating Ambient Energy Micro-specks
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
        ctx.arc(speck.x, speck.y, speck.size, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode
          ? `rgba(165, 180, 252, ${currentAlpha})`
          : `rgba(99, 102, 241, ${currentAlpha * 0.6})`;
        ctx.fill();
      });

      // 5. Ambient Mouse Cursor Halo Light
      if (isDarkMode && mouse.active) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.2
        );
        mouseGlow.addColorStop(0, 'rgba(124, 58, 237, 0.12)');
        mouseGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
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

