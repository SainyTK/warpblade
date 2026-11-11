import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/** the fist's block from the wrist forward, as distance along the arm and half width across it */
const FIST = [
  [-0.7, 1.7],
  [1.6, 1.9],
  [2.5, 1.2],
] as const;
/** the flared cuff over the wrist, from where it starts to where it meets the fist, and its radius */
const CUFF = { from: -2.6, to: -1.1, radius: 1.45 } as const;
/** the knuckle studs sit this far along the fist, this far apart */
const STUDS = { at: 2.3, gap: 1.1 } as const;

/**
 * An iron gauntlet over the fist: a flared cuff with a bronze rim over the wrapped wrist, a heavy blocky fist lit from
 * the top left with a seam between the plates, and a row of bright knuckle studs on its striking face. The arm behind
 * the body wears it a shade darker.
 */
export function drawGauntlet(s: SpriteCanvas, elbow: Vec, hand: Vec, front: boolean): void {
  const dx = hand[0] - elbow[0];
  const dy = hand[1] - elbow[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const at = (d: number, w: number): Vec => [hand[0] + ux * d - uy * w, hand[1] + uy * d + ux * w];
  const iron = front ? HC.steel : HC.steelDark;
  const lit = front ? HC.steelLight : HC.steel;
  const [c0, c1] = [at(CUFF.from, 0), at(CUFF.to, 0)];
  s.begin();
  s.stroke(c0[0], c0[1], c1[0], c1[1], CUFF.radius, HC.steelDark);
  s.shadeEdges(HC.steelDark, iron, HC.steelDeep);
  s.commit();
  s.begin();
  const [r0, r1] = [at(CUFF.from, -CUFF.radius + 0.3), at(CUFF.from, CUFF.radius - 0.3)];
  s.hairline(r0[0], r0[1], r1[0], r1[1], front ? HC.trim : HC.trimDark);
  s.commit(false);
  s.begin();
  s.poly([...FIST.map(([d, w]) => at(d, -w)), ...FIST.map(([d, w]) => at(d, w)).reverse()], iron);
  s.shadeEdges(iron, lit, HC.steelDeep, 2);
  s.commit();
  s.begin();
  const [m0, m1] = [at(0.6, -1.2), at(0.6, 1.3)];
  s.hairline(m0[0], m0[1], m1[0], m1[1], front ? HC.steelDark : HC.steelDeep);
  for (const w of [-1, 0, 1]) {
    const stud = at(STUDS.at, w * STUDS.gap);
    s.set(stud[0], stud[1], front ? HC.steelGlint : HC.steelLight);
  }
  const glint = at(-0.1, -1.2);
  if (front) s.set(glint[0], glint[1], HC.steelGlint);
  s.commit(false);
}
