import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";
import { lerp } from "../../../utils/math";

const along = (a: Vec, b: Vec, u: number): Vec => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/** the sword arm: bare from the shoulder, ash wraps from below the elbow over the wrist and the hand */
function bareArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const skin = front ? HC.skin : HC.skinShade;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.05, skin);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 0.95, skin);
  s.shadeEdges(skin, front ? HC.skinLight : HC.skin, front ? HC.skinShade : HC.skinDeep);
  s.commit();
  const wrap = front ? HC.glove : HC.hilt;
  s.begin();
  const [w0, w1] = [along(elbow, hand, 0.2), hand];
  s.stroke(w0[0], w0[1], w1[0], w1[1], 1.05, wrap);
  s.shadeEdges(wrap, front ? HC.gloveLight : HC.glove, front ? HC.trimDark : HC.outline);
  s.commit();
  if (!front) return;
  // the turns of the wrap: thin dark bands across the forearm
  s.begin();
  for (const u of [0.35, 0.6, 0.85]) {
    const p = along(elbow, hand, u);
    s.set(p[0], p[1], HC.trimDark);
  }
  s.commit(false);
  // a band of ash cloth tied round the upper arm
  const band = along(shoulder, elbow, 0.55);
  s.begin();
  s.dot(band[0], band[1], 0.85, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.trimDark);
  s.commit();
}

/** the far arm: a long plum sleeve whose cuff flares past the wrist, under a single silver-edged pauldron */
function sleevedArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.3, sleeve);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 1.2, sleeve);
  // the cuff hangs open below the wrist
  const cuff = along(elbow, hand, 0.8);
  s.stroke(cuff[0], cuff[1], cuff[0] - 0.4, cuff[1] + 2, 1.1, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 1, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.trimDark);
  s.commit();
  s.begin();
  s.dot(shoulder[0], shoulder[1] - 0.2, 1.55, front ? HC.steel : HC.steelDark);
  s.shadeEdges(front ? HC.steel : HC.steelDark, front ? HC.steelLight : HC.steel, HC.steelDeep, 2);
  s.commit();
  s.begin();
  s.stroke(shoulder[0] - 1.5, shoulder[1] + 0.9, shoulder[0] + 1.5, shoulder[1] + 0.9, 0.3, HC.trim);
  s.commit(false);
}

/** Vesper's arms: the sword arm bare with wraps, the far arm in a long sleeve */
export function drawVesperArm(
  s: SpriteCanvas,
  shoulder: Vec,
  elbow: Vec,
  hand: Vec,
  front: boolean,
  rig: RigFrame,
): void {
  if (hand === rig.nearHand) bareArm(s, shoulder, elbow, hand, front);
  else sleevedArm(s, shoulder, elbow, hand, front);
}
