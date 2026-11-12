import { PAL } from "../../../constants/palette";
import { fleck, glow, px } from "../../../engine/frame";
import { grain } from "../../../utils/grain";

/** px from each end over which the trail thins to nothing */
const TAPER = 6;

/**
 * Blood Trail on the floor from x0 to x1: a pool on the floor's top face, wet crimson with a darker row where it runs
 * deep and a few beads standing on it, thinning at both ends, with glints that crawl along it. `k` fades it out; `t`
 * is its age in seconds. The caller has placed the frame.
 */
export function drawBloodTrail(x0: number, x1: number, floor: number, k: number, t: number): void {
  if (k <= 0) return;
  const from = Math.round(Math.min(x0, x1));
  const to = Math.round(Math.max(x0, x1));
  const seed = from * 3 + to;
  for (let x = from; x <= to; x++) {
    const end = Math.min(x - from, to - x) / TAPER;
    const thick = Math.min(1, end) * (1 + grain(x, seed));
    if (thick < 0.4) continue;
    // the pool lies on the floor's top face: a wet top row, a darker row under it where it is deep, and a few beads
    px(x, floor, grain(x, seed + 2) < 0.2 ? PAL.rage[3] : PAL.rage[2], k);
    if (thick > 1) px(x, floor + 1, PAL.rage[1], k);
    if (thick > 1.6 && grain(x, seed + 3) < 0.3) px(x, floor - 1, PAL.rage[2], k * 0.7);
  }
  // glints that crawl along the pool
  const span = Math.max(1, to - from);
  for (let i = 0; i < 3; i++) {
    const gx = from + ((t * 18 + i * span * 0.37) % span);
    fleck(gx, floor + 0.5, PAL.rage[5], k * 0.8);
  }
  glow((from + to) / 2, floor, Math.max(8, span * 0.35), PAL.rage[2], 0.12 * k);
}
