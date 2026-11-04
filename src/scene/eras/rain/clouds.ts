import { H, W } from "../../../constants/stage";
import { bayerAt } from "../../../engine/frame";
import { mix } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import type { Rng } from "../../../utils/rng";
import { CLOUD_DARK, CLOUD_LIGHT, RAIN_COLORS as RC } from "./palette";

/** where the hidden sun glows through the clouds, fading out as the storm builds */
export const SUN = { x: 236, y: 40, r: 48 } as const;

/** base row, puff radius range and puff count of each bank, far to near */
const BANKS: readonly (readonly [number, number, number, number])[] = [
  [104, 6, 13, 26],
  [84, 8, 17, 20],
  [60, 10, 20, 16],
  [30, 12, 24, 14],
];

/**
 * Overcast banks drawn far to near: each is a row of round puffs over a wavy base, dithered at its top edge, darker
 * through the body and lit along its underside. The hidden sun brightens what lies in front of it.
 */
export function drawClouds(bg: Uint32Array, r: Rng, k: number): void {
  const top = new Float32Array(W);
  for (let b = 0; b < BANKS.length; b++) {
    const [base, r0, r1, n] = BANKS[b];
    const [rim, body, under] = CLOUD_LIGHT[b].map((c, i) => mix(c, CLOUD_DARK[b][i], k));
    top.fill(Number.POSITIVE_INFINITY);
    for (let i = 0; i < n; i++) {
      const cx = r.range(-20, W + 20);
      const pr = r.range(r0, r1) * (1 + k * 0.25);
      const lift = r.range(0, pr * 0.5);
      for (let x = Math.max(0, Math.floor(cx - pr)); x <= Math.min(W - 1, Math.ceil(cx + pr)); x++) {
        const u = (x + 0.5 - cx) / pr;
        const y = base - lift - Math.sqrt(Math.max(0, 1 - u * u)) * pr * 0.8;
        if (y < top[x]) top[x] = y;
      }
    }
    const p0 = r.range(0, 6);
    const p1 = r.range(0, 6);
    for (let x = 0; x < W; x++) {
      const bottom = base + Math.sin(x * 0.045 + p0) * 3 + Math.sin(x * 0.12 + p1) * 1.5;
      const t0 = Math.min(top[x], bottom - 3);
      for (let y = Math.max(0, Math.floor(t0)); y < Math.min(H, Math.ceil(bottom)); y++) {
        const th = bayerAt(x, y);
        const edgeTop = y + 0.5 - t0;
        const edgeBottom = bottom - (y + 0.5);
        // the top and bottom rows break up in the dither, so the banks have soft edges
        if (edgeTop < 1.2 && th > 0.5) continue;
        if (edgeBottom < 1 && th > 0.45) continue;
        const v = (y + 0.5 - t0) / Math.max(1, bottom - t0);
        let c = edgeTop < 2 ? rim : body;
        if (v > 0.62 && (v - 0.62) * 3.2 > th) c = under;
        const sun = clamp(1 - Math.hypot(x - SUN.x, (y - SUN.y) * 1.3) / SUN.r) * (1 - k);
        if (sun > 0) c = mix(c, RC.sunHaze, sun * sun * (0.5 + th * 0.2));
        bg[y * W + x] = c;
      }
    }
  }
}

/** grey curtains of rain hanging from the far banks, stronger as the storm builds */
export function drawCurtains(bg: Uint32Array, r: Rng, k: number): void {
  const n = 2 + Math.round(k * 4);
  for (let i = 0; i < n; i++) {
    const cx = r.range(10, W - 10);
    const w = r.range(18, 44);
    const y0 = r.range(78, 92);
    for (let y = Math.floor(y0); y < 128; y++)
      for (let x = Math.floor(cx - w / 2); x < cx + w / 2; x++) {
        if (x < 0 || x >= W) continue;
        const slant = Math.floor(x + (y - y0) * 0.35);
        if (slant % 3 !== 0) continue;
        const edge = clamp(1 - Math.abs(x - cx) / (w / 2)) * clamp((y - y0) / 8) * clamp((128 - y) / 20);
        if (edge * (0.4 + k * 0.4) <= bayerAt(x, y)) continue;
        const i2 = y * W + x;
        bg[i2] = mix(bg[i2], RC.dropFar, 0.22);
      }
  }
}
