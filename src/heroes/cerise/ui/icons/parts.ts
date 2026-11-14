import { BASE_HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { fill } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { ROSE_RAMP } from "../../look/rose";

/** the rose light every icon of hers draws in */
export const R = ROSE_RAMP;

/** her rapier from the grip at (x0, y0) to the point at (x1, y1): a needle blade, a curled silver guard, a rose crystal */
export function rapier(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => {
    s.stroke(x0 - ux * 2.5, y0 - uy * 2.5, x0, y0, 0.5, HC.hilt);
    s.stroke(x0 + ux, y0 + uy, x1, y1, 0.45, HC.steelLight);
    s.set(x1, y1, WHITE);
  });
  fill(s, () => {
    s.stroke(x0 - uy * 2.2, y0 + ux * 2.2, x0 + uy * 2.2, y0 - ux * 2.2, 0.4, HC.steelLight);
    s.stroke(x0 + uy * 2, y0 - ux * 2, x0 - ux * 2.4 + uy * 1.2, y0 - uy * 2.4 - ux * 1.2, 0.35, HC.steelLight);
    s.dot(x0, y0, 0.7, R[3]);
  });
}

/** a foe's round body, dark, with a lighter rim */
export function foe(s: SpriteCanvas, cx: number, cy: number, r: number): void {
  fill(s, () => {
    s.dot(cx, cy, r, 0x3a2a44);
    s.dot(cx - r * 0.3, cy - r * 0.3, r * 0.45, 0x5a4a6a);
  });
}

/** a thin streak along a thrust's line */
export function streak(s: SpriteCanvas, x0: number, y: number, x1: number, c: Color = R[4]): void {
  fill(s, () => {
    s.stroke(x0, y, x1, y, 0.45, c);
    s.set(x1, y, WHITE);
  });
}

/** a rose pip, as on the PT bar */
export function pip(s: SpriteCanvas, cx: number, cy: number): void {
  fill(s, () => {
    s.dot(cx, cy, 1.1, R[3]);
    s.set(cx - 0.4, cy - 0.4, R[6]);
  });
}

/** a rose petal */
export function petal(s: SpriteCanvas, cx: number, cy: number, r: number, c: Color = R[3]): void {
  fill(s, () => {
    s.dot(cx, cy, r, c);
    s.set(cx - r * 0.4, cy - r * 0.4, R[5]);
  });
}

/** the rose mark's sigil: a small four-point star */
export function sigil(s: SpriteCanvas, cx: number, cy: number, r: number): void {
  fill(s, () => {
    s.stroke(cx - r, cy, cx + r, cy, 0.35, R[4]);
    s.stroke(cx, cy - r, cx, cy + r, 0.35, R[4]);
    s.set(cx, cy, WHITE);
  });
}
