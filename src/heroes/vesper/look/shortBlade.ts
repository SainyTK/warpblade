import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { OffhandLook, Vec } from "../../../types/rig";

/** the short blade, from the hand to the tip in pixels */
export const SHORT_REACH = 10;

/** the short blade in the far hand: a dark, broad, leaf-shaped blade with a violet edge line, a small cross guard and a
 *  wrapped grip; held behind the body it is a shade darker */
function drawShortBlade(s: SpriteCanvas, hand: Vec, angle: number, front: boolean): void {
  const at = heldAxis(hand, angle);
  const L = SHORT_REACH;
  const body = front ? HC.steel : HC.steelDark;
  s.begin();
  s.poly([at(2.2, -0.9), at(2.2, 1), at(L * 0.6, 1.3), at(L, 0), at(L * 0.6, -1)], body);
  s.shadeEdges(body, front ? HC.steelLight : HC.steel, HC.steelDeep);
  s.commit();
  s.begin();
  for (let d = 2.6; d < L - 0.6; d += 0.25) {
    const swell = d < L * 0.6 ? (d / (L * 0.6)) * 0.35 : (1 - (d - L * 0.6) / (L * 0.4)) * 0.35 + 0.1;
    const edge = at(d, 0.75 + swell - 0.2);
    s.set(edge[0], edge[1], front ? HC.scarfLight : HC.scarf);
  }
  s.commit(false);
  drawFitting(s, () => {
    const [g0, g1] = [at(1.8, -1.8), at(1.8, 1.8)];
    s.stroke(g0[0], g0[1], g1[0], g1[1], 0.55, HC.trim);
  });
  s.begin();
  const [h0, h1] = [at(-1.8, 0), at(1.2, 0)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.55, HC.hilt);
  s.commit();
}

/** the short blade is always in her far hand, held at the pose's `oa` */
export const SHORT_BLADE: OffhandLook = {
  held: (s, hand, angle, front) => drawShortBlade(s, hand, angle, front),
};
