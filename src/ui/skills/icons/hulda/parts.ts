import { HULDA_SKIN, RUST } from "../../../../constants/characters/hulda/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { WHITE } from "../../../../utils/color";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/** Small drawing parts for Hulda's 16 x 16 icons: gauntlet fists, plates, a held body, cracks, shields and a bear. */
type S = SpriteCanvas;
export const HC = HULDA_SKIN.colors;

/** an iron gauntlet's fist, knuckles toward `dir` (1 right, -1 left), centred at (x, y), r across */
export function fist(s: S, x: number, y: number, r = 3.6, dir = 1): void {
  fill(s, () => {
    s.poly(
      [
        [x - dir * (r + 3), y - r * 0.55],
        [x - dir * r, y - r * 0.55],
        [x - dir * r, y + r * 0.55],
        [x - dir * (r + 3), y + r * 0.55],
      ],
      HC.glove,
    );
    seg(s, x - dir * (r + 3), y - r * 0.55, x - dir * r, y - r * 0.55, HC.gloveLight);
  });
  fill(s, () => {
    s.dot(x, y, r, HC.steel);
    s.dot(x - 1, y - 1, r * 0.55, HC.steelLight);
  });
  fill(s, () => {
    seg(s, x - dir * r * 0.2, y - r * 0.6, x - dir * r * 0.2, y + r * 0.6, HC.steelDark);
    for (const k of [-0.55, 0, 0.55]) s.set(x + dir * (r - 0.5), y + k * r, WHITE);
  });
}

/** an armour plate seen face on, its top edge lit; a broken one shows a crack */
export function plate(s: S, x: number, y: number, w: number, h: number, broken = false): void {
  fill(s, () => {
    s.poly(
      [
        [x, y],
        [x + w, y],
        [x + w - 1, y + h],
        [x + 1, y + h],
      ],
      HC.steel,
    );
    seg(s, x + 1, y, x + w - 1, y, HC.steelGlint);
    seg(s, x + 2, y + h, x + w - 2, y + h, HC.steelDark);
  });
  if (!broken) return;
  fill(s, () => {
    seg(s, x + w * 0.5, y, x + w * 0.35, y + h * 0.5, HC.steelDeep);
    seg(s, x + w * 0.35, y + h * 0.5, x + w * 0.6, y + h, HC.steelDeep);
  });
}

/** a foe's body, curled, for throws */
export function body(s: S, x: number, y: number, r = 3.2): void {
  fill(s, () => s.dot(x, y, r, RUST[2]));
  fill(s, () => {
    s.set(x - 1, y - r + 1, RUST[4]);
    s.set(x + r * 0.4, y - r * 0.2, RUST[6]);
  });
}

/** a cracked floor along row y from x0 to x1, its seam lit in two colours */
export function crack(s: S, y: number, c: Color, light: Color, x0 = 0, x1 = 15): void {
  fill(s, () => {
    for (let x = x0; x <= x1; x++) s.set(x, y + (x % 3 === 0 ? 1 : 0), x % 2 ? c : light);
  });
}

/** a round shield seen face on, rim in `rim`, a boss in the middle */
export function shield(s: S, x: number, y: number, r: number, rim: Color): void {
  fill(s, () => {
    s.dot(x, y, r, rim);
    s.dot(x, y, r - 1, HC.steel);
  });
  fill(s, () => {
    s.dot(x, y, 0.9, HC.steelLight);
    s.set(x - r * 0.4, y - r * 0.4, WHITE);
  });
}

/** small flecks flung out round a point */
export function shards(s: S, x: number, y: number, r: number, c: Color): void {
  fill(s, () => {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + 0.4;
      const k = i % 2 ? r : r * 0.65;
      s.stroke(x + Math.cos(a) * k * 0.5, y + Math.sin(a) * k * 0.5, x + Math.cos(a) * k, y + Math.sin(a) * k, 0.45, c);
    }
  });
}

/** a spirit bear's head: round ears, a snout and two eyes */
export function bear(s: S, x: number, y: number, c: Color, eye: Color = RUST[2]): void {
  fill(s, () => {
    s.dot(x - 2.6, y - 3, 1.4, c);
    s.dot(x + 2.6, y - 3, 1.4, c);
    s.dot(x, y, 3.6, c);
  });
  fill(s, () => {
    s.dot(x, y + 1.6, 1.4, RUST[6]);
    s.set(x, y + 1, RUST[1]);
    s.set(x - 1.4, y - 1, eye);
    s.set(x + 1.4, y - 1, eye);
  });
}

/** a chain of links from (x0, y0) to (x1, y1), every other link lit */
export function chainLinks(s: S, x0: number, y0: number, x1: number, y1: number): void {
  const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / 1.5));
  fill(s, () => {
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      s.set(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, i % 2 ? HC.steelDark : HC.steelLight);
    }
  });
}
