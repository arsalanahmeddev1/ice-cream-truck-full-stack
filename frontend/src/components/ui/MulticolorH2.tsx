import {
  Fragment,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "@/src/lib/utils";

/** Brand palette only — order preserved for rotation */
const LETTER_COLORS = [
  "#2294F2",
  "#80C9EE",
  "#94CEA7",
  "#C13195",
  "#E7A66D",
] as const;

/** Only treat as “same as background” when colours are very close in RGB, or nearly invisible. */
const CLASH_RGB_DISTANCE = 52;
const CLASH_MIN_CONTRAST = 1.18;
/** If strict clash filtering leaves fewer than this many swatches (e.g. mint sections), fall back to softer rules. */
const MIN_PALETTE_FOR_BG = 3;

const CSS_VAR_HEX: Record<string, string> = {
  "var(--primary)": "#1b66d0",
  "var(--secondary)": "#c13194",
  "var(--accent)": "#60ae74",
  "var(--background)": "#0a0a0a",
  "var(--default-theme)": "#ffffff",
};

const FALLBACK_LIGHT = "#ffffff";
const FALLBACK_DARK = "#0a0a0a";

function hexToRgb(hex: string): [number, number, number] | null {
  let h = hex.replace(/^#/, "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function parseColorToRgb(input: string): [number, number, number] | null {
  const s = input.trim();
  if (CSS_VAR_HEX[s]) return hexToRgb(CSS_VAR_HEX[s]);
  const compact = s.replace(/\s+/g, "").toLowerCase();
  const key = Object.keys(CSS_VAR_HEX).find(
    (k) => k.replace(/\s+/g, "").toLowerCase() === compact,
  );
  if (key) return hexToRgb(CSS_VAR_HEX[key]);
  if (s.startsWith("#")) return hexToRgb(s);
  const m = s.match(/^rgba?\(\s*(\d+)\s*[, ]\s*(\d+)\s*[, ]\s*(\d+)/i);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}

function luminance(r: number, g: number, b: number): number {
  const lin = (c: number) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(
  rgbA: [number, number, number],
  rgbB: [number, number, number],
): number {
  const l1 = luminance(...rgbA) + 0.05;
  const l2 = luminance(...rgbB) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

function rgbDistance(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** True when the swatch is very close to the background in RGB (e.g. mint letter on mint panel). */
function colorNearlySameRgbAsBg(
  letterHex: string,
  bgRgb: [number, number, number],
): boolean {
  const fg = parseColorToRgb(letterHex);
  if (!fg) return false;
  return rgbDistance(fg, bgRgb) < CLASH_RGB_DISTANCE;
}

function colorClashesWithBg(
  letterHex: string,
  bgRgb: [number, number, number],
): boolean {
  const fg = parseColorToRgb(letterHex);
  if (!fg) return false;
  const cr = contrastRatio(fg, bgRgb);
  const dist = rgbDistance(fg, bgRgb);
  // Very similar to bg (user: “match ho rha”) — don’t use this swatch
  if (dist < CLASH_RGB_DISTANCE) return true;
  // Almost no luminance difference at all (e.g. white on off‑white)
  if (cr < CLASH_MIN_CONTRAST) return true;
  return false;
}

function colorsEqual(a: string, b: string): boolean {
  const ra = parseColorToRgb(a);
  const rb = parseColorToRgb(b);
  if (!ra || !rb) return a.toLowerCase() === b.toLowerCase();
  return ra[0] === rb[0] && ra[1] === rb[1] && ra[2] === rb[2];
}

/**
 * Palette for a given section fill. Strict mode drops low-contrast-on-bg swatches;
 * on tinted panels (mint, etc.) that can shrink to 1–2 hues and look like a two-tone heading.
 * Softer step only removes colours that are RGB-near the background; last resort is full brand list.
 */
function safePaletteForBg(bgRgb: [number, number, number]): string[] {
  const strict = LETTER_COLORS.filter((c) => !colorClashesWithBg(c, bgRgb));
  if (strict.length >= MIN_PALETTE_FOR_BG) return [...strict];

  const soft = LETTER_COLORS.filter((c) => !colorNearlySameRgbAsBg(c, bgRgb));
  if (soft.length >= MIN_PALETTE_FOR_BG) return [...soft];

  const out: string[] = [];
  if (!colorClashesWithBg(FALLBACK_LIGHT, bgRgb)) out.push(FALLBACK_LIGHT);
  if (!colorClashesWithBg(FALLBACK_DARK, bgRgb)) out.push(FALLBACK_DARK);
  if (out.length >= MIN_PALETTE_FOR_BG) return out;

  return [...LETTER_COLORS];
}

/**
 * Rotate through the safe pool so headings stay multicolor, and never use the same
 * color as the previous letter when another option exists.
 */
function pickLetterColor(
  letterOrdinal: number,
  previousLetterColor: string | null,
  bgRgb: [number, number, number] | null,
): string {
  const n = LETTER_COLORS.length;

  if (!bgRgb) {
    let idx = letterOrdinal % n;
    let pick = LETTER_COLORS[idx];
    if (previousLetterColor && colorsEqual(pick, previousLetterColor)) {
      for (let step = 1; step < n; step++) {
        pick = LETTER_COLORS[(idx + step) % n];
        if (!colorsEqual(pick, previousLetterColor)) break;
      }
    }
    return pick;
  }

  const pool = safePaletteForBg(bgRgb);
  const m = pool.length;
  let idx = letterOrdinal % m;
  let pick = pool[idx];

  if (previousLetterColor && colorsEqual(pick, previousLetterColor) && m > 1) {
    for (let step = 1; step < m; step++) {
      pick = pool[(idx + step) % m];
      if (!colorsEqual(pick, previousLetterColor)) break;
    }
  }

  return pick;
}

const SPAN_DATA_MCH_RE =
  /<span\s+data-mch\s*=\s*"([^"]+)">([\s\S]*?)<\/span>/gi;
const SPAN_STYLE_DQ_RE =
  /<span\s+style\s*=\s*"([^"]*)"\s*>([\s\S]*?)<\/span>/gi;
const SPAN_STYLE_SQ_RE =
  /<span\s+style\s*=\s*'([^']*)'\s*>([\s\S]*?)<\/span>/gi;

