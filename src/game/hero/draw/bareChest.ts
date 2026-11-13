import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { Pose } from "../../../types/pose";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";
import type { Vec } from "./reach";

/** the mantle's ragged lower edge, across the chest from front to back: [across, down from the neck] */
const MANTLE_FRONT: readonly Vec[] = [
  [3.8, 2.6],
  [2.7, 3.6],
  [1.6, 2.8],
  [0.4, 3.8],
  [-0.9, 3],
  [-2.3, 4],
  [-3.6, 3.2],
  [-4.6, 3.6],
];
/** from behind the mantle hangs lower over the back */
const MANTLE_BACK: readonly Vec[] = [
  [3.6, 4.2],
  [2.4, 5.4],
  [1.1, 4.6],
  [-0.2, 5.8],
  [-1.6, 4.8],
  [-2.9, 5.9],
  [-4.2, 4.8],
];

/** the torso's outline, as the shared torso draws it */
function torsoOutline(p: Pose): Vec[] {
  return [
    atNeck(p, -3.6, 0),
    atNeck(p, 3.1, 0),
    atChest(p, 3.1),
    atHip(p, 3.1, 0.5),
    atHip(p, -3.6, 0.5),
    atChest(p, -3.6),
  ];
}

/** the wolf-fur mantle across the shoulders: dark fur lit on top, its lower edge ragged, a few pale guard hairs */
function drawMantle(s: SpriteCanvas, p: Pose, back: boolean): void {
  const hem = back ? MANTLE_BACK : MANTLE_FRONT;
  s.begin();
  s.poly([atNeck(p, -4.6, -0.8), atNeck(p, 3.8, -0.8), ...hem.map(([x, y]) => atNeck(p, x, y))], HC.coat);
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDeep, 2);
  s.commit();
  s.begin();
  for (const [x, y] of hem.filter((_, i) => i % 2 === 0)) {
    const tip = atNeck(p, x, y - 0.6);
    s.set(tip[0], tip[1], HC.coatLight);
  }
  s.commit(false);
}

/**
 * A bare, scarred chest in the skin colours under a wolf-fur mantle, and a wide leather belt with an iron buckle. From
 * behind, the mantle falls further down the back and the spine shows below it.
 */
export function drawBareChest(s: SpriteCanvas, p: Pose, back: boolean): void {
  s.begin();
  s.poly(torsoOutline(p), HC.skin);
  s.shadeEdges(HC.skin, HC.skinLight, HC.skinShade, 2);
  s.commit();
  s.begin();
  if (back) {
    const [a, b] = [atNeck(p, -0.4, 5.5), atHip(p, -0.4, -1.8)];
    s.hairline(a[0], a[1], b[0], b[1], HC.skinShade);
  } else {
    // the line under the chest, the belly's middle, and two pale scars across them
    const [c0, c1] = [atNeck(p, -0.6, 4.6), atNeck(p, 2.9, 4.4)];
    s.hairline(c0[0], c0[1], c1[0], c1[1], HC.skinShade);
    const [m0, m1] = [atChest(p, 1.2), atHip(p, 1.1, -2)];
    s.hairline(m0[0], m0[1], m1[0], m1[1], HC.skinShade);
    const [s0, s1] = [atNeck(p, 0, 3.2), atNeck(p, 2.6, 5.6)];
    s.hairline(s0[0], s0[1], s1[0], s1[1], HC.skinLight);
    const [t0, t1] = [atChest(p, -1.6), atHip(p, 1.8, -2.6)];
    s.hairline(t0[0], t0[1], t1[0], t1[1], HC.skinLight);
  }
  s.commit(false);
  drawMantle(s, p, back);
  const [l, r] = [atHip(p, -3.4, -1), atHip(p, 3.1, -1)];
  s.begin();
  s.stroke(l[0], l[1], r[0], r[1], 0.85, HC.glove);
  s.shadeEdges(HC.glove, HC.gloveLight, HC.hilt);
  s.commit();
  const buckle = atHip(p, back ? -0.6 : 1, -1.1);
  s.begin();
  s.dot(buckle[0], buckle[1], 0.8, HC.steel);
  s.shadeEdges(HC.steel, HC.steelLight, HC.steelDark);
  s.commit();
}
