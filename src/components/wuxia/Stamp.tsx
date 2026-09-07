"use client";

/** Rotated cinnabar seal stamp — the sect's chop, rendered as 2×2 hanzi. */
export default function Stamp({
  chars = ["玄", "天", "剑", "宗"],
  size = 76,
  rotate = -6,
  className = "",
}: {
  chars?: string[];
  size?: number;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={`seal-stamp grid grid-cols-2 place-items-center font-brush select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
      }}
      aria-hidden="true"
    >
      {chars.map((c, i) => (
        <span
          key={i}
          style={{ fontSize: size * 0.34, lineHeight: 1 }}
          className="leading-none"
        >
          {c}
        </span>
      ))}
    </div>
  );
}
