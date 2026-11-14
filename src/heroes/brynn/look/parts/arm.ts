import { HERO_COLORS as HC } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { RigFrame, Vec } from "../../../../types/rig";
import { lerp } from "../../../../utils/math";

const along = (a: Vec, b: Vec, u: number): Vec => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/** the sword arm: a jacket sleeve, a heavy iron gauntlet to the elbow, and a big layered pauldron with a bronze rim */
function swordArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.3, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  const plate = front ? HC.steel : HC.steelDark;
  const cuff = along(elbow, hand, 0.08);
  s.begin();
  s.taper(cuff[0], cuff[1], hand[0], hand[1], 1.55, 1.2, plate);
  s.dot(hand[0], hand[1], 1.35, plate);
  s.shadeEdges(plate, front ? HC.steelLight : HC.steel, HC.steelDeep, 2);
  s.commit();
  const [r0, r1] = [along(elbow, hand, 0.12), along(elbow, hand, 0.22)];
  s.begin();
  s.stroke(r0[0], r0[1], r1[0], r1[1], 1.2, front ? HC.trim : HC.trimDark);
  s.commit();
  if (!front) return;
  s.begin();
  s.dot(shoulder[0] - 0.3, shoulder[1] + 1.4, 1.7, HC.steelDark);
  s.shadeEdges(HC.steelDark, HC.steel, HC.steelDeep);
  s.commit();
  s.begin();
  s.dot(shoulder[0], shoulder[1] - 0.3, 2.3, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark, 2);
  s.set(shoulder[0] - 1.1, shoulder[1] - 1.6, HC.steelGlint);
  s.set(shoulder[0] - 0.6, shoulder[1] - 1.6, HC.steelGlint);
  s.commit();
  s.begin();
  s.hairline(shoulder[0] - 2.2, shoulder[1] + 0.9, shoulder[0] + 2.2, shoulder[1] + 0.9, HC.trim);
  s.set(shoulder[0] + 1.3, shoulder[1] - 0.1, HC.scarf);
  s.commit(false);
}

/** the off arm: a short sleeve, a bare forearm wrapped in cloth bands and a fingerless glove */
function offArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const sleeve = front ? HC.coat : HC.coatDark;
  const mid = along(shoulder, elbow, 0.75);
  s.begin();
  s.stroke(shoulder[0], shoulder[1], mid[0], mid[1], 1.2, sleeve);
  s.shadeEdges(sleeve, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep);
  s.commit();
  const skin = front ? HC.skin : HC.skinShade;
  s.begin();
  s.stroke(mid[0], mid[1], elbow[0], elbow[1], 0.95, skin);
  s.stroke(elbow[0], elbow[1], hand[0], hand[1], 0.95, skin);
  s.shadeEdges(skin, front ? HC.skinLight : HC.skin, HC.skinDeep);
  s.commit();
  const wrap = front ? HC.pantsLight : HC.pants;
  s.begin();
  for (const u of [0.35, 0.55, 0.75]) {
    const [a, b] = [along(elbow, hand, u - 0.07), along(elbow, hand, u + 0.07)];
    s.stroke(a[0], a[1], b[0], b[1], 1, wrap);
  }
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 1.1, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
}

/** Brynn's arms: the sword arm armoured, the off arm bare and wrapped; each is told apart by its shoulder */
export function drawBrynnArm(
  s: SpriteCanvas,
  shoulder: Vec,
  elbow: Vec,
  hand: Vec,
  front: boolean,
  rig: RigFrame,
): void {
  if (shoulder === rig.nearShoulder) swordArm(s, shoulder, elbow, hand, front);
  else offArm(s, shoulder, elbow, hand, front);
}
