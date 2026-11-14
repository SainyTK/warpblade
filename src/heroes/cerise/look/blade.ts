import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook, Vec } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the rapier from the hand to the point, in pixels: the longest reach in the roster on the thinnest blade */
const REACH = 22;

/** the swept guard: a cross bar, a knuckle bow curling over the hand to the pommel and a back bar, in silver */
function drawGuard(s: SpriteCanvas, at: (d: number, w: number) => Vec): void {
  drawFitting(s, () => {
    const [c0, c1] = [at(1.8, -2.8), at(1.8, 2.8)];
    s.stroke(c0[0], c0[1], c1[0], c1[1], 0.45, HC.trim);
    const bow: Vec[] = [at(1.8, 2.6), at(1, 3.3), at(-0.4, 3.5), at(-1.8, 3), at(-2.8, 1.6), at(-3, 0.4)];
    for (let i = 1; i < bow.length; i++) s.stroke(bow[i - 1][0], bow[i - 1][1], bow[i][0], bow[i][1], 0.32, HC.trim);
    const back: Vec[] = [at(1.8, -2.6), at(0.8, -3.1), at(-0.4, -2.6)];
    for (let i = 1; i < back.length; i++)
      s.stroke(back[i - 1][0], back[i - 1][1], back[i][0], back[i][1], 0.3, HC.trim);
    const pommel = at(-3.1, 0);
    s.dot(pommel[0], pommel[1], 0.75, HC.trim);
  });
}

/** the rose warp crystal where the guard's bars meet, with a white glint */
function drawCrystal(s: SpriteCanvas, at: (d: number, w: number) => Vec): void {
  const [x, y] = at(1.8, 0);
  s.begin();
  s.dot(x, y, 0.85, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  s.begin();
  s.set(x - 0.25, y - 0.25, WHITE);
  s.commit(false);
}

/**
 * Cerise's rapier: a needle blade with a white edge and a dark back that tapers to a fine point, a short dark grip, and
 * a swept silver guard round the hand with the rose crystal at its heart.
 */
export const CERISE_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle);
    const L = REACH;
    s.begin();
    s.poly([at(2.4, -0.55), at(2.4, 0.6), at(L - 3, 0.32), at(L, 0), at(L - 3, -0.3)], HC.blade);
    s.commit();
    s.begin();
    for (let d = 2.8; d < L - 0.8; d += 0.25) {
      const taper = Math.max(0, d - (L - 6)) * 0.06;
      const edge = at(d, 0.38 - taper);
      s.set(edge[0], edge[1], HC.bladeEdge);
      if (d < L - 4) {
        const back = at(d, -0.32);
        s.set(back[0], back[1], d < 5 ? HC.bladeDeep : HC.bladeBack);
      }
    }
    const tip = at(L - 0.5, 0);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    s.begin();
    const [h0, h1] = [at(-2.6, 0), at(1.2, 0)];
    s.stroke(h0[0], h0[1], h1[0], h1[1], 0.55, HC.hilt);
    s.commit();
    drawGuard(s, at);
    drawCrystal(s, at);
  },
};
