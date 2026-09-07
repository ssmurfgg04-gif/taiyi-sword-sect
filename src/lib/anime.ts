/**
 * Typed re-export of anime.js v4 + shared helpers for the Wuxia site.
 * Library: https://github.com/juliangarnier/anime (anime.js v4)
 */
"use client";

export {
  animate,
  createTimeline,
  createTimer,
  createScope,
  createAnimatable,
  createSpring,
  onScroll,
  stagger,
  svg,
  utils,
  eases,
} from "animejs";

/** Split a string into per-character span-friendly data. Preserves spaces. */
export function toChars(text: string): { char: string; key: number }[] {
  return text.split("").map((char, key) => ({ char, key }));
}

/** Split a string into per-word spans (keeps trailing spaces). */
export function toWords(text: string): { word: string; key: number }[] {
  return text.split(" ").map((word, key) => ({ word, key }));
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
