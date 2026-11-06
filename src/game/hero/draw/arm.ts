import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { lerp } from "../../../utils/math";
import { skin } from "../skin";
import { drawGauntlet } from "./gauntlets";
import { reach, type Vec } from "./reach";

/** where an arm from this shoulder ends up reaching for this hand, the elbow bent the usual way or flipped */
export const armReach = (shoulder: Readonly<Vec>, hand: Readonly<Vec>, flipped: boolean): [Vec, Vec] =>
  reach(shoulder[0], shoulder[1], hand[0], hand[1], BODY.upperArm, BODY.foreArm, flipped ? -1 : 1);

const along = (a: Vec, b: Vec, u: number): Vec => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/**
 * A coat sleeve, a plate bracer over the forearm and a glove, or an iron gauntlet for a hero who fights bare-handed. The arm in front is lit and wears a two-plate pauldron;
 * the arm behind the body is a shade darker.
 */
export function drawArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.25, sleeve);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 1.1, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  const [b0, b1] = [along(elbow, hand, 0.3), along(elbow, hand, 0.82)];
  const plate = front ? HC.steel : HC.steelDark;
  s.begin();
  s.stroke(b0[0], b0[1], b1[0], b1[1], 1.15, plate);
  s.shadeEdges(plate, front ? HC.steelLight : HC.steel, HC.steelDeep);
  s.commit();
  if (skin.weapon === "gauntlets") drawGauntlet(s, elbow, hand, front);
  else {
    s.begin();
    s.dot(hand[0], hand[1], 1.15, HC.glove);
    s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
    s.commit();
  }
  if (!front) return;
  s.begin();
  s.dot(shoulder[0], shoulder[1] + 1, 1.25, HC.steelDark);
  s.shadeEdges(HC.steelDark, HC.steel, HC.steelDeep);
  s.commit();
  s.begin();
  s.dot(shoulder[0], shoulder[1] - 0.2, 1.5, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark, 2);
  s.set(shoulder[0] - 0.7, shoulder[1] - 1, HC.steelGlint);
  s.commit();
}
