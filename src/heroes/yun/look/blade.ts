import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { drawFitting, heldAxis } from "../../../rig";
import type { BladeLook, Vec } from "../../../types/rig";
import { WHITE } from "../../../utils/color";
import { TASSEL } from "../constants/tassel";

/** the jian from the hand to its point, in pixels: long and straight */
const REACH = 19;
/** where the pommel sits behind the hand, and the tassel's three lengths from it: the cord, the tuft, its tail */
const POMMEL = TASSEL.pommel;
const LENGTHS = [2.4, 3.2, 2.6] as const;
/** how much more each lower piece of the tassel swings than the one above it */
const TASSEL_LAG = [1, 1.5, 1.9] as const;

/**
 * The tassel from the pommel, hanging under its own weight: `swing` (the pose's `bs`, radians) turns it from straight
 * down toward the back, each piece further than the one above it, so it trails as the sword moves
 */
function drawTassel(s: SpriteCanvas, pommel: Vec, swing: number): void {
  const points: Vec[] = [pommel];
  for (let i = 0; i < LENGTHS.length; i++) {
    const [x, y] = points[i];
    const a = swing * TASSEL_LAG[i];
    points.push([x - Math.sin(a) * LENGTHS[i], y + Math.cos(a) * LENGTHS[i]]);
  }
  s.begin();
  s.stroke(points[0][0], points[0][1], points[1][0], points[1][1], 0.3, HC.trimDark);
  s.commit(false);
  s.begin();
  s.taper(points[1][0], points[1][1], points[2][0], points[2][1], 0.55, 0.85, HC.scarf);
  s.taper(points[2][0], points[2][1], points[3][0], points[3][1], 0.85, 0.35, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  drawFitting(s, () => s.dot(points[1][0], points[1][1], 0.55, HC.trim));
}

/**
 * Yun's jian: a round pommel with its jade tassel, a cord-wrapped grip, a small winged guard set with the jade warp
 * crystal, then a long straight double-edged blade with a raised ridge down its middle and a short point
 */
export const YUN_BLADE: BladeLook = {
  reach: REACH,
  draw(s, hand, angle, state) {
    const at = heldAxis(hand, angle);
    const L = REACH;
    drawTassel(s, at(-POMMEL, 0), state);
    s.begin();
    s.poly([at(1.6, -0.75), at(1.6, 0.75), at(L - 1.8, 0.7), at(L, 0), at(L - 1.8, -0.7)], HC.blade);
    s.commit();
    s.begin();
    for (let d = 1.8; d < L - 0.6; d += 0.25) {
      const taper = Math.max(0, d - (L - 1.8)) * 0.38;
      const edge = at(d, 0.62 - taper);
      const back = at(d, -0.62 + taper);
      const ridge = at(d, 0);
      s.set(edge[0], edge[1], HC.bladeEdge);
      s.set(back[0], back[1], d < 3.5 ? HC.bladeDeep : HC.bladeBack);
      if (d < L - 2.5) s.set(ridge[0], ridge[1], d < 3.2 ? HC.bladeBack : HC.bladeEdge);
    }
    const tip = at(L - 0.6, 0);
    s.set(tip[0], tip[1], WHITE);
    s.commit(false);
    drawFitting(s, () => {
      const [g0, g1] = [at(1.4, -2.2), at(1.4, 2.2)];
      s.stroke(g0[0], g0[1], g1[0], g1[1], 0.5, HC.trim);
      const [w0, w1] = [at(0.6, -2.4), at(0.6, 2.4)];
      s.set(w0[0], w0[1], HC.trimDark);
      s.set(w1[0], w1[1], HC.trimDark);
    });
    s.begin();
    const crystal = at(1.4, 0);
    s.dot(crystal[0], crystal[1], 0.6, HC.scarfLight);
    s.set(crystal[0] - 0.3, crystal[1] - 0.3, WHITE);
    s.commit(false);
    s.begin();
    const [h0, h1] = [at(-POMMEL + 0.8, 0), at(0.9, 0)];
    s.stroke(h0[0], h0[1], h1[0], h1[1], 0.55, HC.hilt);
    for (let d = -2.4; d < 0.6; d += 1) {
      const band = at(d, 0);
      s.set(band[0], band[1], HC.scarfDark);
    }
    s.commit();
    drawFitting(s, () => {
      const pommel = at(-POMMEL, 0);
      s.dot(pommel[0], pommel[1], 0.75, HC.trim);
    });
  },
};
