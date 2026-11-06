import { HULDA_SKIN, RUST } from "../../../../constants/characters/hulda/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/** Small drawing parts for Hulda's 16 x 16 icons: gauntlet fists, plates and a held body. */
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
