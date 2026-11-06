import { HULDA_SKIN, RUST } from "../../../../constants/characters/hulda/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/** Small drawing parts for Hulda's 16 x 16 icons: gauntlet fists, plates and a held body. */
type S = SpriteCanvas;
export const HC = HULDA_SKIN.colors;

/** an iron gauntlet's fist, knuckles to the right, centred at (x, y), r across */
export function fist(s: S, x: number, y: number, r = 2.6): void {
  fill(s, () => {
    seg(s, x - r - 2, y, x - r, y, HC.glove);
    s.set(x - r - 2, y - 1, HC.gloveLight);
  });
  fill(s, () => {
    s.dot(x, y, r, HC.steel);
    s.set(x - 1, y - r + 1, HC.steelLight);
  });
  fill(s, () => {
    for (let i = -1; i <= 1; i++) s.set(x + r, y + i * Math.max(1, r * 0.5), WHITE);
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
  });
  if (!broken) return;
  fill(s, () => {
    seg(s, x + w * 0.5, y, x + w * 0.35, y + h * 0.5, HC.steelDeep);
    seg(s, x + w * 0.35, y + h * 0.5, x + w * 0.6, y + h, HC.steelDeep);
  });
}

/** a small foe body, curled, for throws */
export function body(s: S, x: number, y: number, r = 2.5): void {
  fill(s, () => s.dot(x, y, r, RUST[2]));
  fill(s, () => s.set(x + 1, y - 1, RUST[5]));
}
