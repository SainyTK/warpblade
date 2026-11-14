import { HERO_COLORS as HC } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import type { RigFrame, Vec } from "../../../types/rig";
import { atChest, atHip, atNeck } from "../../../utils/poseFrame";

/** pixels the robe's skirt hangs below the hip at the back, and at the front where it parts over the trousers */
const SKIRT = { back: 6.2, front: 4.4 } as const;

/**
 * The short robe from neck to hip, lit from the top left: moon white, its collar crossed over the chest with the
 * indigo lining showing, and the cord sash wound twice round the waist with its knot at the front.
 */
export function drawRobe(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  s.poly(
    [atNeck(p, -3.8, 0), atNeck(p, 3.2, 0), atChest(p, 3.4), atHip(p, 3.3, 0.6), atHip(p, -3.8, 0.6), atChest(p, -3.9)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  s.begin();
  const fold: Vec[] = [atNeck(p, -1.8, 1.6), atChest(p, -2.1), atHip(p, -2.2, -1.6)];
  for (let i = 1; i < fold.length; i++) s.hairline(fold[i - 1][0], fold[i - 1][1], fold[i][0], fold[i][1], HC.coatDark);
  s.commit(false);
  if (!rig.back) {
    const cross = atChest(p, 1.2);
    s.begin();
    s.stroke(...atNeck(p, -0.6, 0.3), cross[0], cross[1], 0.45, HC.scarf);
    s.stroke(...atNeck(p, 2.7, 0.3), cross[0], cross[1], 0.45, HC.scarf);
    s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
    s.commit();
    s.begin();
    s.hairline(...atNeck(p, 0.3, 0.6), cross[0], cross[1] - 0.4, HC.skin);
    s.commit(false);
  }
  drawSash(s, rig);
}

/** the cord sash: two turns of indigo cord at the belt and a knot at the front */
function drawSash(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  s.begin();
  for (const dy of [-1.5, -0.6]) {
    const [l, r] = [atHip(p, -3.7, dy), atHip(p, 3.4, dy)];
    s.stroke(l[0], l[1], r[0], r[1], 0.5, HC.scarf);
  }
  s.shadeEdges(HC.scarf, HC.scarfLight, HC.scarfDark);
  s.commit();
  const knot = atHip(p, rig.back ? -2.6 : 2.2, -1.1);
  s.begin();
  s.dot(knot[0], knot[1], 0.75, HC.scarfLight);
  s.set(knot[0] - 0.3, knot[1] - 0.3, HC.coatLight);
  s.commit();
}

/** the robe's skirt over the trousers: short at the front where it parts, longer behind and flaring back with speed */
export function drawSkirt(s: SpriteCanvas, rig: RigFrame): void {
  const p = rig.pose;
  const fl = rig.flare;
  const at = (dx: number, dy: number) => atHip(p, dx, dy);
  s.begin();
  s.poly(
    [at(-3.9, -1.5), at(3.4, -1.5), at(3.8 + fl * 0.15, SKIRT.front), at(-4.6 - fl, SKIRT.back - fl * 0.4)],
    HC.coat,
  );
  s.shadeEdges(HC.coat, HC.coatLight, HC.coatDark, 2);
  s.commit();
  const [c, d] = [at(3.8 + fl * 0.15, SKIRT.front + 0.2), at(-4.6 - fl, SKIRT.back + 0.2 - fl * 0.4)];
  s.begin();
  s.stroke(c[0], c[1], d[0], d[1], 0.35, HC.scarfDark);
  s.commit();
  s.begin();
  const [a, b] = [at(-0.8, -0.6), at(-1.6 - fl * 0.6, SKIRT.back - 0.6 - fl * 0.3)];
  s.hairline(a[0], a[1], b[0], b[1], HC.coatDark);
  s.commit(false);
}