type LineSegment =
  | { kind: "plain"; text: string }
  | { kind: "solid"; color: string; text: string };

type ColoredSpanMatch = {
  start: number;
  end: number;
  color: string;
  inner: string;
};

function extractColorFromStyleAttr(styleAttr: string): string | null {
  const cm = styleAttr.match(/color\s*:\s*([^;]+)/i);
  if (!cm) return null;
  const raw = cm[1].trim();
  const lower = raw.toLowerCase();
  if (
    lower.includes("url(") ||
    lower.includes("expression(") ||
    lower.includes("@import")
  ) {
    return null;
  }
  return raw;
}

function sanitizeSpanInner(inner: string): string {
  return inner.replace(/<[^>]*>/g, "");
}

function mergeNonOverlappingSpans(
  matches: ColoredSpanMatch[],
): ColoredSpanMatch[] {
  const sorted = [...matches].sort((a, b) => a.start - b.start);
  const out: ColoredSpanMatch[] = [];
  let maxEnd = -1;
  for (const span of sorted) {
    if (span.start < maxEnd) continue;
    out.push(span);
    maxEnd = Math.max(maxEnd, span.end);
  }
  return out;
}

/**
 * Plain runs use letter-by-letter palette; fixed colors via either:
 *
 * - `<span data-mch="#C13195">y</span>`
 * - `<span style="color: #C13195">y</span>` (or `style='color: …'`)
 *
 * Color values must pass `parseColorToRgb` (same as `sectionBackground`).
 */
function parseLineSegments(line: string): LineSegment[] {
  const matches: ColoredSpanMatch[] = [];

  let m: RegExpExecArray | null;

  const dataRe = new RegExp(SPAN_DATA_MCH_RE.source, "gi");
  while ((m = dataRe.exec(line)) !== null) {
    const rawColor = m[1].trim();
    const inner = sanitizeSpanInner(m[2]);
    if (parseColorToRgb(rawColor) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        color: rawColor,
        inner,
      });
    }
  }

  const dqRe = new RegExp(SPAN_STYLE_DQ_RE.source, "gi");
  while ((m = dqRe.exec(line)) !== null) {
    const colorToken = extractColorFromStyleAttr(m[1]);
    const inner = sanitizeSpanInner(m[2]);
    if (colorToken && parseColorToRgb(colorToken) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        color: colorToken,
        inner,
      });
    }
  }

  const sqRe = new RegExp(SPAN_STYLE_SQ_RE.source, "gi");
  while ((m = sqRe.exec(line)) !== null) {
    const colorToken = extractColorFromStyleAttr(m[1]);
    const inner = sanitizeSpanInner(m[2]);
    if (colorToken && parseColorToRgb(colorToken) !== null) {
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        color: colorToken,
        inner,
      });
    }
  }

  const merged = mergeNonOverlappingSpans(matches);
  const segments: LineSegment[] = [];
  let last = 0;
  for (const span of merged) {
    if (span.start > last) {
      segments.push({ kind: "plain", text: line.slice(last, span.start) });
    }
    segments.push({ kind: "solid", color: span.color, text: span.inner });
    last = span.end;
  }
  if (last < line.length) {
    segments.push({ kind: "plain", text: line.slice(last) });
  }
  if (segments.length === 0) {
    segments.push({ kind: "plain", text: line });
  }
  return segments;
}

