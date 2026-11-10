import { COIN_GOLD, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, WHITE } from "../../../../utils/color";
import { fill } from "../parts";

/**
 * Small drawing parts for Tallis's 16 x 16 icons: his curved knives, the hooded assassin, a foe seen from behind with
 * the rose chevron on its back, the ink pool, smoke, crows, wraiths, needles, caltrops and the dark of Gloaming. An
 * evolved icon draws the same parts lit in gold.
 */
type S = SpriteCanvas;
/** his gloam ramp, ink to dusk rose */
export const G = PAL.gloam;
export const GOLD = COIN_GOLD[3];
export const GOLD_LIGHT = COIN_GOLD[4];
export const STEEL = hex("#aaa6b4");
export const STEEL_LIGHT = hex("#f4eef4");
export const GRIP = hex("#5e554a");
export const HOOD = hex("#3c3a46");
export const HOOD_LIGHT = hex("#5a5866");
export const MASK = hex("#5e2c56");
export const SKIN = hex("#c08a5e");
/** a foe's dark hide and its lit rim */
export const HIDE = hex("#4a3a5a");
export const HIDE_LIGHT = hex("#7a6290");
export const BLOOD = hex("#c0304a");
export const POISON = hex("#7ad06a");

/** the rose of a plain icon, the gold of an evolved one */
export const rose = (gold: boolean): Color => (gold ? GOLD : G[4]);
export const glint = (gold: boolean): Color => (gold ? GOLD_LIGHT : G[5]);

/** a curved knife from the grip at (x0, y0) to its point at (x1, y1), its edge bellied to one side */
export function knife(s: S, x0: number, y0: number, x1: number, y1: number, gold = false): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => s.stroke(x0 - ux * 2.5, y0 - uy * 2.5, x0, y0, 0.5, GRIP));
  fill(s, () => {
    s.stroke(x0 + ux * 0.5, y0 + uy * 0.5, x1, y1, 0.65, STEEL);
    const mx = (x0 + x1) / 2 - uy * 0.8;
    const my = (y0 + y1) / 2 + ux * 0.8;
    s.set(mx, my, STEEL);
  });
  fill(s, () => {
    s.set(x1 - ux * 2, y1 - uy * 2, glint(gold));
    s.set(x1, y1, WHITE);
    s.set(x0 - uy * 1.3, y0 + ux * 1.3, rose(gold));
    s.set(x0 + uy * 1.3, y0 - ux * 1.3, rose(gold));
  });
}

/** the hooded assassin, feet at (x, y), facing `face`, his half mask showing only an eye */
export function assassin(s: S, x: number, y: number, face = 1, gold = false): void {
  fill(s, () => {
    s.poly(
      [
        [x - 2.5, y],
        [x + 2.5, y],
        [x + 2, y - 6],
        [x - 2, y - 6],
      ],
      HOOD,
    );
  });
  fill(s, () => {
    s.dot(x, y - 8, 2, HOOD_LIGHT);
  });
  fill(s, () => {
    s.set(x + face, y - 8.5, SKIN);
    s.set(x + face * 1.5, y - 8.5, WHITE);
    s.stroke(x + face * 0.2, y - 7.2, x + face * 1.8, y - 7.2, 0.4, MASK);
    s.set(x - face * 2, y - 2, rose(gold));
  });
}

/** a foe seen with its back to the viewer's right, its eye looking away (left) */
export function foeBack(s: S, x: number, y: number, r = 3, face = -1): void {
  fill(s, () => s.dot(x, y, r, HIDE));
  fill(s, () => {
    s.set(x - face * (r - 1), y - r + 1, HIDE_LIGHT);
    s.set(x + face * r * 0.55, y - r * 0.3, hex("#ff8a8a"));
  });
}

