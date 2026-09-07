"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, utils, svg } from "@/lib/anime";
import SectionLabel from "./SectionLabel";

type Master = {
  glyph: string;
  name: string;
  cn: string;
  alias: string;
  role: string;
  roleCn: string;
  years: string;
  technique: string;
  temper: string;
};

const MASTERS: Master[] = [
  {
    glyph: "云",
    name: "Yunyin",
    cn: "云隐真人",
    alias: "The Still Mountain",
    role: "Sect Master",
    roleCn: "掌门",
    years: "214 years",
    technique: "一剑断江 One Blade, Two Rivers",
    temper: "Still water",
  },
  {
    glyph: "霜",
    name: "Baishuang",
    cn: "白霜剑首",
    alias: "Nine Cold Moons",
    role: "Sword Envoy",
    roleCn: "剑首",
    years: "156 years",
    technique: "落雪十三式 Thirteen Falling Snows",
    temper: "First frost",
  },
  {
    glyph: "蘅",
    name: "Qingheng",
    cn: "青蘅药师",
    alias: "Green Reed",
    role: "Herb Elder",
    roleCn: "药师",
    years: "98 years",
    technique: "回春诀 Spring-Return Art",
    temper: "Warm rain",
  },
];

/** Masters — the Council of Elders as ink-dark dossier cards. */
export default function Masters() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = el.querySelectorAll(".master-card");
    const ios: IntersectionObserver[] = [];
    cards.forEach((card) => {
      const rings = svg.createDrawable(card.querySelectorAll(".master-ring path"));
      if (reduced) return;
      utils.set(card, { opacity: 0, y: 52 });
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          animate(card, { opacity: [0, 1], y: [52, 0], duration: 950, ease: "outExpo" });
          animate(rings, {
            draw: "0 1",
            duration: 1500,
            delay: stagger(180),
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
      id="masters"
      className="relative py-[15vh]"
      aria-label="The Council of Elders"
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionLabel cn="长老堂" en="The Council of Elders" />
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-faint">
            Three seats · 三席
          </p>
        </div>
        <h2 className="mt-8 max-w-3xl font-display text-[clamp(2.4rem,5.6vw,4.6rem)] font-black leading-[0.98] tracking-[-0.02em]">
          Old souls, <span className="italic text-seal">younger</span> than the
          mountain they live on.
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {MASTERS.map((m) => (
            <article
              key={m.name}
              data-cursor
              className="master-card flex flex-col border border-ink/25 bg-night p-8 text-paper shadow-hard"
            >
              {/* medallion */}
              <div className="relative mx-auto h-[128px] w-[128px]">
                <svg viewBox="0 0 128 128" className="master-ring absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
                  <path d="M64 6a58 58 0 1 0 .01 0" stroke="#c0922f" strokeOpacity="0.55" strokeWidth="1.6" strokeDasharray="3 6" strokeLinecap="round" />
                  <path d="M64 14a50 50 0 1 0 .01 0" stroke="#f1e9d7" strokeOpacity="0.35" strokeWidth="1" />
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <span className="master-glyph font-brush text-[58px] leading-none text-gold">
                    {m.glyph}
                  </span>
                </div>
              </div>

              <div className="mt-7 text-center">
                <h3 className="font-display text-[1.55rem] font-bold leading-tight">
                  {m.name}
                </h3>
                <p className="mt-1 font-serifcn text-[15px] text-gold">{m.cn}</p>
                <p className="mt-1 font-hand text-xl text-paper/60">&ldquo;{m.alias}&rdquo;</p>
              </div>

              <dl className="mt-7 space-y-2.5 border-t border-paper/15 pt-5 font-mono text-[10.5px] uppercase tracking-[0.16em]">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-paper/45">Seat</dt>
                  <dd className="text-right text-paper/90">
                    {m.role} · <span className="font-serifcn normal-case tracking-normal text-gold">{m.roleCn}</span>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-paper/45">Cultivating</dt>
                  <dd className="text-right text-paper/90">{m.years}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-paper/45">Temper</dt>
                  <dd className="text-right text-paper/90">{m.temper}</dd>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <dt className="text-paper/45">Signature</dt>
                  <dd className="font-serifcn text-[13px] normal-case tracking-normal text-paper/90">
                    {m.technique}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
