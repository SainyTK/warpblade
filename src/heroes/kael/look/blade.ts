import { HERO_COLORS as HC } from "../../../constants/palette";
import { drawFitting, heldAxis } from "../../../rig";
import type { Color } from "../../../types/color";
import type { BladeLook } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the crystal longsword, from the hand to the tip in pixels */
const REACH = 19;
/** where the blade leaves the guard, along the sword from the hand */
const BLADE_BASE = 3;

/**
 * Kael's crystal longsword: a pommel crystal, a wrapped grip, a guard whose wings sweep toward the blade around the warp
 * crystal, then a broad blade with a lit edge, a dark fuller and a clipped white point.
 */
export const KAEL_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle);
    const L = REACH;
    s.begin();
    s.poly(
      [at(BLADE_BASE, -1.3), at(BLADE_BASE, 1.4), at(L - 3.4, 1.1), at(L, 0), at(L - 2.4, -1.05), at(L - 4, -1)],
      HC.blade,
    );
    s.commit();
    s.begin();
    const line = (d0: number, w0: number, d1: number, w1: number, c: Color) => {
      const [a, b] = [at(d0, w0), at(d1, w1)];
      s.hairline(a[0], a[1], b[0], b[1], c);
    };
    line(BLADE_BASE + 0.2, 0.95, L - 3.4, 0.75, HC.bladeEdge);
    line(L - 3.4, 0.75, L - 0.6, 0.1, HC.bladeEdge);
    line(BLADE_BASE + 0.2, -0.85, BLADE_BASE + 2, -0.85, HC.bladeDeep);
    line(BLADE_BASE + 2, -0.85, L - 4, -0.75, HC.bladeBack);
    line(BLADE_BASE + 1.4, 0, L - 5, 0, HC.bladeBack);
    line(BLADE_BASE + 0.4, 0.35, BLADE_BASE + 1.6, 0.35, WHITE);
    const tip = at(L - 0.7, 0);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    drawFitting(s, () => {
      s.poly(
        [
          at(0.9, -1.1),
          at(1.4, -3.5),
          at(2.9, -3.3),
          at(2.3, -1.4),
          at(2.3, 1.4),
          at(2.9, 3.3),
          at(1.4, 3.5),
          at(0.9, 1.1),
        ],
        HC.trim,
      );
    });
    s.begin();
    s.poly([at(0.7, 0), at(1.8, -1.05), at(3.1, 0), at(1.8, 1.05)], HC.blade);
    s.shadeEdges(HC.blade, HC.bladeEdge, HC.bladeBack);
    const glint = at(1.6, -0.35);
    s.set(glint[0], glint[1], WHITE);
    s.commit();
    s.begin();
    const [h0, h1] = [at(-2.4, 0), at(0.8, 0)];
    s.stroke(h0[0], h0[1], h1[0], h1[1], 0.6, HC.hilt);
    s.commit();
    s.begin();
    for (const d of [-1.6, -0.4]) {
      const [w0, w1] = [at(d, -0.6), at(d + 0.5, 0.6)];
      s.hairline(w0[0], w0[1], w1[0], w1[1], HC.trimDark);
    }
    s.commit(false);
    drawFitting(s, () => {
      const pommel = at(-3.1, 0);
      s.dot(pommel[0], pommel[1], 0.9, HC.trim);
    });
    s.begin();
    const gem = at(-3.1, 0);
    s.dot(gem[0], gem[1], 0.4, HC.blade);
    s.set(gem[0] - 0.25, gem[1] - 0.25, HC.bladeEdge);
    s.commit(false);
  },
};
