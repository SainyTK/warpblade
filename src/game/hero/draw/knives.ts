import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";
import { skin } from "../skin";
import type { Vec } from "./reach";

/**
 * A short curved knife held at this angle from the hand: a wrapped grip behind the fist with a small ring pommel, a
 * narrow guard, then a blade that swells on its edge and hooks to a point, steel lit on the edge with a dusk rose
 * glint toward the tip. The knife in the far hand is a shade darker.
 */
export function drawKnife(s: SpriteCanvas, hand: Vec, angle: number, front: boolean): void {
  const ca = Math.cos(angle);
  const sn = Math.sin(angle);
  const at = (d: number, w: number): Vec => [hand[0] + ca * d - sn * w, hand[1] + sn * d + ca * w];
  const L = skin.reach;
  const blade = front ? HC.blade : HC.bladeBack;
  const edge: Vec[] = [];
  const spine: Vec[] = [];
  for (let d = 1.6; d <= L; d += 0.5) {
    const u = (d - 1.6) / (L - 1.6);
    edge.push(at(d, 0.4 + Math.sin(Math.PI * Math.min(1, u * 1.1)) * 0.9 - u * u * 0.9));
    spine.push(at(d, -0.5 + u * u * 0.6));
  }
  s.begin();
  s.poly([...spine, ...edge.reverse()], blade);
  s.shadeEdges(blade, front ? HC.bladeEdge : HC.blade, HC.bladeDeep, 2);
  s.commit();
  s.begin();
  const glint = at(L - 2, 0.6);
  s.set(glint[0], glint[1], front ? HC.trimLight : HC.trim);
  const tip = at(L - 0.4, 0.1);
  s.set(tip[0], tip[1], front ? WHITE : HC.bladeEdge);
  s.commit(false);
  s.begin();
  const [g0, g1] = [at(1.3, -1.4), at(1.3, 1.4)];
  s.stroke(g0[0], g0[1], g1[0], g1[1], 0.45, HC.trimDark);
  s.commit();
  s.begin();
  const [h0, h1] = [at(-2, 0), at(0.9, 0)];
  s.stroke(h0[0], h0[1], h1[0], h1[1], 0.55, HC.hilt);
  s.shadeEdges(HC.hilt, HC.gloveLight, HC.outline);
  s.commit();
  s.begin();
  const ring = at(-2.6, 0);
  s.dot(ring[0], ring[1], 0.7, front ? HC.trim : HC.trimDark);
  s.commit(false);
}

/**
 * The far hand's knife follows its forearm: held in reverse grip, the blade runs back from the little finger side of
 * the fist, below and behind the wrist.
 */
export function farKnifeAngle(elbow: Vec, hand: Vec): number {
  return Math.atan2(hand[1] - elbow[1], hand[0] - elbow[0]) + Math.PI * 0.62;
}
