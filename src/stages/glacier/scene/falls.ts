import { noise } from "../../../scene/eras/rain/noise";

export const FALLS: readonly { x: number; w: number }[] = [
  { x: 124, w: 7 },
  { x: 306, w: 5 },
];

export function fallAt(x: number, y: number): number {
  for (const f of FALLS) {
    const cx = f.x + 1.5 * Math.sin(y / 19 + f.x);
    const half = f.w + Math.max(0, y - 116) * 0.32 + 1.2 * noise(y * 0.2, f.x);
    const u = Math.abs(x - cx) / half;
    if (u >= 1) continue;
    const streak = noise(x * 0.9, y * 0.05 + f.x);
    return 0.15 + 0.85 * streak ** 1.5 - 0.35 * u * u;
  }
  return -1;
}
