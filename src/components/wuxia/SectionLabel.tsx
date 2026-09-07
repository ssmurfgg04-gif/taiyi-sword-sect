"use client";

/** Mono section label with seal square bullet — used above every heading. */
export default function SectionLabel({
  cn,
  en,
  tone = "ink",
  id,
}: {
  cn: string;
  en: string;
  tone?: "ink" | "gold";
  id?: string;
}) {
  return (
    <p
      id={id}
      className={`flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] ${
        tone === "gold" ? "text-gold" : "text-ink-soft"
      }`}
    >
      <span className="inline-block h-2 w-2 rotate-45 bg-seal" aria-hidden="true" />
      <span>
        {cn} · {en}
      </span>
    </p>
  );
}
