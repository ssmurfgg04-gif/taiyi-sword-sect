"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { animate, stagger, utils } from "@/lib/anime";
import Stamp from "./Stamp";

/** The Gate — join-the-sect CTA with crane-mail form. */
export default function Gate() {
  const root = useRef<HTMLElement>(null);
  const played = useRef(false);
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setName("");
      setEmail("");
      toast({
        title: "鹤书已发 — The crane is away.",
        description: `Your application has been tied to a crane${
          name ? `, ${name}` : ""
        }. Expect a reply within 3–5 moon cycles.`,
      });
    }, 700);
  };

  useEffect(() => {
    const el = root.current;
    if (!el || played.current) return;
    played.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    utils.set(".gate-reveal", { opacity: 0, y: 34 });
    utils.set("#gate-stamp", { opacity: 0 });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        animate(".gate-reveal", {
          opacity: [0, 1],
          y: [34, 0],
          duration: 850,
          delay: stagger(90),
          ease: "outExpo",
        });
        animate("#gate-stamp", {
          opacity: [0, 1],
          scale: [2, 1],
          rotate: [-18, -6],
          duration: 800,
          delay: 350,
          ease: "outBack(1.4)",
        });
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="join"
      className="paper-grid relative border-t border-ink/10 py-[16vh]"
      aria-label="Join the sect"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-10">
        <div id="gate-stamp" className="mx-auto w-fit opacity-0" style={{ transform: "rotate(-6deg)" }}>
          <Stamp chars={["拜", "帖", "之", "印"]} size={72} />
        </div>

        <h2 className="gate-reveal mt-10 font-display font-black leading-[0.95] tracking-[-0.02em]" style={{ fontSize: "clamp(2.6rem, 7vw, 5.6rem)" }}>
          Begin your
          <br />
          <span className="italic text-seal">cultivation</span>
        </h2>
        <p className="gate-reveal mt-4 font-brush text-3xl text-jade sm:text-4xl">
          拜入山门
        </p>

        <p className="gate-reveal mx-auto mt-8 max-w-xl text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
          The gate opens at dawn, at dusk, and exactly once in every storm.
          Leave your name; a crane will carry it up the mountain. Bring nothing
          you are afraid to lose — especially your opinions.
        </p>

        <form onSubmit={submit} className="gate-reveal mx-auto mt-12 grid max-w-xl gap-6 text-left sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-faint">
              Disciple name · 道号
            </span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Li Wuxin"
              className="input-dashed mt-1.5"
              maxLength={40}
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-faint">
              Crane address · 信箱
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@still-water.ink"
              className="input-dashed mt-1.5"
              maxLength={80}
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" data-cursor className="btn-seal w-full justify-center text-[15px] sm:w-auto" disabled={sending}>
              {sending ? "Tying the scroll…" : "Send my application"}
              <span className="font-serifcn font-normal">递帖入门</span>
            </button>
            <p className="mt-4 font-mono text-[9.5px] uppercase tracking-[0.24em] text-ink-faint">
              Applications carried by crane · replies within 3–5 moon cycles
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
