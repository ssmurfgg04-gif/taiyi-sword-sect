"use client";

import { useEffect, useRef } from "react";

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  wobble: number;
  wobbleSpeed: number;
  alpha: number;
  color: string;
};

/**
 * Canvas incense motes / ember particles — DPR-aware, pauses offscreen,
 * static fallback for prefers-reduced-motion.
 */
export default function IncenseMotes({
  count = 34,
  colors = ["#1d1a15", "#b5382a", "#c0922f"],
  night = false,
  className = "",
}: {
  count?: number;
  colors?: string[];
  night?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let running = false;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let motes: Mote[] = [];

    const spawn = (initial = false): Mote => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: 0.8 + Math.random() * 1.8,
      vy: 0.12 + Math.random() * 0.38,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.004 + Math.random() * 0.012,
      alpha: 0.12 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: count }, () => spawn(true));
    };

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (!reduced) {
          m.y -= m.vy;
          m.wobble += m.wobbleSpeed * 16;
          m.x += Math.sin(m.wobble + t * 0.0002) * 0.16;
          if (m.y < -12) Object.assign(m, spawn());
        }
        ctx.globalAlpha = reduced ? m.alpha * 0.7 : m.alpha * (0.55 + 0.45 * Math.sin(m.wobble * 2));
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      paint(t);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduced) paint(0);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [count, colors, night]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
