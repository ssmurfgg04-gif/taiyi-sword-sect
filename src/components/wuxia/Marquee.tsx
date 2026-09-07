"use client";

const ITEMS: [string, string][] = [
  ["炼气", "Qi Refining"],
  ["筑基", "Foundation"],
  ["金丹", "Golden Core"],
  ["元婴", "Nascent Soul"],
  ["化神", "Spirit Severing"],
  ["洞虚", "Void Illumination"],
  ["合体", "Unity"],
  ["大乘", "Great Vehicle"],
  ["飞升", "Ascension"],
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map(([cn, en], i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-brush text-xl text-jade">{cn}</span>
          <span className="ml-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
            {en}
          </span>
          <span className="mx-6 inline-block h-2 w-2 rotate-45 bg-seal/80" aria-hidden="true" />
        </span>
      ))}
    </div>
  );
}

/** Infinite realm marquee — the nine gates looping across a bordered strip. */
export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y border-ink/15 bg-paper py-3.5"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max">
        <Row />
        <Row />
      </div>
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
