import { PAL, SMOKE_RAMP } from "../../../constants/palette";
import { WICK_WAX } from "../../../constants/wenna/wickLook";
import { disc, fleck, px } from "../../../engine/frame";
import { clamp } from "../../../utils/math";

const V = PAL.wick;

/** a wax pool round the feet at (x, y): a flat oval, lit along its top and shaded underneath, `half` pixels either side */
export function drawPool(x: number, y: number, half: number, alpha = 1): void {
  for (let u = -half; u <= half; u += 0.5) {
    const edge = Math.abs(u) > half - 0.75;
    fleck(x + u, y - 0.5, edge ? WICK_WAX.ink : WICK_WAX.shade, alpha);
    if (Math.abs(u) > half - 0.5) continue;
    fleck(x + u, y - 1, edge ? WICK_WAX.shade : WICK_WAX.body, alpha);
    if (Math.abs(u) < half - 1.5) fleck(x + u, y - 1.5, u < half * 0.2 ? WICK_WAX.light : WICK_WAX.body, alpha);
  }
}

/** a curl of smoke rising from a melt: soft puffs that grow and thin as they climb */
export function drawSmokeCurl(x: number, y: number, k: number, puffs: number, spread: number): void {
  for (let i = 0; i < puffs; i++) {
    const u = clamp(k * 1.4 - i * 0.12);
    if (u <= 0) continue;
    const rise = u * (6 + i * 3) * spread;
    const sway = Math.sin(u * 7 + i * 1.7) * 1.5 * spread;
    const tone = SMOKE_RAMP[Math.min(SMOKE_RAMP.length - 1, 1 + i)];
    disc(x + sway, y - rise, (0.8 + u * 1.6) * Math.sqrt(spread), tone, (1 - u) * 0.6);
  }
}

/** the row of three health pips over a hurt Wick, on a dark strip */
export function drawHealthPips(x: number, y: number, share: number): void {
  for (let dx = -3; dx <= 3; dx++) px(x + dx, y, V[0]);
  for (let i = 0; i < 3; i++) {
    const fill = clamp(share * 3 - i);
    px(x - 2 + i * 2, y, fill >= 0.999 ? V[4] : fill > 0 ? V[3] : V[1]);
  }
}
