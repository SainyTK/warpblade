import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";

export type Pt = readonly [number, number];

/** a fang or claw tip: a triangle from a base of this width, centred on base, to a point */
export function fang(s: SpriteCanvas, base: Pt, tip: Pt, width: number, c: Color): void {
  const dx = tip[0] - base[0];
  const dy = tip[1] - base[1];
  const k = width / 2 / (Math.hypot(dx, dy) || 1);
  s.poly([[base[0] - dy * k, base[1] + dx * k], [base[0] + dy * k, base[1] - dx * k], tip], c);
}

/**
 * a small glowing eye as one art pixel square: the hot colour on top, the dim one below and a white image pixel of
 * specular light in its top left corner
 */
export function glowEye(s: SpriteCanvas, x: number, y: number, hot: Color, dim: Color, spec: Color): void {
  s.block(x - 0.5, y - 0.5, hot, 1, 0.5);
  s.block(x - 0.5, y, dim, 1, 0.5);
  s.set(x - 0.5, y - 0.5, spec);
}

/**
 * Soften the image pixel row just under the silhouette's top edge toward the rim colour, from local x = 0 forward,
 * so the black sun's light reads as a band that fades into the hide. Run it before rimLight.
 */
export function rimBand(s: SpriteCanvas, c: Color, amount = 0.45): void {
  const { w, h, d } = s;
  for (let y = 2; y < h; y++)
    for (let x = s.ox; x < w; x++) {
      const i = y * w + x;
      if (d[i] && d[i - w] && !d[i - 2 * w]) d[i] = mix(d[i], c, amount);
    }
}
