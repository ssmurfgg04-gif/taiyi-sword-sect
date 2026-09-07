"use client";

import { useEffect, useRef } from "react";
import { animate, utils, stagger } from "@/lib/anime";

const WORD = ["问", "道"];

/** Footer — giant 问道 wordmark, sect vitals, bottom bar. Sticks to bottom. */
export default function SiteFooter() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    utils.set(".foot-reveal", { opacity: 0, y: 30 });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(".foot-reveal", {
          opacity: [0, 1],
          y: [30, 0],
          duration: 800,
          delay: stagger(80),
          ease: "outExpo",
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer
      ref={root}
      className="mt-auto border-t border-ink/15 bg-paper"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
        {/* giant wordmark */}
        <div className="flex items-center justify-center gap-[2vw] py-14 select-none" aria-hidden="true">
          {WORD.map((ch) => (
            <span
              key={ch}
              className="foot-char font-brush leading-[0.85] text-ink/90 cursor-default"
              style={{ fontSize: "clamp(120px, 22vw, 300px)" }}
              tabIndex={-1}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* vitals */}
        <div className="grid gap-10 border-t border-dashed border-ink/20 py-12 sm:grid-cols-3">
          <div className="foot-reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
              Visit the sect · 山门
            </p>
            <p className="mt-3 font-serifcn text-[15px] leading-relaxed">
              天门山，武陵源
              <br />
              Tianmen Ridge, Wulingyuan
            </p>
          </div>
          <div className="foot-reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
              Correspondence · 书信
            </p>
            <a
              href="mailto:crane@taiyi.sect"
              data-cursor
              className="dot-underline mt-3 inline-block font-mono text-[13.5px] text-ink transition-colors hover:text-seal"
            >
              crane@taiyi.sect
            </a>
          </div>
          <div className="foot-reveal">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
              Coordinates · 坐标
            </p>
            <p className="mt-3 font-mono text-[13.5px] leading-relaxed">
              N 31°08′ — E 110°12′
              <br />
              <span className="text-ink-faint">Altitude: becoming irrelevant</span>
            </p>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-ink/15">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-ink-faint sm:px-10">
          <p>© 487–2026 太一剑宗 Taiyi Sword Sect</p>
          <p className="hidden md:block">Ink, paper &amp; anime.js — no swords were drawn</p>
          <p>X 000 · Y 000 · 心 000</p>
        </div>
      </div>
    </footer>
  );
}
