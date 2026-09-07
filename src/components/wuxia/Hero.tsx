"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  createTimeline,
  createScope,
  onScroll,
  svg,
  stagger,
  utils,
  createSpring,
  toChars,
  prefersReducedMotion,
} from "@/lib/anime";
import Stamp from "./Stamp";
import IncenseMotes from "./IncenseMotes";

const LINE_1 = "THE BLADE";
const LINE_2 = "IS THE DAO.";

/** Hand-drawn annotation arrow — curved stroke with open head. */
function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 44" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 38 C 20 16, 34 10, 54 13 M54 13 l-10 -2 M54 13 l-7 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CircleMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 54" fill="none" className={className} aria-hidden="true">
      <path
        d="M60 5 C 100 4, 116 14, 115 27 C 114 42, 88 50, 55 49 C 24 48, 5 40, 6 26 C 7 13, 30 6, 66 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Hero({ start }: { start: boolean }) {
  const root = useRef<HTMLElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!start || played.current || !root.current) return;
    played.current = true;
    const reduced = prefersReducedMotion();

    const scope = createScope({ root: root.current }).add(() => {
      /* initial states (hidden under preloader until now) */
      utils.set(".hero-char", { y: "115%", rotate: 7 });
      utils.set(".hero-annotation, .hero-corner", { opacity: 0 });
      utils.set(".hero-sub, .hero-cta", { opacity: 0, y: 26 });
      utils.set("#hero-stamp", { opacity: 0, scale: 2.4, rotate: -24 });
      utils.set("#hero-scrollhint", { opacity: 0 });

      if (reduced) {
        utils.set(".hero-char, .hero-annotation, .hero-corner, .hero-sub, .hero-cta, #hero-stamp, #hero-scrollhint", {
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
        });
        const s = svg.createDrawable(".hero-ridge");
        animate(s, { draw: "0 1", duration: 1200, ease: "outQuad" });
        return;
      }

      const ridges = svg.createDrawable(".hero-ridge");

      const tl = createTimeline({
        defaults: { ease: "outExpo" },
      });

      tl.add(ridges, { draw: "0 1", duration: 2200, ease: "inOutQuart", delay: stagger(260) }, 0)
        .add(
          "#hero-l1 .hero-char",
          { y: ["115%", "0%"], rotate: [7, 0], duration: 1050, delay: stagger(26) },
          350
        )
        .add("#hero-l2 .hero-char", { y: ["115%", "0%"], rotate: [7, 0], duration: 1050, delay: stagger(26) }, 560)
        .add("#hero-kanji-watermark", { opacity: [0, 1], duration: 1600, ease: "outQuad" }, 500)
        .add("#hero-stamp", { opacity: [0, 1], scale: [2.4, 1], rotate: [-24, -6], ease: createSpring({ stiffness: 62, damping: 11 }), duration: 900 }, 1250)
        .add(".hero-annotation", { opacity: [0, 1], y: [14, 0], duration: 600, delay: stagger(120) }, 1100)
        .add(".hero-sub", { opacity: [0, 1], y: [26, 0], duration: 700 }, 1500)
        .add(".hero-cta", { opacity: [0, 1], y: [26, 0], duration: 700, delay: stagger(90) }, 1620)
        .add(".hero-corner", { opacity: [0, 1], duration: 800, delay: stagger(90) }, 1750)
        .add("#hero-scrollhint", { opacity: [0, 1], duration: 600 }, 2100);

      /* watermark breathing loop */
      animate("#hero-kanji-watermark", {
        scale: [1, 1.035],
        duration: 5200,
        ease: "inOutSine",
        alternate: true,
        loop: true,
      });

      /* scroll-hint line pulse */
      animate("#hero-scrollline", {
        scaleY: [0, 1, 0],
        transformOrigin: "top",
        duration: 1900,
        ease: "inOutQuad",
        loop: true,
      });
    });

    return () => scope.revert();
  }, [start]);

  /* parallax scrub */
  useEffect(() => {
    if (!start || !root.current) return;
    const scope = createScope({ root: root.current }).add(() => {
      animate("#hero-kanji-watermark", {
        y: [0, -110],
        ease: "linear",
        autoplay: onScroll({
          target: root.current,
          enter: "top top",
          leave: "bottom top",
          sync: true,
        }),
      });
      animate("#hero-mountains", {
        y: [0, 70],
        ease: "linear",
        autoplay: onScroll({
          target: root.current,
          enter: "top top",
          leave: "bottom top",
          sync: true,
        }),
      });
    });
    return () => scope.revert();
  }, [start]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={root}
      id="top"
      className="paper-grid relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Hero — The blade is the Dao"
    >
      {/* corner labels */}
      <p className="hero-corner absolute left-5 top-24 z-10 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint sm:left-8 sm:text-[11px]">
        天门山 · Tianmen Ridge<br />N 31°08′ — E 110°12′
      </p>
      <p className="hero-corner absolute right-5 top-24 z-10 text-right font-mono text-[10px] uppercase tracking-[0.24em] text-ink-faint sm:right-8 sm:text-[11px]">
        Est. 487 AD<br />太一剑宗
      </p>

      {/* giant watermark kanji — faint texture layer */}
      <div
        id="hero-kanji-watermark"
        className="pointer-events-none absolute -right-[4vw] top-[16vh] select-none font-brush leading-[0.82] opacity-0"
        style={{ fontSize: "clamp(180px, 34vw, 560px)" }}
        aria-hidden="true"
      >
        <div className="text-ink" style={{ opacity: 0.08 }}>
          剑
        </div>
        <div className="text-seal" style={{ opacity: 0.1 }}>
          道
        </div>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-40 pt-36 sm:px-10 lg:pt-28">
        <div className="relative max-w-[1280px]">
          {/* annotation top — in flow on mobile, floating on desktop */}
          <p className="hero-annotation relative mb-6 flex items-center gap-2 pl-1 font-hand text-[22px] text-ink-soft sm:text-2xl md:absolute md:-top-14 md:mb-0 md:left-1">
            <span className="relative inline-block px-2">
              cultivators welcome
              <CircleMark className="absolute -inset-x-3 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+24px)] text-seal/70" />
            </span>
          </p>

          <h1 className="font-display font-black leading-[0.88] tracking-[-0.02em]" style={{ fontSize: "clamp(3.4rem, 11.5vw, 11.5rem)" }}>
            <span id="hero-l1" className="block">
              {toChars(LINE_1).map(({ char, key }) => (
                <span className="char-mask" key={key}>
                  <span className="hero-char char">{char === " " ? "\u00A0" : char}</span>
                </span>
              ))}
            </span>
            <span id="hero-l2" className="block">
              {toChars(LINE_2).map(({ char, key }) => (
                <span className="char-mask" key={key}>
                  <span className={`hero-char char ${char === "." ? "text-seal" : ""}`}>
                    {char === " " ? "\u00A0" : char}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          {/* annotation right of line 2 */}
          <p className="hero-annotation absolute -bottom-10 right-2 hidden items-end gap-2 font-hand text-[22px] text-ink-soft md:flex sm:text-2xl">
            <ArrowDown className="h-9 w-12 text-seal/80" />
            not just kung fu
          </p>
        </div>

        {/* stamp + sub + CTA row */}
        <div className="mt-14 flex flex-col gap-10 sm:mt-16 lg:flex-row lg:items-end lg:gap-16">
          <div id="hero-stamp" className="opacity-0">
            <Stamp chars={["玄", "天", "剑", "宗"]} size={92} />
            <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.3em] text-ink-faint">
              Sect chop · 印
            </p>
          </div>
          <div className="max-w-xl">
            <p className="hero-sub text-[16.5px] leading-relaxed text-ink-soft sm:text-[18px]">
              A digital sanctuary for wuxia cultivators — sword qi, still water,
              and nine gates between you and the sky.{" "}
              <span className="font-serifcn text-ink">修行之路，始于足下。</span>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a href="#join" onClick={go("#join")} data-cursor className="hero-cta btn-seal text-[15px]">
                Begin Cultivation <span className="font-serifcn font-normal">拜入山门</span>
              </a>
              <a href="#scripture" onClick={go("#scripture")} data-cursor className="hero-cta btn-ghost text-[15px]">
                Read the Scripture <span className="font-serifcn font-normal">典籍</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* mountains */}
      <div id="hero-mountains" className="pointer-events-none absolute inset-x-0 bottom-0 z-[5]">
        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="xMidYMax slice"
          className="block h-[26vh] w-full sm:h-[30vh]"
          aria-hidden="true"
        >
          <path
            className="hero-ridge"
            d="M-20 262 L140 208 L286 252 L432 148 L560 236 L706 118 L830 224 L986 158 L1120 246 L1268 176 L1460 258"
            fill="none"
            stroke="#2f5d46"
            strokeOpacity="0.5"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            className="hero-ridge"
            d="M-20 292 L180 258 L360 288 L540 232 L740 284 L950 238 L1150 286 L1330 252 L1460 288"
            fill="none"
            stroke="#1e3d2d"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {/* mist */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to top, #f1e9d7 12%, rgba(241,233,215,0)" }}
        />
      </div>

      {/* incense motes */}
      <IncenseMotes count={38} className="z-[6]" />

      {/* scroll hint */}
      <div
        id="hero-scrollhint"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 opacity-0"
      >
        <p className="font-mono text-[9.5px] uppercase tracking-[0.34em] text-ink-faint">
          Scroll · 下山问道
        </p>
        <svg id="hero-scrollline" viewBox="0 0 2 42" className="h-10 w-[2px] overflow-visible">
          <path d="M1 0 V42" stroke="#b5382a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
