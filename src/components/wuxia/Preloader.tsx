"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  createTimeline,
  createScope,
  svg,
  utils,
  prefersReducedMotion,
} from "@/lib/anime";

/**
 * Ensō preloader — a brush circle draws itself around 问道 while a
 * counter climbs to 100, then the curtain wipes upward in two tones.
 */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const t = setTimeout(() => {
        setGone(true);
        onComplete();
      }, 30);
      return () => clearTimeout(t);
    }
    const scope = createScope({ root: root.current }).add(() => {
      const enso = svg.createDrawable("#enso-path");
      const counter = { v: 0 };

      const tl = createTimeline({
        defaults: { ease: "inOutQuad" },
        onComplete: () => {
          setGone(true);
          onComplete();
        },
      });

      tl.add(enso, { draw: "0 1", duration: 1500, ease: "inOutQuart" }, 0)
        .add(
          counter,
          {
            v: 100,
            duration: 1500,
            ease: "inOutQuart",
            modifier: utils.round(0),
            onUpdate: (self) => setCount(Math.round(counter.v)),
          },
          0
        )
        .add(
          "#preloader-hanzi",
          { opacity: [0, 1], scale: [0.82, 1], duration: 900, ease: "outExpo" },
          150
        )
        .add(
          "#preloader-caption",
          { opacity: [0, 1], duration: 600, ease: "outQuad" },
          500
        )
        .add("#preloader-line", { draw: "0 1", duration: 500 }, 900)
        // exit: content fades, paper panel lifts, seal panel follows
        .add(
          "#preloader-content",
          { opacity: 0, y: -26, duration: 320, ease: "inQuad" },
          "+=140"
        )
        .add("#preloader-paper", { y: "-100%", duration: 640, ease: "inOutQuart" }, "-=40")
        .add("#preloader-red", { y: "-100%", duration: 640, ease: "inOutQuart" }, "-=560");
    });
    return () => scope.revert();
  }, []);

  if (gone) return null;

  return (
    <div ref={root} aria-hidden="true">
      {/* seal-red trailing panel */}
      <div
        id="preloader-red"
        className="fixed inset-0 z-[81] bg-seal"
        style={{ transform: "translateY(0)" }}
      />
      {/* main paper panel */}
      <div
        id="preloader-paper"
        className="fixed inset-0 z-[82] bg-paper paper-grid"
        style={{ transform: "translateY(0)" }}
      >
        <div
          id="preloader-content"
          className="absolute inset-0 flex flex-col items-center justify-center gap-5"
        >
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
              <path
                id="enso-path"
                d="M100 22 C 143 18 178 56 178 100 C 178 146 140 180 98 178 C 55 176 24 142 23 99 C 22 60 48 28 82 23"
                fill="none"
                stroke="#1d1a15"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset="0"
              />
            </svg>
            <div
              id="preloader-hanzi"
              className="absolute inset-0 grid place-items-center font-brush text-5xl text-ink opacity-0"
            >
              问道
            </div>
          </div>
          <div
            id="preloader-caption"
            className="flex flex-col items-center gap-3 opacity-0"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink-soft">
              Entering the sect · 入山门
            </p>
            <p className="font-display text-3xl font-semibold tabular-nums">
              {String(count).padStart(3, "0")}
            </p>
            <svg viewBox="0 0 120 8" className="h-2 w-28 overflow-visible">
              <path
                id="preloader-line"
                d="M2 4 H118"
                fill="none"
                stroke="#b5382a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
