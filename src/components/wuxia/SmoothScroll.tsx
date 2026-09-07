"use client";

import { useEffect } from "react";

/**
 * Minimal lenis-style inertial scrolling: lerped window scrolling on
 * wheel input only. Keyboard, scrollbar dragging and touch remain native.
 * Disabled for touch devices and prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let target = window.scrollY;
    let current = target;
    let animating = false;
    let raf = 0;
    const LERP = 0.11;

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const loop = () => {
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        window.scrollTo(0, current);
        animating = false;
        return;
      }
      window.scrollTo(0, current);
      raf = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // allow pinch-zoom
      const mult = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      e.preventDefault();
      if (!animating) {
        // resync in case the user scrolled natively (scrollbar / keyboard)
        target = window.scrollY;
        current = window.scrollY;
      }
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY * mult));
      if (!animating) {
        animating = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onNativeScroll = () => {
      // external scroll (keyboard / scrollbar): resync
      if (!animating) {
        target = window.scrollY;
        current = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
    };
  }, []);

  return null;
}
