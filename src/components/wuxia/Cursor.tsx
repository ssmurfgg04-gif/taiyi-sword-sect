"use client";

import { useEffect, useRef } from "react";

/**
 * Ink-dot cursor follower — a cinnabar dot with a trailing ring.
 * Ring expands over links/buttons. Native cursor is kept.
 * Hidden via CSS on coarse pointers; loop skipped for reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const pos = { x: -200, y: -200 };
    const dotPos = { ...pos };
    const ringPos = { ...pos };
    let hovering = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hovering = !!t.closest("[data-cursor], a, button");
    };
    const onLeave = () => {
      pos.x = -100;
      pos.y = -100;
    };

    const loop = () => {
      dotPos.x += (pos.x - dotPos.x) * 0.42;
      dotPos.y += (pos.y - dotPos.y) * 0.42;
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current)
        dot.current.style.transform = `translate(${dotPos.x - 3.5}px, ${dotPos.y - 3.5}px) scale(${hovering ? 1.9 : 1})`;
      if (ring.current) {
        const size = hovering ? 52 : 34;
        ring.current.style.width = `${size}px`;
        ring.current.style.height = `${size}px`;
        ring.current.style.borderColor = hovering
          ? "rgba(181, 56, 42, 0.55)"
          : "rgba(29, 26, 21, 0.35)";
        ring.current.style.transform = `translate(${ringPos.x - size / 2}px, ${ringPos.y - size / 2}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} />
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} />
    </div>
  );
}
