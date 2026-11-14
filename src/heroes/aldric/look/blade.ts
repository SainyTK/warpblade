import { HERO_COLORS as HC } from "../../../constants/palette";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the arming sword, from the hand to the tip in pixels */
const REACH = 19;

/**
 * Aldric's arming sword: a gold disc pommel, a leather grip, a wide cross guard whose arms sweep toward the point with a
 * warp crystal chip at its heart, and a broad straight blade with a dark fuller down its middle and a white point.
 */
export const ALDRIC_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle);
    const L = REACH;
    s.begin();
    s.poly([at(2.4, -1.35), at(2.4, 1.35), at(L - 3, 1.2), at(L, 0), at(L - 3, -1.2)], HC.blade);
    s.commit();
    s.begin();
    for (let d = 2.6; d < L - 1; d += 0.25) {
      const taper = Math.max(0, d - (L - 3.2)) * 0.45;
      const edge = at(d, 1.15 - taper);
      const back = at(d, -1.1 + taper);
      s.set(edge[0], edge[1], HC.bladeEdge);
      s.set(back[0], back[1], HC.bladeBack);
      if (d < L - 4) {
        const fuller = at(d, 0);
        s.set(fuller[0], fuller[1], d < 4 ? HC.bladeDeep : HC.bladeBack);
      }
    }
    const tip = at(L - 0.7, 0);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    drawFitting(s, () => {
      s.stroke(...at(2.2, -3.4), ...at(1.6, 0), 0.6, HC.trim);
      s.stroke(...at(1.6, 0), ...at(2.2, 3.4), 0.6, HC.trim);
    });
    s.begin();
    const gem = at(1.7, 0);
    s.set(gem[0], gem[1], HC.trimLight);
    s.set(gem[0] + 0.5, gem[1] - 0.5, WHITE);
    s.commit(false);
    s.begin();
    s.stroke(...at(-2.6, 0), ...at(1, 0), 0.6, HC.glove);
    s.commit();
    drawFitting(s, () => s.dot(...at(-3.3, 0), 0.95, HC.trim));
  },
};
