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
 * The black sun's light on a finished sprite, in one pass over what was drawn: the top edge of every shape takes the
 * rim colour, hot from local x = 0 forward and soft behind, and the image pixel row under it fades into the hide.
 */
export function sunRim(s: SpriteCanvas, hot: Color, soft: Color, fade = 0.45): void {
  const { w, d, box } = s;
  for (let y = Math.max(2, box.y0); y <= box.y1; y++) {
    const row = y * w;
    for (let x = box.x0; x <= box.x1; x++) {
      const i = row + x;
      if (!d[i]) {
        continue;
      }
      const front = x >= s.ox;
      if (!d[i - w]) {
        d[i] = front ? hot : soft;
      } else if (!d[i - 2 * w]) {
        d[i] = mix(d[i], front ? hot : soft, fade);
      }
    }
  }
}
