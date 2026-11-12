import { BODY } from "../../../constants/hero";
import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { lerp } from "../../../utils/math";
import { skin } from "../skin";
import { drawChainCoil } from "./chainCoil";
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
  if (skin.bareArms) return drawBareArm(s, shoulder, elbow, hand, front);
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

/**
 * A bare arm for a hero in a sleeveless vest: skin from the shoulder down, lit in front and a shade darker behind, a
 * wrapped wrist, and a bare fist. The far forearm of a chain fighter carries the chain's coils.
 */
function drawBareArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const flesh = front ? HC.skin : HC.skinShade;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.15, flesh);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 1.0, flesh);
  s.shadeEdges(flesh, front ? HC.skinLight : HC.skin, front ? HC.skinShade : HC.skinDeep);
  s.commit();
  if (skin.bareChest) drawBracer(s, elbow, hand, front);
  else {
    const [w0, w1] = [along(elbow, hand, 0.62), along(elbow, hand, 0.9)];
    const wrap = front ? HC.glove : HC.trimDark;
    s.begin();
    s.stroke(w0[0], w0[1], w1[0], w1[1], 1.1, wrap);
    s.shadeEdges(wrap, front ? HC.gloveLight : HC.glove, HC.hilt);
    s.commit();
  }
  if (skin.weapon === "chain" && !front) drawChainCoil(s, elbow, hand);
  s.begin();
  s.dot(hand[0], hand[1], 1.1, flesh);
  s.shadeEdges(flesh, front ? HC.skinLight : HC.skin, HC.skinDeep);
  s.commit();
}

/** an iron bracer over the forearm, bound in the middle with a cord in the scarf colours */
function drawBracer(s: SpriteCanvas, elbow: Vec, hand: Vec, front: boolean): void {
  const [b0, b1] = [along(elbow, hand, 0.4), along(elbow, hand, 0.88)];
  const plate = front ? HC.steel : HC.steelDark;
  s.begin();
  s.stroke(b0[0], b0[1], b1[0], b1[1], 1.15, plate);
  s.shadeEdges(plate, front ? HC.steelLight : HC.steel, HC.steelDeep);
  s.commit();
  const cord = along(elbow, hand, 0.64);
  s.begin();
  s.set(cord[0], cord[1], front ? HC.scarf : HC.scarfDark);
  s.commit(false);
}
