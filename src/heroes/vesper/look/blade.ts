import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook, Vec } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the long blade, from the hand to the tip in pixels: the longest single-handed reach after the greatsword */
export const LONG_REACH = 20;

/** the warp crystal set in the guard: a small violet diamond with a white glint, lit from the top left */
export function drawWarpCrystal(s: SpriteCanvas, at: (d: number, w: number) => Vec, d: number, size: number): void {
  s.begin();
  s.poly([at(d - size, 0), at(d, -size * 0.8), at(d + size, 0), at(d, size * 0.8)], HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  const glint = at(d - size * 0.3, -size * 0.25);
  s.set(glint[0], glint[1], WHITE);
  s.commit();
}

/**
 * Vesper's long blade: a slender, pale single edge with a faint curve toward the point, a white lit edge and a lilac
 * back, a swept silver guard holding the violet warp crystal, a dark wrapped grip and a ring pommel.
 */
export const LONG_BLADE: BladeLook = {
  reach: LONG_REACH,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle);
    const L = LONG_REACH;
    // the curve: the blade's middle line bows toward the edge side as it nears the point
    const bow = (d: number): number => 0.35 * Math.sin((Math.PI * (d - 2.5)) / (L - 2.5));
    s.begin();
    s.poly(
      [
        at(2.6, -0.8),
        at(2.6, 0.95),
        at(L * 0.55, 0.9 + bow(L * 0.55)),
        at(L - 1.8, 0.55 + bow(L - 1.8)),
        at(L, 0.2),
        at(L - 2.4, -0.55 + bow(L - 2.4)),
        at(L * 0.55, -0.7 + bow(L * 0.55)),
      ],
      HC.blade,
    );
    s.commit();
    s.begin();
    for (let d = 2.8; d < L - 0.8; d += 0.25) {
      const taper = Math.max(0, d - (L - 3)) * 0.3;
      const edge = at(d, 0.75 + bow(d) - taper);
      const back = at(d, -0.5 + bow(d) + taper * 0.4);
      s.set(edge[0], edge[1], HC.bladeEdge);
      s.set(back[0], back[1], d < 5 ? HC.bladeDeep : HC.bladeBack);
    }
    const tip = at(L - 0.6, 0.2);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    drawFitting(s, () => {
      // a guard swept forward on the edge side and back on the other
      const [g0, g1, g2] = [at(1.4, -2.6), at(2, 0), at(3, 2.6)];
      s.stroke(g0[0], g0[1], g1[0], g1[1], 0.6, HC.trim);
      s.stroke(g1[0], g1[1], g2[0], g2[1], 0.6, HC.trim);
    });
    drawWarpCrystal(s, at, 1.9, 1.05);
    s.begin();
    const [h0, h1] = [at(-2.8, 0), at(1, 0)];
    s.stroke(h0[0], h0[1], h1[0], h1[1], 0.6, HC.hilt);
    s.commit();
    drawFitting(s, () => {
      const pommel = at(-3.5, 0);
      s.dot(pommel[0], pommel[1], 0.8, HC.trim);
    });
  },
};
