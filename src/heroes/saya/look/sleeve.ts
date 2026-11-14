import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Vec } from "../../../types/rig";
import { lerp } from "../../../utils/math";

/** how far the wide sleeve hangs below the upper arm, at the elbow */
const SLEEVE_DROP = 2.6;

/**
 * One arm: the robe's wide sleeve over the upper arm, hanging open below it and swinging with the arm, an indigo wrap
 * from the elbow to the wrist, and a bare hand. The arm behind the body is a shade darker.
 */
export function drawSleeveArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const wrap = front ? HC.glove : HC.pantsDark;
  s.begin();
  s.stroke(elbow[0], elbow[1], lerp(elbow[0], hand[0], 0.8), lerp(elbow[1], hand[1], 0.8), 0.95, wrap);
  s.shadeEdges(wrap, front ? HC.gloveLight : HC.glove, HC.pantsDark);
  s.commit();
  const cloth = front ? HC.coat : HC.coatDark;
  const mouth: Vec = [lerp(shoulder[0], elbow[0], 1.15), lerp(shoulder[1], elbow[1], 1.15)];
  const hang: Vec = [mouth[0] - 0.6, mouth[1] + SLEEVE_DROP];
  s.begin();
  s.stroke(shoulder[0], shoulder[1], mouth[0], mouth[1], 1.45, cloth);
  s.poly(
    [shoulder, mouth, hang, [lerp(shoulder[0], hang[0], 0.5) - 0.4, lerp(shoulder[1], hang[1], 0.5) + 0.6]],
    cloth,
  );
  s.shadeEdges(cloth, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep, 2);
  s.commit();
  s.begin();
  s.hairline(mouth[0], mouth[1], hang[0], hang[1], front ? HC.scarf : HC.scarfDark);
  s.commit(false);
  s.begin();
  s.dot(hand[0], hand[1], 1.05, HC.skin);
  s.shadeEdges(HC.skin, HC.skinLight, HC.skinShade);
  s.commit();
}
