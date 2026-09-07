"use client";

import { useEffect, useRef, useState } from "react";
import { animate, onScroll, svg, utils, stagger } from "@/lib/anime";
import SectionLabel from "./SectionLabel";

type Realm = {
  cn: string;
  en: string;
  hanzi: string;
  desc: string;
  icon: string; // svg path d(s), pipe-separated
};

const REALMS: Realm[] = [
  {
    cn: "炼气",
    en: "Qi Refining",
    hanzi: "一",
    desc: "Draw the world's breath into the dantian until the body hums like a struck bell. Sixty years, minimum.",
    icon: "M32 32c0-3 2-5 5-5s5 2 5 5-2 6-6 6-7-3-7-7 3-8 8-8 9 4 9 9-4 10-10 10-11-5-11-11 5-12 12-12",
  },
  {
    cn: "筑基",
    en: "Foundation Establishment",
    hanzi: "二",
    desc: "Pour a floor of still stone under your spirit. Nothing grand is ever built on weather.",
    icon: "M18 48h28|M24 38h16|M28 28h8|M32 28v20",
  },
  {
    cn: "金丹",
    en: "Golden Core",
    hanzi: "三",
    desc: "Compress nine winters into a single ember beneath the navel. Then keep it lit through every season.",
    icon: "M32 14a18 18 0 1 0 .01 0|M32 29a3.5 3.5 0 1 0 .01 0|M32 10v-4|M50 32h4|M32 54v-4|M14 32h-4",
  },
  {
    cn: "元婴",
    en: "Nascent Soul",
    hanzi: "四",
    desc: "An infant of light sits up behind your eyes, looks around, and asks what took you so long.",
    icon: "M32 12a20 20 0 1 0 .01 0|M32 25a4 4 0 1 0 .01 0|M25 42c0-7 14-7 14 0",
  },
  {
    cn: "化神",
    en: "Spirit Severing",
    hanzi: "五",
    desc: "Cut away the self that clings — to name, to fame, to fear. What remains walks lighter than wind.",
    icon: "M20 20a17 17 0 0 0 0 24|M44 20a17 17 0 0 1 0 24|M26 44L40 20",
  },
  {
    cn: "洞虚",
    en: "Void Illumination",
    hanzi: "六",
    desc: "Distance stops existing. The far mountain becomes a thought, and thoughts are instant.",
    icon: "M10 32C18 20 46 20 54 32 46 44 18 44 10 32Z|M32 27a5 5 0 1 0 .01 0",
  },
  {
    cn: "合体",
    en: "Unity",
    hanzi: "七",
    desc: "Body, breath and mountain finally agree to be the same thing. The paperwork takes a decade.",
    icon: "M10 46L28 18l10 14 6-8 10 22|M26 46h14",
  },
  {
    cn: "大乘",
    en: "Great Vehicle",
    hanzi: "八",
    desc: "Strong enough, at last, to carry others across the sea. The ferryman's realm; the oars are made of patience.",
    icon: "M14 40h36l-7 9H21z|M32 40V15|M32 18c11 2 15 9 15 16H32",
  },
  {
    cn: "飞升",
    en: "Immortal Ascension",
    hanzi: "九",
    desc: "Walk into the sky and do not look back. Legends never do — they simply leave the door open.",
    icon: "M12 40c6-9 12-9 18-2 6-7 12-7 18 2|M32 32V8|M32 8l-7 8|M32 8l7 8|M18 52c4-4 10-4 14 0 4-4 10-4 14 0",
  },
];

/**
 * Realms — the Nine Gates. Sticky hanzi rail, scroll-scrubbed ink
 * progress line, stroke-drawn icons per gate.
 */
