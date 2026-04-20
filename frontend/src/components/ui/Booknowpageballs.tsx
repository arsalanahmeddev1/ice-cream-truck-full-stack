import type { CSSProperties } from "react";
import { cn } from "@/src/lib/utils";

/** Same PRNG as SprinkleParticles — SSR + client match. */
function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BALL_COLOR_VARS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "color-mix(in srgb, var(--primary) 50%, var(--secondary))",
  "color-mix(in srgb, var(--accent) 45%, var(--primary))",
] as const;

type Ball = {
  leftPct: number;
  delayS: number;
  durationS: number;
  sizePx: number;
  driftPx: number;
  colorIndex: number;
};

function buildBalls(seed: number, count: number): Ball[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    leftPct: rng() * 100,
    delayS: rng() * 14,
    durationS: 4 + rng() * 14,
    sizePx: 100 + rng() * 22,
    driftPx: (rng() - 0.5) * 36,
    colorIndex: Math.floor(rng() * BALL_COLOR_VARS.length),
  }));
}

export type BooknowpageballsProps = {
  /** Change pattern per page (deterministic). */
  seed?: number;
  /** Number of falling orbs. */
  count?: number;
  className?: string;
};

/**
 * Decorative falling circles for Book Now — uses site tokens (--primary, --secondary, --accent).
 * Layer behind main content; `pointer-events: none`.
 */
export default function Booknowpageballs({
  seed = 2027,
  count = 26,
  className,
}: BooknowpageballsProps) {
  const balls = buildBalls(seed, count);

  return (
    <div
      className={cn(
        "book-now-falling-balls pointer-events-none absolute inset-0 z-[10] overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {balls.map((b, i) => {
        const style = {
          left: `${b.leftPct}%`,
          top: "15%",
          width: b.sizePx,
          height: b.sizePx,
          animationDelay: `${b.delayS}s`,
          animationDuration: `${b.durationS}s`,
          background: BALL_COLOR_VARS[b.colorIndex],
          ["--ball-drift" as string]: `${b.driftPx}px`,
        } satisfies CSSProperties;

        return (
          <span
            key={`${seed}-${i}`}
            className="book-now-falling-balls__ball absolute rounded-full shadow-sm"
            style={style}
          />
        );
      })}
    </div>
  );
}
