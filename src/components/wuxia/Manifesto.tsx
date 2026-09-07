"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, stagger, utils } from "@/lib/anime";
import SectionLabel from "./SectionLabel";

type Word = { text: string; hot?: boolean };
const COPY: Word[] = [
  { text: "We" }, { text: "do" }, { text: "not" }, { text: "swing" }, { text: "the" },
  { text: "sword", hot: true }, { text: "to" }, { text: "conquer" }, { text: "others." },
  { text: "We" }, { text: "cultivate", hot: true }, { text: "so" }, { text: "the" },
  { text: "ten" }, { text: "thousand" }, { text: "things" }, { text: "may" }, { text: "pass" },
  { text: "through" }, { text: "us" }, { text: "like" }, { text: "wind" }, { text: "through" },
  { text: "an" }, { text: "open" }, { text: "gate." }, { text: "Stillness", hot: true },
  { text: "is" }, { text: "our" }, { text: "forge." }, { text: "Breath" }, { text: "is" },
  { text: "our" }, { text: "scripture." }, { text: "The" }, { text: "blade", hot: true },
  { text: "is" }, { text: "only" }, { text: "ever" }, { text: "a" },
  { text: "mirror.", hot: true },
];

/**
 * Manifesto — words ignite from faint ink to full as you scroll,
 * scrubbed with anime.js onScroll sync.
 */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      utils.set(".mani-word", { opacity: 1 });
      return;
    }
    const scope = { revert: () => anim.revert() };
    const anim = animate(".mani-word", {
      opacity: [0.13, 1],
      ease: "linear",
      delay: stagger(30),
      autoplay: onScroll({
        target: root.current,
        enter: "top bottom-=22%",
        leave: "bottom bottom-=42%",
        sync: true,
      }),
    });
    return scope.revert;
  }, []);

  return (
    <section
      ref={root}
      id="manifesto"
      className="paper-grid relative py-[16vh]"
      aria-label="Manifesto"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-10">
        <SectionLabel cn="论道" en="Manifesto" />
        <p className="mt-10 font-display text-[clamp(1.75rem,4.1vw,3.3rem)] font-medium leading-[1.28] tracking-[-0.01em]">
          {COPY.map((w, i) => (
            <span
              key={i}
              className={`mani-word inline-block ${
                w.hot ? "font-semibold italic text-seal" : ""
              }`}
            >
              {w.text}
              {"\u00A0"}
            </span>
          ))}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="h-px w-16 bg-ink/30" aria-hidden="true" />
          <p className="font-hand text-xl text-ink-soft sm:text-2xl">
            read slowly — the mountains aren&apos;t going anywhere
            <span className="ml-2 font-serifcn text-base text-seal">慢慢读</span>
          </p>
        </div>
      </div>
    </section>
  );
}
