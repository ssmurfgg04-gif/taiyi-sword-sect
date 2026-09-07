"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, utils, svg } from "@/lib/anime";
import SectionLabel from "./SectionLabel";

type Tech = {
  scroll: string;
  cn: string;
  en: string;
  desc: string;
  req: string;
  diff: number;
  ill: string; // illustration paths, pipe-separated
  accent?: string;
};

const TECHS: Tech[] = [
  {
    scroll: "卷一 · Scroll I",
    cn: "御风步",
    en: "Cloud-Step Discipline",
    desc: "Seven breaths of wind, folded into the soles of the feet. Masters cross a lake the way rumors cross a village.",
    req: "Requires 筑基 Foundation · 12 years",
    diff: 2,
    ill: "M8 92c22-14 44-14 66 0|M14 76c18-11 36-11 54 0|M22 60c13-8 26-8 39 0|M32 44c7-5 13-5 20 0",
  },
  {
    scroll: "卷二 · Scroll II",
    cn: "流水剑",
    en: "Flowing-Water Sword",
    desc: "The river does not cut the stone in anger — it simply refuses to stop. Your blade learns the same patience.",
    req: "Requires 筑基 Foundation · 30 years",
    diff: 3,
    ill: "M6 60c14-26 32-30 44-14 8 11 22 12 32 2|M10 78c16-10 34-10 50 0 8 5 16 5 22 0|M18 34c10-8 24-8 34 0",
  },
  {
    scroll: "卷三 · Scroll III",
    cn: "九阳功",
    en: "Nine-Sun Meridian",
    desc: "Burn your own winter. Nine small suns climb the spine; the ninth never sets, even in the tomb.",
    req: "Requires 金丹 Golden Core · 40 years",
    diff: 4,
    ill: "M56 40a20 20 0 1 0 .01 0|M56 32v-8|M72 40h8|M56 56v8|M40 40h-8|M66 30l6-6|M66 50l6 6|M46 30l-6-6|M46 50l-6 6",
    accent: "text-seal",
  },
  {
    scroll: "卷四 · Scroll IV",
    cn: "断岳式",
    en: "Mountain-Cleaving Form",
    desc: "One cut, drawn once per century, and never twice at the same mountain. Ask the valley what remains.",
    req: "Requires 元婴 Nascent Soul · one lifetime",
    diff: 5,
    ill: "M4 88L46 16l16 28 10-16 24 60|M36 88h52|M50 60h20",
    accent: "text-seal",
  },
];

function Seals({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-1.5" aria-label={`Difficulty ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-[7px] w-[7px] rotate-45 ${i < level ? "bg-seal" : "border border-ink/30 bg-transparent"}`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Techniques — four paper scrolls as illoca-style hard-shadow cards. */
export default function Techniques() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = el.querySelectorAll(".tech-card");
    const ios: IntersectionObserver[] = [];
    cards.forEach((card) => {
      if (reduced) return;
      utils.set(card, { opacity: 0, y: 48 });
      const drawables = svg.createDrawable(card.querySelectorAll(".tech-ill path"));
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          animate(card, { opacity: [0, 1], y: [48, 0], duration: 950, ease: "outExpo" });
          animate(drawables, {
            draw: "0 1",
            duration: 1400,
            delay: stagger(120),
            ease: "inOutQuad",
          });
        },
        { threshold: 0.25 }
      );
      io.observe(card);
      ios.push(io);
    });
    return () => ios.forEach((io) => io.disconnect());
  }, []);

  return (
    <section
      ref={root}
      id="techniques"
      className="paper-grid border-y border-ink/10 bg-paper-mid py-[15vh]"
      aria-label="The Four Scrolls — techniques"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionLabel cn="道法" en="The Four Scrolls" />
          <p className="font-hand text-xl text-ink-soft sm:text-2xl">
            choose carefully <span className="font-serifcn text-base text-seal">小心选择</span>
          </p>
        </div>
        <h2 className="mt-8 max-w-3xl font-display text-[clamp(2.4rem,5.6vw,4.6rem)] font-black leading-[0.98] tracking-[-0.02em]">
          Techniques are <span className="italic text-seal">arguments</span> the
          body makes with the world.
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {TECHS.map((t) => (
            <article
              key={t.en}
              data-cursor
              className="tech-card relative border border-ink/15 bg-paper-bright p-7 shadow-hard sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-ink-faint">
                  {t.scroll}
                </p>
                <Seals level={t.diff} />
              </div>

              <svg
                viewBox="0 0 100 100"
                className="tech-ill mt-7 h-28 w-28 overflow-visible"
                fill="none"
                stroke="#2f5d46"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {t.ill.split("|").map((d, j) => (
                  <path key={j} d={d} />
                ))}
              </svg>

              <h3 className="mt-7 flex flex-wrap items-baseline gap-x-3 font-display text-[1.65rem] font-bold leading-tight sm:text-[1.9rem]">
                <span className="dot-underline-seal">{t.en}</span>
                <span className="font-brush text-[1.6rem] text-jade">{t.cn}</span>
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
                {t.desc}
              </p>
              <p className="mt-6 border-t border-dashed border-ink/20 pt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-faint">
                {t.req}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
