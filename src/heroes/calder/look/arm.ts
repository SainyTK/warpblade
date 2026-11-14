import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "../../../types/rig";
import { lerp } from "../../../utils/math";

const along = (a: Vec, b: Vec, u: number): Vec => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/**
 * Calder's arm: a duster sleeve with a turned-back cuff, a leather bracer and a heavy work glove. The arm in front wears a
 * leather shoulder patch where the coat is worn by the sword's weight; the arm behind is a shade darker.
 */
export function drawCalderArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.3, sleeve);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 1.15, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  const [b0, b1] = [along(elbow, hand, 0.4), along(elbow, hand, 0.78)];
  const leather = front ? HC.glove : HC.bootDark;
  s.begin();
  s.stroke(b0[0], b0[1], b1[0], b1[1], 1.2, leather);
  s.shadeEdges(leather, front ? HC.gloveLight : HC.glove, HC.hilt);
  s.commit();
  s.begin();
  s.stroke(b1[0], b1[1], b1[0] + (hand[0] - b1[0]) * 0.2, b1[1] + (hand[1] - b1[1]) * 0.2, 1.05, HC.trimDark);
  s.commit(false);
  s.begin();
  s.dot(hand[0], hand[1], 1.35, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  if (!front) return;
  s.begin();
  s.dot(shoulder[0], shoulder[1] + 0.3, 1.45, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt, 2);
  s.set(shoulder[0] - 0.6, shoulder[1] - 0.7, HC.gloveLight);
  s.commit();
}
