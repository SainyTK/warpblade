import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import { lerp } from "../../../utils/math";
import { reach, type Vec } from "./reach";

/** where an arm from this shoulder ends up reaching for this hand */
export const armReach = (shoulder: Vec, hand: Vec): [Vec, Vec] =>
  reach(shoulder[0], shoulder[1], hand[0], hand[1], BODY.upperArm, BODY.foreArm, 1);

/** a sleeve from the shoulder through the elbow to a gloved hand; the cuff trim marks the arm in front */
export function drawArm(
  s: SpriteCanvas,
  shoulder: Vec,
  elbow: Vec,
  hand: Vec,
  sleeve: Color,
  glove: Color,
  cuff: boolean,
): void {
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.2, sleeve);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 1.05, sleeve);
  if (cuff) s.set(lerp(elbow[0], hand[0], 0.75), lerp(elbow[1], hand[1], 0.75), HC.trim);
  s.dot(hand[0], hand[1], 1.1, glove);
  s.commit();
}