/** the rose chevron that sits on an open back, pointing into it along `dir` */
export function backChevron(s: S, x: number, y: number, dir: number, gold = false): void {
  fill(s, () => {
    s.set(x, y - 1, rose(gold));
    s.set(x + dir, y, glint(gold));
    s.set(x, y + 1, rose(gold));
  });
}

/** the ink pool, w wide at floor y, two rose eyes in it */
export function inkPool(s: S, cx: number, y: number, w: number, gold = false): void {
  fill(s, () => {
    s.stroke(cx - w / 2, y, cx + w / 2, y, 0.8, G[1]);
    s.stroke(cx - w / 2 + 1, y - 1, cx + w / 2 - 1, y - 1, 0.5, G[2]);
  });
  fill(s, () => {
    s.set(cx - 1, y - 1, glint(gold));
    s.set(cx + 1, y - 1, glint(gold));
  });
}

/** a puff of smoke, r across */
export function puff(s: S, cx: number, cy: number, r: number, gold = false): void {
  fill(s, () => {
    s.dot(cx - r * 0.5, cy, r * 0.55, G[2]);
    s.dot(cx + r * 0.45, cy - r * 0.15, r * 0.6, G[2]);
    s.dot(cx, cy - r * 0.45, r * 0.5, G[3]);
  });
  fill(s, () => s.set(cx - r * 0.3, cy - r * 0.6, gold ? GOLD_LIGHT : G[4]));
}

/** a diving crow, wings swept back */
export function crow(s: S, x: number, y: number, dir = 1, gold = false): void {
  fill(s, () => {
    s.stroke(x - dir * 3, y - 2, x, y, 0.5, G[1]);
    s.stroke(x - dir * 3, y + 1.5, x, y, 0.45, G[1]);
    s.dot(x + dir * 0.6, y, 0.8, G[1]);
  });
  fill(s, () => s.set(x + dir * 1.4, y - 0.2, glint(gold)));
}

/** a hollow wraith rising from the floor at (x, y), its two eyes rose */
export function wraith(s: S, x: number, y: number, gold = false): void {
  fill(s, () => {
    s.poly(
      [
        [x - 2.5, y],
        [x - 1.5, y - 7],
        [x, y - 9],
        [x + 1.5, y - 7],
        [x + 2.5, y],
        [x + 1, y - 1.5],
        [x, y],
        [x - 1, y - 1.5],
      ],
      G[2],
    );
  });
  fill(s, () => {
    s.set(x - 0.8, y - 6.5, glint(gold));
    s.set(x + 0.8, y - 6.5, glint(gold));
  });
}

/** a needle flying along (dx, dy) to its point at (x, y) */
export function needle(s: S, x: number, y: number, dx: number, dy: number, gold = false): void {
  fill(s, () => {
    s.stroke(x - dx * 4, y - dy * 4, x, y, 0.35, gold ? GOLD : G[3]);
    s.set(x, y, gold ? GOLD_LIGHT : G[5]);
  });
}

/** one four-pointed caltrop resting on the floor at (x, y) */
export function caltrop(s: S, x: number, y: number, gold = false): void {
  fill(s, () => {
    s.stroke(x - 1.5, y, x + 1.5, y, 0.4, STEEL);
    s.stroke(x, y, x, y - 2, 0.4, STEEL);
    s.set(x, y - 2, glint(gold));
  });
}

/** drops of a bleed falling from (x, y) */
export function drops(s: S, x: number, y: number, n: number, c: Color = BLOOD): void {
  fill(s, () => {
    for (let i = 0; i < n; i++) s.set(x + i * 2, y + (i % 2) * 2, c);
  });
}

/** the dark disc of an eclipse, a rose rim of light round its edge */
export function eclipseDisc(s: S, cx: number, cy: number, r: number, gold = false): void {
  fill(s, () => s.dot(cx, cy, r + 0.8, rose(gold)));
  fill(s, () => s.dot(cx, cy, r, G[0]));
  fill(s, () => s.set(cx + r * 0.6, cy - r * 0.6, glint(gold)));
}
