import type { CSSProperties } from "react";
import { cn } from "@/src/lib/utils";

/** Sprinkle colors (Figma): yellow, magenta, lime, cyan — not blue (video particles). */
const SPRINKLE_COLORS = ["#FFEB3B", "#FF4081", "#C6FF00", "#4DD0E1"] as const;

type Particle = {
  left: number;
  top: number;
  rotate: number;
  delay: number;
  duration: number;
  colorIndex: number;
  w: number;
  h: number;
};

/** Deterministic PRNG so SSR + client match (no hydration flash). */
function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildParticles(seed: number, count: number): Particle[] {
  const rng = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    left: rng() * 100,
    top: rng() * 100,
    rotate: rng() * 360,
    delay: rng() * 10,
    duration: 7 + rng() * 9,
    colorIndex: Math.floor(rng() * SPRINKLE_COLORS.length),
    w: 7 + rng() * 7,
    h: 2 + rng() * 2.5,
  }));
}

export type SprinkleParticlesProps = {
  /** How many sprinkles (e.g. hero ~45–55, quiet sections ~12–22). */
  count?: number;
  /** Change pattern per section instance. */
  seed?: number;
  className?: string;
};

/**
 * Colorful sprinkle / confetti dashes (Figma-style). Use on any `relative` section.
 * Sits above background layers; keep content above with higher z-index (e.g. z-10).
 */
export function SprinkleParticles({
  count = 52,
  seed = 42,
  className,
}: SprinkleParticlesProps) {
  const particles = buildParticles(seed, count);

  return (
    <div
      className={cn(
        "sprinkle-particles pointer-events-none absolute inset-0 z-2 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {particles.map((p, i) => (
        <span
          key={`${seed}-${i}`}
          className="sprinkle-particles__bit"
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.w}px`,
              height: `${p.h}px`,
              backgroundColor: SPRINKLE_COLORS[p.colorIndex],
              ["--sprinkle-rot"]: `${p.rotate}deg`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
