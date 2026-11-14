import { KEEN_RAMP } from "../../../../constants/combo";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { fill } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { DUSK_RAMP, NIGHT_RAMP, VESPER_COLORS as VC } from "../../look/colors";

/** Vesper's icon shapes on the 16 by 16 canvas, in her own colours */
type S = SpriteCanvas;

export const D = DUSK_RAMP;
export const N = NIGHT_RAMP;
export const GOLD = KEEN_RAMP;

/** the long blade from the grip at (x0, y0) to the point at (x1, y1): pale, with a violet crystal at the guard */
export function longBlade(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const [ux, uy] = [(x1 - x0) / L, (y1 - y0) / L];
  fill(s, () => {
    s.stroke(x0 - ux * 2.5, y0 - uy * 2.5, x0, y0, 0.5, VC.hilt);
    s.stroke(x0 - uy * 2, y0 + ux * 2, x0 + uy * 2, y0 - ux * 2, 0.5, VC.trim);
    s.stroke(x0 + ux, y0 + uy, x1, y1, 0.7, VC.blade);
    s.stroke(x0 + ux * 2 + uy * 0.4, y0 + uy * 2 - ux * 0.4, x1 - ux * 2, y1 - uy * 2, 0.3, WHITE);
    s.set(x0, y0, VC.scarfLight);
    s.set(x1, y1, WHITE);
  });
}

/** the short blade: dark and broad, with a violet edge */
export function shortBlade(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const [ux, uy] = [(x1 - x0) / L, (y1 - y0) / L];
  fill(s, () => {
    s.stroke(x0 - ux * 2, y0 - uy * 2, x0, y0, 0.5, VC.hilt);
    s.stroke(x0 - uy * 1.6, y0 + ux * 1.6, x0 + uy * 1.6, y0 - ux * 1.6, 0.45, VC.trim);
    s.stroke(x0 + ux, y0 + uy, x1, y1, 0.85, VC.steel);
    s.stroke(x0 + ux * 1.5 - uy * 0.5, y0 + uy * 1.5 + ux * 0.5, x1 - ux, y1 - uy, 0.3, VC.scarfLight);
  });
}

/** both blades crossed in an X */
export function crossed(s: S): void {
  longBlade(s, 3, 13, 13, 3);
  shortBlade(s, 12, 12, 5, 5);
}

/** a foe's round body */
export function foe(s: S, x: number, y: number, r: number): void {
  fill(s, () => s.dot(x, y, r, N[2]));
  fill(s, () => s.set(Math.round(x - r * 0.4), Math.round(y - r * 0.3), D[5]));
}

/** Tempo pips: `n` small rising bars from (x, y) */
export function pips(s: S, x: number, y: number, n: number, c: Color = D[4]): void {
  fill(s, () => {
    for (let i = 0; i < n; i++) s.stroke(x + i * 2, y, x + i * 2, y - 1.5 - i, 0.45, c);
  });
}

/** a crescent moon: a lit disc with a dark bite */
export function moon(s: S, x: number, y: number, r: number): void {
  fill(s, () => s.dot(x, y, r, D[5]));
  fill(s, () => s.dot(x + r * 0.5, y - r * 0.3, r * 0.8, N[1]));
}

/** a swallow seen from below, wings spread, tail forked */
export function swallow(s: S, x: number, y: number, c: Color = N[2]): void {
  fill(s, () => {
    s.stroke(x - 4, y - 1.5, x, y, 0.55, c);
    s.stroke(x + 4, y - 1.5, x, y, 0.55, c);
    s.stroke(x, y, x - 1, y + 3, 0.4, c);
    s.stroke(x, y, x + 1, y + 3, 0.4, c);
    s.set(x, y, WHITE);
  });
}

/** a slim dusk figure of her, feet at (x, y), facing `face` */
export function phantom(s: S, x: number, y: number, face: number, c: Color = D[3]): void {
  fill(s, () => {
    s.dot(x + face * 0.5, y - 8, 1.4, c);
    s.poly(
      [
        [x - 1.8, y],
        [x + 1.8, y],
        [x + face * 1.5 + 1, y - 6.5],
        [x + face * 1.5 - 1.5, y - 6.5],
      ],
      c,
    );
  });
}

/** a four-point sigil diamond */
export function sigil(s: S, x: number, y: number, r: number, c: Color = D[4]): void {
  fill(s, () => {
    s.poly(
      [
        [x, y - r],
        [x + r * 0.7, y],
        [x, y + r],
        [x - r * 0.7, y],
      ],
      c,
    );
    s.set(x, y, WHITE);
  });
}
