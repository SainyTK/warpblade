import type { SourceResult } from "../types/run";

/** a source's damage per second over the time it was held; a source held under a second counts one second */
export const sourceDps = (s: SourceResult): number => s.damage / Math.max(1, s.seconds);

/** the sources by damage, highest first */
export const bySourceDamage = (sources: readonly SourceResult[]): SourceResult[] =>
  [...sources].sort((a, b) => b.damage - a.damage);

/** the source with the highest damage per second, if any */
export function topDpsSource(sources: readonly SourceResult[]): SourceResult | undefined {
  return sources.reduce<SourceResult | undefined>(
    (best, s) => (!best || sourceDps(s) > sourceDps(best) ? s : best),
    undefined,
  );
}

/** the units a shortened number steps through, a thousand apart */
const UNITS = ["", "k", "M", "B"] as const;

/** a number shortened: 0.4, 950, 12.4k, 1.2M; below 10 it keeps one decimal, so a slow source does not read as 0 */
export function shortNumber(n: number): string {
  let scaled = n;
  let unit = 0;
  while (unit < UNITS.length - 1 && Math.round(scaled) >= 1000) {
    scaled /= 1000;
    unit++;
  }
  if (unit === 0) return n < 10 ? n.toFixed(1).replace(/\.0$/, "") : String(Math.round(n));
  const digits = scaled < 99.95 ? scaled.toFixed(1).replace(/\.0$/, "") : String(Math.round(scaled));
  return `${digits}${UNITS[unit]}`;
}

/** seconds as minutes and seconds: 7:05 */
export function minutesSeconds(seconds: number): string {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
