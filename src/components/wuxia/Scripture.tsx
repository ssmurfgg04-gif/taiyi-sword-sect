"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, utils } from "@/lib/anime";
import SectionLabel from "./SectionLabel";
import IncenseMotes from "./IncenseMotes";

const QUOTE_CN = "一剑光寒十九洲";
const QUOTE_EN =
  "One blade's cold light crosses nineteen provinces. The wielder never leaves the room.";

/** Scripture — the night scroll: dark ink, embers, blurred character reveal. */
export default function Scripture() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const inner = el.querySelector("#scripture-inner");
    if (!inner) return;
    if (reduced) {
      utils.set("#scripture-inner [data-reveal]", { opacity: 1, y: 0, filter: "blur(0px)" });
      return;
    }
    utils.set("#scripture-inner [data-reveal]", { opacity: 0, y: 34 });
    utils.set(".quote-cn-ch", { opacity: 0, y: 40, filter: "blur(10px)" });
    utils.set("#scripture-rule", { scaleY: 0 });

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const tl = [
          animate("#scripture-rule", {
            scaleY: [0, 1],
            duration: 900,
            ease: "inOutQuart",
          }),
          animate(".quote-cn-ch", {
            opacity: [0, 1],
            y: [40, 0],
            filter: ["blur(10px)", "blur(0px)"],
            duration: 850,
            delay: stagger(85),
            ease: "outExpo",
          }),
          animate("#scripture-en", {
            opacity: [0, 1],
            y: [34, 0],
            duration: 900,
            delay: 500,
            ease: "outExpo",
          }),
          animate("#scripture-attr", {
            opacity: [0, 1],
            y: [34, 0],
            duration: 800,
            delay: 760,
            ease: "outExpo",
          }),
          animate("#scripture-label", {
            opacity: [0, 1],
            y: [24, 0],
            duration: 700,
            ease: "outExpo",
          }),
        ];
        return tl;
      },
      { threshold: 0.4 }
    );
    io.observe(inner);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="scripture"
      className="night-grid relative overflow-hidden bg-night py-[18vh] text-paper"
      aria-label="Scripture — the Scroll of Still Water"
    >
      {/* faint giant watermark */}
      <span
        className="pointer-events-none absolute -left-8 bottom-0 select-none font-brush leading-none text-paper opacity-[0.04]"
        style={{ fontSize: "clamp(220px, 30vw, 480px)" }}
        aria-hidden="true"
      >
        静水
      </span>

      <IncenseMotes
        count={26}
        colors={["#c0922f", "#b5382a", "#f1e9d7"]}
        night
      />

      <div
        id="scripture-inner"
        className="relative mx-auto max-w-4xl px-5 sm:px-10"
      >
        <div id="scripture-label" className="opacity-0">
          <SectionLabel cn="典籍" en="Scroll of Still Water · 卷七" tone="gold" />
        </div>

        <div className="mt-12 flex gap-6 sm:gap-10">
          <span
            id="scripture-rule"
            className="w-[3px] shrink-0 origin-top bg-seal"
            aria-hidden="true"
          />
          <div>
            <blockquote>
              <p className="font-brush leading-[1.15] text-paper" style={{ fontSize: "clamp(2.5rem, 6.6vw, 5.4rem)" }}>
                {QUOTE_CN.split("").map((ch, i) => (
                  <span key={i} className="quote-cn-ch inline-block">
                    {ch}
                  </span>
                ))}
              </p>
              <p
                id="scripture-en"
                className="mt-8 max-w-2xl font-display text-[clamp(1.3rem,2.5vw,2rem)] font-light italic leading-[1.45] text-paper/75"
              >
                {QUOTE_EN}
              </p>
            </blockquote>
            <p
              id="scripture-attr"
              className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.28em] text-paper/50"
            >
              — 云隐 Yunyin, Sect Master · Taiyi Scrolls, Verse III
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
