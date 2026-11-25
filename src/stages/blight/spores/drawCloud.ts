import { disc, fleck, glow, px } from "../../../engine/frame";
import type { Color } from "../../../types/color";
import { TAU } from "../../../utils/math";

export interface CloudTones {
  deep: Color;
  body: Color;
  lit: Color;
  hot: Color;
  grain: Color;
}

const LOBES = 6;
const GRAINS = 12;

export function drawSporeCloud(
  x: number,
  y: number,
  r: number,
  t: number,
  k: number,
  seed: number,
  tones: CloudTones,
): void {
  if (k <= 0.02 || r < 1) return;
  const size = r * (0.75 + 0.25 * k);
  for (let i = 0; i < LOBES; i++) {
    const a = seed + i * (TAU / LOBES) + Math.sin(t * 0.7 + i) * 0.3;
    const reach = size * (0.42 + 0.12 * Math.sin(t * 1.3 + i * 2.1));
    const lx = x + Math.cos(a) * reach;
    const ly = y + Math.sin(a) * reach * 0.62;
    const lr = size * (0.5 + 0.08 * Math.sin(t * 2 + i));
    disc(lx, ly + lr * 0.3, lr, tones.deep, 0.34 * k);
  }
  for (let i = 0; i < LOBES; i++) {
    const a = seed + i * (TAU / LOBES) + Math.sin(t * 0.7 + i) * 0.3;
    const reach = size * (0.42 + 0.12 * Math.sin(t * 1.3 + i * 2.1));
    const lx = x + Math.cos(a) * reach;
    const ly = y + Math.sin(a) * reach * 0.62;
    const lr = size * (0.5 + 0.08 * Math.sin(t * 2 + i));
    disc(lx, ly, lr * 0.86, tones.body, 0.36 * k);
    disc(lx + lr * 0.2, ly - lr * 0.3, lr * 0.45, tones.lit, 0.3 * k);
  }
  disc(x + size * 0.12, y - size * 0.18, size * 0.32, tones.hot, 0.22 * k);
  for (let i = 0; i < GRAINS; i++) {
    const a = t * (i % 2 ? 1.4 : -1.1) + i * 2.39 + seed;
    const d = size * (0.25 + ((i * 37) % 11) / 13);
    const gx = x + Math.cos(a) * d;
    const gy = y + Math.sin(a) * d * 0.7 - ((t * 4 + i * 3) % 6);
    const twinkle = Math.sin(t * 8 + i * 1.9);
    if (twinkle > 0.75) px(gx, gy, tones.hot, k);
    else fleck(gx, gy, i % 3 ? tones.grain : tones.lit, k);
  }
  glow(x, y, size * 1.5, tones.body, 0.22 * k);
}