export default function Realms() {
  const root = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const bigHanzi = useRef<HTMLSpanElement>(null);

  /* scrubbed progress line */
  useEffect(() => {
    if (!listRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      utils.set("#realm-progress", { scaleY: 1 });
      return;
    }
    const anim = animate("#realm-progress", {
      scaleY: [0, 1],
      ease: "linear",
      autoplay: onScroll({
        target: listRef.current,
        enter: "top bottom-=35%",
        leave: "bottom center",
        sync: true,
      }),
    });
    return () => anim.revert();
  }, []);

  /* entrance: rows slide up + icons draw when visible (once) */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = el.querySelectorAll(".realm-row");
    const ios: IntersectionObserver[] = [];

    rows.forEach((row, i) => {
      const iconPaths = row.querySelectorAll(".realm-icon path");
      const drawables = reduced ? null : svg.createDrawable(iconPaths);
      if (!reduced) utils.set(iconPaths, { opacity: 0.2 });
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          if (reduced) {
            utils.set(iconPaths, { opacity: 1 });
            return;
          }
          animate(row.querySelectorAll(".realm-reveal"), {
            opacity: [0, 1],
            y: [30, 0],
            duration: 850,
            delay: stagger(90),
            ease: "outExpo",
          });
          if (drawables)
            animate(drawables, {
              draw: "0 1",
              duration: 1100,
              delay: stagger(140),
              ease: "inOutQuad",
              onComplete: () =>
                utils.set(iconPaths, { opacity: 1 }),
            });
        },
        { threshold: 0.35 }
      );
      io.observe(row);
      ios.push(io);
    });
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  /* big hanzi swap on active change */
  useEffect(() => {
    if (!bigHanzi.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(bigHanzi.current, {
      opacity: [0, 1],
      scale: [0.86, 1],
      rotate: [-4, 0],
      duration: 520,
      ease: "outExpo",
    });
  }, [active]);

  useEffect(() => {
    const rows = root.current?.querySelectorAll(".realm-row");
    if (!rows) return;
    const ios: IntersectionObserver[] = [];
    rows.forEach((row, i) => {
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(i);
        },
        { rootMargin: "-42% 0px -42% 0px" }
      );
      io.observe(row);
      ios.push(io);
    });
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  return (
    <section
      ref={root}
      id="realms"
      className="relative py-[15vh]"
      aria-label="The Nine Gates — cultivation realms"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionLabel cn="境界" en="The Nine Gates" />
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint">
            01 — 09 · one life per gate
          </p>
        </div>
        <h2 className="mt-8 max-w-3xl font-display text-[clamp(2.4rem,5.6vw,4.6rem)] font-black leading-[0.98] tracking-[-0.02em]">
          Nine gates.
          <br />
          One <span className="italic text-seal">lifetime</span> each —
          <br />
          if you&apos;re lucky.
        </h2>

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.6fr] lg:gap-16">
          {/* sticky rail */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative flex h-[300px] w-[300px] items-center justify-center">
                <span
                  ref={bigHanzi}
                  className="select-none font-brush leading-none text-jade/90"
                  style={{ fontSize: 230 }}
                  aria-hidden="true"
                >
                  {REALMS[active].hanzi}
                </span>
                <span className="absolute inset-0 rounded-full border border-dashed border-ink/20" aria-hidden="true" />
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.26em] text-ink-soft">
                Gate {String(active + 1).padStart(2, "0")} · {REALMS[active].cn} —{" "}
                <span className="text-seal">{REALMS[active].en}</span>
              </p>
            </div>
          </div>

          {/* rows */}
          <div ref={listRef} className="relative">
            {/* track + progress */}
            <span
              className="absolute bottom-2 left-[7px] top-2 w-px bg-ink/15"
              aria-hidden="true"
            />
            <span
              id="realm-progress"
              className="absolute bottom-2 left-[6.5px] top-2 w-[2px] origin-top bg-seal"
              style={{ transform: "scaleY(0)" }}
              aria-hidden="true"
            />

            {REALMS.map((r, i) => (
              <article
                key={r.en}
                className={`realm-row relative border-b border-dashed border-ink/20 py-9 pl-12 pr-2 sm:pl-16 ${
                  i === active ? "is-active" : ""
                }`}
              >
                <span
                  className="realm-marker absolute left-0 top-[3.2rem] block h-[15px] w-[15px] border-2 border-ink/35 bg-paper"
                  aria-hidden="true"
                />
                <div className="realm-reveal flex items-baseline gap-3">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-ink-faint">
                    Gate {String(i + 1).padStart(2, "0")} · 第{r.hanzi}重
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-6">
                  <div className="realm-reveal">
                    <h3 className="flex flex-wrap items-baseline gap-x-3 font-display text-[1.7rem] font-bold leading-tight sm:text-[2rem]">
                      {r.en}
                      <span className="font-brush text-2xl text-jade">{r.cn}</span>
                    </h3>
                    <p className="mt-2.5 max-w-md text-[15px] leading-relaxed text-ink-soft">
                      {r.desc}
                    </p>
                  </div>
                  <svg
                    viewBox="0 0 64 64"
                    className="realm-icon h-16 w-16 shrink-0 overflow-visible sm:h-[72px] sm:w-[72px]"
                    fill="none"
                    stroke="#1d1a15"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {r.icon.split("|").map((d, j) => (
                      <path key={j} d={d} />
                    ))}
                  </svg>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
