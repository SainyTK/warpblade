import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { mix } from "../../../utils/color";
import { lerp } from "../../../utils/math";

export type Pt = readonly [number, number];

/** a box of whole art pixels' worth of image pixels, its top left corner at this local point */
export function block(s: SpriteCanvas, x: number, y: number, w: number, h: number, c: Color): void {
  s.poly(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    c,
  );
}

/** a limb or spine that thins from r0 at a to r1 at b */
export function taper(s: SpriteCanvas, a: Pt, b: Pt, r0: number, r1: number, c: Color): void {
  const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 2 * s.res));
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    s.dot(lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(r0, r1, u), c);
  }
}

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
  block(s, x - 0.5, y - 0.5, 1, 0.5, hot);
  block(s, x - 0.5, y, 1, 0.5, dim);
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
