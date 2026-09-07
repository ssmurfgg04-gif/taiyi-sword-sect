"use client";

import { useEffect, useRef, useState } from "react";
import { animate, createSpring } from "@/lib/anime";

const LINKS = [
  { href: "#manifesto", en: "Manifesto", cn: "论道" },
  { href: "#realms", en: "Realms", cn: "境界" },
  { href: "#techniques", en: "Techniques", cn: "道法" },
  { href: "#masters", en: "Masters", cn: "长老" },
  { href: "#scripture", en: "Scripture", cn: "典籍" },
];

/**
 * Floating pill navbar — illoca-style paper pill with hard shadow,
 * seal-red CTA, staggered overlay menu on mobile.
 */
export default function Nav({ start }: { start: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!start || !root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root.current.style.opacity = "1";
      const pill = root.current.querySelector("#nav-pill") as HTMLElement | null;
      if (pill) pill.style.opacity = "1";
      return;
    }
    const spring = createSpring({ stiffness: 68, damping: 13 });
    animate("#nav-pill", {
      opacity: [0, 1],
      y: [-90, 0],
      ease: spring,
      duration: 1100,
      delay: 150,
    });
  }, [start]);

  useEffect(() => {
    if (open) {
      animate("#menu-overlay", { opacity: [0, 1], duration: 280, ease: "outQuad" });
      animate("#menu-overlay .menu-link", {
        y: [44, 0],
        opacity: [0, 1],
        duration: 620,
        delay: (_: unknown, i: number) => 90 + i * 55,
        ease: "outExpo",
      });
    }
  }, [open]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header ref={root} className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav
        id="nav-pill"
        aria-label="Sect navigation"
        style={{ opacity: 0 }}
        className={`flex w-full max-w-3xl items-center justify-between gap-4 rounded-xl border px-3 py-2 transition-colors duration-300 shadow-hard-sm ${
          scrolled
            ? "border-ink/20 bg-paper-bright/95 backdrop-blur-md"
            : "border-ink/15 bg-paper-bright/85 backdrop-blur-sm"
        }`}
      >
        {/* Logo */}
        <a
          href="#top"
          onClick={go("#top")}
          className="flex items-center gap-2.5 pl-1"
          data-cursor
          aria-label="Taiyi Sword Sect — back to top"
        >
          <span className="seal-stamp grid h-9 w-9 place-items-center" style={{ transform: "none", outlineOffset: "-4px" }}>
            <span className="font-brush text-lg leading-none text-paper-bright">剑</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serifcn text-[13px] font-bold tracking-wide">太一剑宗</span>
            <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.22em] text-ink-faint">
              Taiyi Sword Sect
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={go(l.href)}
                data-cursor
                className="hover-dots font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-seal"
              >
                {l.en} <span className="font-serifcn normal-case tracking-normal">{l.cn}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href="#join" onClick={go("#join")} data-cursor className="btn-seal !hidden !px-4 !py-2 text-[12.5px] whitespace-nowrap sm:!inline-flex">
            Join <span className="font-serifcn font-normal">拜师</span>
          </a>
          {/* Burger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-md border border-ink/20 bg-paper-bright lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-ink transition-transform duration-300 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-ink transition-transform duration-300 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div
          id="menu-overlay"
          className="fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-6 bg-paper paper-grid lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={go(l.href)}
              className="menu-link flex items-baseline gap-3 font-display text-4xl font-bold"
            >
              <span className="font-serifcn text-lg text-seal">{l.cn}</span>
              {l.en}
            </a>
          ))}
          <a href="#join" onClick={go("#join")} className="menu-link btn-seal mt-4 text-base">
            Join the sect <span className="font-serifcn font-normal">拜师</span>
          </a>
          <p className="menu-link absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            太一剑宗 · Est. 487 AD
          </p>
        </div>
      )}
    </header>
  );
}
