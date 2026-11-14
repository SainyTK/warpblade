import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Vec } from "../../../../types/rig";
import { lerp } from "../../../../utils/math";

const along = (a: Vec, b: Vec, u: number): Vec => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/**
 * A fitted white sleeve with a rose turned-back cuff and a white glove. The arm behind the body is a shade darker.
 */
export function drawCeriseArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.15, sleeve);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 0.95, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  const [c0, c1] = [along(elbow, hand, 0.55), along(elbow, hand, 0.78)];
  const cuff = front ? HC.scarf : HC.scarfDark;
  s.begin();
  s.stroke(c0[0], c0[1], c1[0], c1[1], 1.15, cuff);
  s.shadeEdges(cuff, front ? HC.scarfLight : HC.scarf, HC.scarfDark);
  s.commit();
  const glove = front ? HC.glove : HC.coatDark;
  s.begin();
  s.dot(hand[0], hand[1], 1.05, glove);
  s.shadeEdges(glove, front ? HC.gloveLight : HC.coat, HC.coatDeep);
  s.commit();
}
