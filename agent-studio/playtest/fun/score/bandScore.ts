import type { Band } from "./types";

const SCORE_FLOOR = 1;

function position(band: Band, value: number): number {
  return band.scale === "log" ? Math.log10(Math.max(value, Number.MIN_VALUE)) : value;
}

export function bandScore(band: Band, raw: number): number {
  const points = band.points.map(([x, score]) => [position(band, x), score] as const);
  const x = position(band, raw);
  const ascending = points[0][0] <= points[points.length - 1][0];
  const ordered = ascending ? points : [...points].reverse();
  if (x <= ordered[0][0]) {
    return Math.max(SCORE_FLOOR, ordered[0][1]);
  }
  for (let i = 1; i < ordered.length; i++) {
    const [x1, s1] = ordered[i];
    if (x <= x1) {
      const [x0, s0] = ordered[i - 1];
      const share = x1 === x0 ? 1 : (x - x0) / (x1 - x0);
      return Math.max(SCORE_FLOOR, s0 + (s1 - s0) * share);
    }
  }
  return Math.max(SCORE_FLOOR, ordered[ordered.length - 1][1]);
}

export const rubricScore = (level: number) => Math.max(SCORE_FLOOR, (level - 1) * 25);