function renderMulticolorText(
  text: string,
  sectionBackground?: string,
  useFullBrandPalette?: boolean,
  letterColorOverrides?: Readonly<Record<number, string>>,
) {
  const bgRgb =
    useFullBrandPalette || !sectionBackground
      ? null
      : parseColorToRgb(sectionBackground);

  let letterOrdinal = 0;
  let previousLetterColor: string | null = null;
  let key = 0;

  const renderCharPlain = (char: string): ReactNode => {
    const k = key++;
    if (/\p{L}/u.test(char)) {
      const forced = letterColorOverrides?.[letterOrdinal];
      const color =
        forced ??
        pickLetterColor(letterOrdinal, previousLetterColor, bgRgb);
      previousLetterColor = color;
      letterOrdinal += 1;
      return (
        <span key={k} style={{ color }}>
          {char}
        </span>
      );
    }
    return <span key={k}>{char}</span>;
  };

  const renderPlainRun = (run: string): ReactNode[] =>
    run.split("").map((ch) => renderCharPlain(ch));

  const renderSolidRun = (run: string, color: string): ReactNode[] =>
    run.split("").map((char) => {
      const k = key++;
      if (/\p{L}/u.test(char)) {
        previousLetterColor = color;
        letterOrdinal += 1;
        return (
          <span key={k} style={{ color }}>
            {char}
          </span>
        );
      }
      return <span key={k}>{char}</span>;
    });

  const renderLine = (line: string): ReactNode[] => {
    const nodes: ReactNode[] = [];
    for (const seg of parseLineSegments(line)) {
      if (seg.kind === "plain") {
        nodes.push(...renderPlainRun(seg.text));
      } else {
        nodes.push(...renderSolidRun(seg.text, seg.color));
      }
    }
    return nodes;
  };

  const lines = text.split("\n");
  const out: ReactNode[] = [];
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      out.push(<br key={`br-${key++}`} />);
    }
    out.push(
      <Fragment key={`ln-${lineIndex}`}>{renderLine(line)}</Fragment>,
    );
  });
  return out;
}

export type MulticolorHeadingTag = "h1" | "h2" | "p";

export type MulticolorH2Props = Omit<
  ComponentPropsWithoutRef<"h2">,
  "children"
> & {
  /**
   * Plain text is multicolored per letter. Fixed colors: wrap in
   * `<span style="color: #…">…</span>` or `<span data-mch="#…">…</span>`.
   */
  children: string;
  sectionBackground?: string;
  /**
   * Skip background clash filtering; rotate all `LETTER_COLORS`.
   * Use with `sectionBackground` when the safe pool shrinks too much.
   */
  useFullBrandPalette?: boolean;
  /**
   * Optional: force color by 0-based letter index (spaces not counted). Span markup overrides this for those letters.
   */
  letterColorOverrides?: Readonly<Record<number, string>>;
  /** Default `h2`. Use `h1` for heroes, `p` for non-heading branding (e.g. header drawer). */
  as?: MulticolorHeadingTag;
};

export function MulticolorH2({
  as = "h2",
  className,
  children,
  sectionBackground,
  useFullBrandPalette,
  letterColorOverrides,
  ...props
}: MulticolorH2Props) {
  const Tag = as;
  return (
    <Tag className={cn(className)} {...props}>
      {renderMulticolorText(
        children,
        sectionBackground,
        useFullBrandPalette,
        letterColorOverrides,
      )}
    </Tag>
  );
}
