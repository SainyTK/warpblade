import { HERO_COLORS as HC } from "../../../constants/palette";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook } from "../../../types/rig";
import { WHITE } from "../../../utils/color";

/** the scimitar, from the hand to the tip in pixels */
const REACH = 19;
/** how far the blade bows back toward its spine at the tip, in pixels */
const BOW = 3.4;
/** the edge's distance from the blade's centre line at the guard and at its widest, near the tip */
const EDGE = { base: 0.9, grow: 1.4, widest: 0.8 } as const;
/** the spine's distance from the centre line */
const SPINE = 0.7;

/** where the blade's centre line runs at `d` pixels from the hand: it curves back toward the spine as it goes */
const bow = (d: number): number => -BOW * (d / REACH) ** 2;

/** the edge's distance from the centre line: widening to the last fifth, then sweeping back to a point on the spine */
function edgeWidth(d: number): number {
  const u = d / REACH;
  if (u <= EDGE.widest) return EDGE.base + EDGE.grow * (u / EDGE.widest);
  const tip = (u - EDGE.widest) / (1 - EDGE.widest);
  return (EDGE.base + EDGE.grow) * (1 - tip) - SPINE * tip;
}

/**
 * Zafir's scimitar: a broad blade curving back to a clipped point, widest near the tip, with a lit cutting edge, a dark
 * spine and a fuller; a guard whose quillons turn down, a saffron warp crystal set in it, a wrapped grip and a gold
 * pommel cap.
 */
export const ZAFIR_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle);
    const edge: [number, number][] = [];
    const spine: [number, number][] = [];
    for (let d = 2.2; d <= REACH + 0.01; d += 1) {
      edge.push(at(d, bow(d) + edgeWidth(d)));
      spine.push(at(d, bow(d) - SPINE));
    }
    s.begin();
    s.poly([...edge, ...spine.reverse()], HC.blade);
    s.commit();
    s.begin();
    for (let d = 2.4; d < REACH - 0.6; d += 0.25) {
      const lit = at(d, bow(d) + edgeWidth(d) - 0.2);
      const back = at(d, bow(d) - SPINE + 0.15);
      s.set(lit[0], lit[1], HC.bladeEdge);
      s.set(back[0], back[1], d < 5 ? HC.bladeDeep : HC.bladeBack);
      if (d > 4 && d < REACH * 0.75) {
        const fuller = at(d, bow(d) + 0.1);
        s.set(fuller[0], fuller[1], HC.bladeBack);
      }
    }
    const tip = at(REACH - 1.2, bow(REACH - 1.2) + 0.2);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    drawFitting(s, () => {
      const [g0, g1] = [at(1.6, -2.6), at(1.6, 2.6)];
      s.stroke(g0[0], g0[1], g1[0], g1[1], 0.6, HC.trim);
      const [q0, q1] = [at(2.6, -3), at(2.6, 3)];
      s.stroke(g0[0], g0[1], q0[0], q0[1], 0.45, HC.trim);
      s.stroke(g1[0], g1[1], q1[0], q1[1], 0.45, HC.trim);
    });
    s.begin();
    const gem = at(1.6, 0);
    s.dot(gem[0], gem[1], 0.75, HC.coatLight);
    s.shadeEdges(HC.coatLight, HC.trimLight, HC.coatDark);
    s.set(gem[0] - 0.4, gem[1] - 0.4, WHITE);
    s.commit();
    s.begin();
    const [h0, h1] = [at(-2.6, 0), at(1, 0)];
    s.stroke(h0[0], h0[1], h1[0], h1[1], 0.6, HC.hilt);
    s.commit();
    drawFitting(s, () => {
      const pommel = at(-3.2, 0);
      s.dot(pommel[0], pommel[1], 0.8, HC.trim);
    });
  },
};
