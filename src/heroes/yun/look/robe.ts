import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { legReach } from "../../../rig";
import type { Pose } from "../../../types/pose";
import type { RigFrame, Vec } from "../../../types/rig";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";

/** pixels the robe skirt hangs below the hip at the back, and how far its front flap reaches toward the near knee */
const SKIRT = 10.5;
const FLAP = 0.85;

/** a line down the torso from the neck, through the chest, to the hip */
function spineLine(s: SpriteCanvas, p: Pose, from: Vec, to: Vec, r: number, c: number): void {
  const points: Vec[] = [atNeck(p, from[0], from[1]), atChest(p, (from[0] + to[0]) / 2), atHip(p, to[0], to[1])];
  for (let i = 1; i < points.length; i++)
    s.stroke(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1], r, c);
}

/**
 * The upper robe: pale cloth from the shoulders to the hip, lit from the top left. From the front a crossed collar in
 * jade trim runs from the neck to the far side of the waist over an inner layer; from the back, the seam. Both ways the
 * jade sash is wound round the waist, knotted at the front.
 */
export function drawRobeTorso(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  s.poly(
    [atNeck(p, -3.7, 0), atNeck(p, 3.2, 0), atChest(p, 3.3), atHip(p, 3.3, 0.5), atHip(p, -3.7, 0.5), atChest(p, -3.8)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  if (rig.back) {
    s.begin();
    spineLine(s, p, [-0.3, 1], [-0.3, -1], 0.3, HC.coatDark);
    s.commit(false);
  } else {
    s.begin();
    spineLine(s, p, [2.4, 0.5], [-0.8, -1.6], 0.45, HC.coatLight);
    s.commit(false);
    s.begin();
    spineLine(s, p, [3, 0.3], [-1.6, -1.6], 0.42, HC.trim);
    s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
    s.commit();
    s.begin();
    spineLine(s, p, [-2.2, 1.2], [-2.6, -1.4], 0.25, HC.coatDark);
    s.commit(false);
  }
  const [l, r] = [atHip(p, -3.6, -1.2), atHip(p, 3.2, -1.2)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.85, HC.scarf);
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  if (rig.back) return;
  const knot = atHip(p, 1.6, -1.3);
  s.begin();
  s.dot(knot[0], knot[1], 0.7, HC.scarfLight);
  s.commit();
}

/**
 * The robe below the sash, behind the near leg: the long back panel to the shins, flaring back with speed, with two
 * folds and a jade hem
 */
export function drawRobeSkirt(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  const fl = rig.flare;
  s.begin();
  s.poly(
    [at(-3.7, -2), at(3.2, -2), at(3.9 + fl * 0.2, SKIRT - 1.5), at(-5.4 - fl * 1.2, SKIRT - fl * 0.5)],
    HC.coatDark,
  );
  s.shadeEdges(HC.coatDark, HC.coat, HC.coatDeep, 2);
  s.commit();
  s.begin();
  const folds: [number, number, number, number][] = [
    [-1.6, -1, -3 - fl * 0.8, SKIRT - 0.8 - fl * 0.5],
    [1.2, -1, 1.2 - fl * 0.3, SKIRT - 1.6],
  ];
  for (const [x0, y0, x1, y1] of folds) {
    const [a, b] = [at(x0, y0), at(x1, y1)];
    s.stroke(a[0], a[1], b[0], b[1], 0.3, HC.coatDeep);
  }
  s.commit(false);
  const [c, d] = [at(3.9 + fl * 0.2, SKIRT - 1.2), at(-5.4 - fl * 1.2, SKIRT + 0.2 - fl * 0.5)];
  s.begin();
  s.stroke(c[0], c[1], d[0], d[1], 0.45, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}

/** the robe's front flap over the near thigh, hanging from the sash toward the near knee so it moves with the stride */
export function drawRobeFlap(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const hip = atHip(p, 1.5, 0);
  const [knee] = legReach(hip, [p.ffx, p.ffy]);
  const top0 = atHip(p, -0.4, -1.6);
  const top1 = atHip(p, 3.4, -1.6);
  const low: Vec = [hip[0] + (knee[0] - hip[0]) * FLAP * 1.3, hip[1] + (knee[1] - hip[1]) * FLAP * 1.3];
  const hem0: Vec = [low[0] - 2.4, low[1] + 0.6];
  const hem1: Vec = [low[0] + 2.2, low[1] - 0.4];
  s.begin();
  s.poly([top0, top1, hem1, hem0], HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark);
  s.commit();
  s.begin();
  s.stroke(hem0[0], hem0[1], hem1[0], hem1[1], 0.4, HC.trim);
  s.stroke(top1[0], top1[1], hem1[0], hem1[1], 0.3, HC.trim);
  s.shadeEdges(HC.trim, HC.trimLight, HC.trimDark);
  s.commit();
}

const along = (a: Vec, b: Vec, u: number): Vec => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/**
 * A long, wide robe sleeve that opens toward the wrist, a jade cuff at its mouth and the bare hand out of it; the arm
 * behind the body is a shade darker
 */
export function drawSleeveArm(s: SpriteCanvas, shoulder: Vec, elbow: Vec, hand: Vec, front: boolean): void {
  const cloth = front ? HC.coat : HC.coatDark;
  const mouth = along(elbow, hand, 0.72);
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.3, cloth);
  s.taper(elbow[0], elbow[1], mouth[0], mouth[1] + 0.6, 1.3, 2, cloth);
  s.shadeEdges(cloth, front ? HC.coatLight : HC.coat, front ? HC.coatDark : HC.coatDeep, 2);
  s.commit();
  s.begin();
  s.stroke(mouth[0], mouth[1] - 1.1, mouth[0], mouth[1] + 1.9, 0.4, front ? HC.trim : HC.trimDark);
  s.commit();
  s.begin();
  s.stroke(mouth[0], mouth[1], hand[0], hand[1], 0.6, front ? HC.skin : HC.skinShade);
  s.dot(hand[0], hand[1], 0.95, front ? HC.skin : HC.skinShade);
  s.shadeEdges(HC.skin, HC.skinLight, HC.skinDeep);
  s.commit();
}

/** slate trousers gathered at the shin by cloth wraps, and a soft dark shoe tilted by the foot angle; the far leg in shade */
export function drawWrappedLeg(s: SpriteCanvas, hip: Vec, foot: Vec, tilt: number, far: boolean): void {
  const [knee, ankle] = legReach(hip, foot);
  const pants = far ? HC.pantsDark : HC.pants;
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 1.6, pants);
  s.stroke(knee[0], knee[1], ankle[0], ankle[1], 1.3, pants);
  s.shadeEdges(pants, far ? HC.pants : HC.pantsLight, far ? HC.outline : HC.pantsDark);
  s.commit();
  const wrap = far ? HC.glove : HC.gloveLight;
  const top = along(knee, ankle, 0.45);
  s.begin();
  s.stroke(top[0], top[1], ankle[0], ankle[1], 1.05, wrap);
  s.shadeEdges(wrap, HC.gloveLight, far ? HC.bootLight : HC.glove);
  s.commit();
  const shoe = far ? HC.bootDark : HC.boot;
  const len = 2.5;
  const [tx, ty] = [ankle[0] + Math.cos(tilt) * len, ankle[1] + 0.4 + Math.sin(tilt) * len];
  s.begin();
  s.stroke(ankle[0] - (tx - ankle[0]) * 0.25, ankle[1] + 0.4, tx, ty, 0.9, shoe);
  s.shadeEdges(shoe, far ? HC.boot : HC.bootLight, HC.bootDark);
  s.commit();
}
