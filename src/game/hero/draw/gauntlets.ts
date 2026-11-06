import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "./reach";

/**
 * An iron-banded gauntlet over the fist: a wrapped wrist, a bulky steel fist lit from the top left, and a row of
 * knuckle studs on its striking face. The arm behind the body wears it a shade darker.
 */
export function drawGauntlet(s: SpriteCanvas, elbow: Vec, hand: Vec, front: boolean): void {
  const dx = hand[0] - elbow[0];
  const dy = hand[1] - elbow[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const at = (d: number, w: number): Vec => [hand[0] + ux * d - uy * w, hand[1] + uy * d + ux * w];
  const [w0, w1] = [at(-1.8, 0), at(-0.4, 0)];
  s.begin();
  s.stroke(w0[0], w0[1], w1[0], w1[1], 1.05, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.trimDark);
  s.commit();
  const iron = front ? HC.steel : HC.steelDark;
  const fist = at(0.7, 0);
  s.begin();
  s.dot(fist[0], fist[1], 1.75, iron);
  s.shadeEdges(iron, front ? HC.steelLight : HC.steel, HC.steelDeep, 2);
  s.commit();
  s.begin();
  for (const w of [-1, 0, 1]) {
    const stud = at(2, w);
    s.set(stud[0], stud[1], front ? HC.steelGlint : HC.steelLight);
  }
  const band = at(-0.2, -1.4);
  s.set(band[0], band[1], HC.trim);
  s.commit(false);
}
