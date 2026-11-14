import { HERO_COLORS as HC } from "../../../constants/palette";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the crystal longsword, from the hand to the tip in pixels */
const REACH = 17;

/** Kael's crystal longsword: pommel, wrapped grip, guard, then a tapered blade with a lit edge, a dark back and a white tip */
export const KAEL_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle);
    const L = REACH;
    s.begin();
    s.poly([at(2.4, -0.9), at(2.4, 1.1), at(L - 2.2, 0.9), at(L, 0), at(L - 2.2, -0.8)], HC.blade);
    s.commit();
    s.begin();
    for (let d = 2.6; d < L - 1; d += 0.25) {
      const edge = at(d, 0.8 - Math.max(0, d - (L - 2.6)) * 0.4);
      const back = at(d, -0.6);
      s.set(edge[0], edge[1], HC.bladeEdge);
      s.set(back[0], back[1], d < 4.5 ? HC.bladeDeep : HC.bladeBack);
    }
    const tip = at(L - 0.8, 0);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    drawFitting(s, () => {
      const [g0, g1] = [at(1.7, -2.7), at(1.7, 2.7)];
      s.stroke(g0[0], g0[1], g1[0], g1[1], 0.65, HC.trim);
    });
    s.begin();
    const [h0, h1] = [at(-2.4, 0), at(1, 0)];
    s.stroke(h0[0], h0[1], h1[0], h1[1], 0.6, HC.hilt);
    s.commit();
    drawFitting(s, () => {
      const pommel = at(-3, 0);
      s.dot(pommel[0], pommel[1], 0.85, HC.trim);
    });
  },
};
