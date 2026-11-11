import { ENEMY_COLORS as EC } from "../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../engine/sprite";
import type { Enemy } from "../../types/enemy";
import { mix, WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { litOrb } from "./litOrb";
import { CLOAK, CLOAK_LINING, CROWN_TRIM, FLESH, FLESH_BRIGHT, HALO, INNER_FIRE } from "./night/colors";
import { moonlight } from "./night/moonlight";
import { rigsFor } from "./night/rig";
import { type Arm, wardenPose } from "./night/wardenPose";

const canvas = detailCanvas(76, 76, 38, 34);
const rigFor = rigsFor(canvas);

/** the eyes in image pixels, dark slits slanting down to the nose: "s" slit, "h" hot centre, "g" glow */
const EYES = {
  rear: ["sss.....", "shhgss..", ".sshhgss", "..ssssss"],
  front: [".....sss", "..ssghhs", "ssghhss.", "ssssss.."],
};
/** the mouth in image pixels, a grille of slits */
const MOUTH = ["m.m.m.m", "m.m.m.m"];
/** the jewel on the brow in image pixels: "t" trim, "f" fire */
const JEWEL = [".t.", "tft", ".t."];
/** the mask's outline: two brow points, cheeks narrowing to a chin */
const MASK: readonly (readonly [number, number])[] = [
  [-7, -8.5],
  [-3, -6.5],
  [1, -7.6],
  [5, -6.5],
  [9, -8.5],
  [8, -1],
  [5.5, 3.5],
  [1, 8],
  [-3.5, 3.5],
  [-6, -1],
];
/** the crack that splits the mask once it is enraged */
const MASK_CRACK: readonly (readonly [number, number])[] = [
  [5, -6.4],
  [4, -4.5],
  [5, -2.5],
  [3.6, -0.5],
  [4.2, 1.5],
];
/** the glowing rifts that split its body once it is enraged, as jagged lines */
const RIFTS: readonly (readonly [number, number])[][] = [
  [
    [-11, 2],
    [-8, 4],
    [-6, 3.5],
    [-4.5, 6],
  ],
  [
    [10, -6],
    [8, -3],
    [9, -1],
  ],
  [
    [-10, -8],
    [-8.5, -6],
    [-9.5, -4],
  ],
  [
    [7, 6],
    [9, 5],
    [10, 7.5],
  ],
];
/** the crown's horns: root, tip, root radius and bend, the tall one in the middle */
const HORNS: readonly (readonly [number, number, number, number, number, number])[] = [
  [-10, -6, -16, -15, 1.9, -1.2],
  [10, -6, 16, -15, 1.9, 1.2],
  [-6, -9, -9.5, -22, 1.8, -0.8],
  [6, -9, 9.5, -22, 1.8, 0.8],
  [0, -11, 0, -26, 2, 0],
];
/** the halo of rift light behind the crown: its center, radius, and how many arcs it is broken into */
const RING = { y: -12, r: 13.5, arcs: 7, gap: 0.3, spin: 0.5, spinEnraged: 1.4 };
/** the cloak's hem, as x at the shoulder line and x at the hem, from the far side to the near */
const HEM: readonly (readonly [number, number])[] = [
  [-13, -17],
  [-9, -11],
  [-4, -6],
  [0, -1],
  [4, 5],
  [9, 10],
  [13, 16],
];
const HEM_Y = { top: -3, long: 19, short: 14 };

/**
 * The Rift Warden, lit from the moon's side: a great shadow in a ragged cloak, crowned with five horns in front of a
 * broken halo of rift light, wearing a pale carved mask with burning eyes and a jewel on its brow. A rift burns in
 * its chest, two long arms end in fans of claws, and five tendrils trail under the cloak. Its arms rise with shadow
 * gathering in the hands before a volley, spread wide to summon, and rear up before the dive, where cloak and
 * tendrils stream behind it. Enraged, its mask cracks, rifts split its body and the halo burns white.
 */
export function drawWarden(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const g = rigFor(e.face);
  const time = t + e.seed;
  const pose = wardenPose(e, t);
  const enraged = e.phase === 2;
  const hot = enraged || pose.heat > 0.5;
  const bx = pose.shift;
  const pulse = 0.5 + 0.5 * Math.sin(time * 3.2);
  const fire = mix(INNER_FIRE[1], INNER_FIRE[3], Math.max(pose.heat, enraged ? 0.4 + 0.4 * pulse : 0.25 * pulse));
  /** how far a point this far below the body's center streams back in flight */
  const streamX = (y: number): number => -pose.ahead * y * 0.36;
  const streamY = (y: number): number => -pose.down * y * 0.28 - Math.abs(pose.ahead) * y * 0.08;
  s.clear();
  // the halo, broken into arcs that turn, closed and white hot when a blow gathers
  s.begin();
  const turn = time * (enraged ? RING.spinEnraged : RING.spin);
  const steps = Math.ceil(TAU * RING.r * s.res * 1.3);
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * TAU;
    const along = (((((a + turn) / TAU) * RING.arcs) % 1) + 1) % 1;
    if (along < RING.gap * (1 - pose.heat)) continue;
    const tone = hot ? HALO[2] : along > 0.8 ? HALO[2] : along > 0.55 ? HALO[1] : HALO[0];
    g.set(bx + Math.cos(a) * RING.r, RING.y + Math.sin(a) * RING.r, tone);
    g.set(bx + Math.cos(a) * (RING.r - 0.5), RING.y + Math.sin(a) * (RING.r - 0.5), tone);
  }
  s.commit(false);
  // the tendrils under the cloak
  s.begin();
  for (let i = 0; i < 5; i++) {
    const ox = (i - 2) * 4 + bx;
    const wave = Math.sin(time * 4 + i * 1.7);
    const r = 2.6 - Math.abs(i - 2) * 0.4;
    const long = 24 + (i % 2) * 5;
    const x1 = ox - 4 + wave * 4 + streamX(long) * 1.3;
    const y1 = long + streamY(long) * 1.3;
    g.taper(ox, 10, x1, y1, r, r * 0.5, EC.bodyDark, wave * 2);
    g.taper(ox - 0.5, 12, x1, y1 - 1.5, 0.4, 0.2, FLESH_BRIGHT, wave * 2);
    if (enraged) g.set(x1, y1, INNER_FIRE[3]);
  }
  s.shadeEdges(EC.bodyDark, EC.bodyLight, EC.bodyDeep, 2);
  s.commit(false);
  // the cloak: a ragged hem that sways, its lining showing between the folds
  s.begin();
  const hem = HEM.map(([, low], i): [number, number] => {
    const long = i % 2 ? HEM_Y.short : HEM_Y.long;
    const sway = Math.sin(time * 2.4 + i * 1.3) * 1.1;
    return [low + bx + sway + streamX(long), long + streamY(long)];
  });
  const outline: [number, number][] = [[HEM[0][0] + bx, HEM_Y.top]];
  for (const p of hem) outline.push(p);
  outline.push([HEM[HEM.length - 1][0] + bx, HEM_Y.top]);
  g.poly(outline, CLOAK[1]);
  s.shadeEdges(CLOAK[1], CLOAK[3], CLOAK[0], 2);
  for (let i = 1; i < hem.length - 1; i++) {
    const [x, y] = hem[i];
    g.hairline(HEM[i][0] + bx, 6, x, y - 1, i % 2 ? CLOAK_LINING : CLOAK[2]);
  }
  s.commit();
  // the arms behind the body
  const limb = (a: Arm, side: number) => {
    const sx = side * 11 + bx;
    const [ex, ey] = a.elbow;
    const [hx, hy] = a.hand;
    s.begin();
    g.taper(sx, -3, ex + bx, ey, 2.5, 2, EC.body, side * 0.8);
    g.taper(ex + bx, ey, hx + bx, hy, 2, 1.5, EC.body);
    s.shadeEdges(EC.body, FLESH_BRIGHT, EC.bodyDark, 2);
    s.commit();
    // a fan of four claws round the way the forearm points
    const aim = Math.atan2(hy - ey, hx - ex);
    s.begin();
    for (let j = 0; j < 4; j++) {
      const fan = aim + (j - 1.5) * 0.34 * pose.spread;
      g.taper(hx + bx, hy, hx + bx + Math.cos(fan) * 5, hy + Math.sin(fan) * 5, 0.9, 0.2, EC.claw, (j - 1.5) * 0.4);
    }
    s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
    s.commit();
    if (pose.charge <= 0) return;
    // shadow gathering over the raised hand
    s.begin();
    g.dot(hx + bx + side, hy - 3.5, 1 + pose.charge * 1.8, INNER_FIRE[1]);
    g.dot(hx + bx + side, hy - 3.5, 0.5 + pose.charge * 1.1, INNER_FIRE[3]);
    g.dot(hx + bx + side - 0.3, hy - 3.8, pose.charge * 0.6, WHITE);
    s.commit(false);
  };
  limb(pose.rear, -1);
  limb(pose.front, 1);
  // the crown: five horns rooted under the body, gold at their tips
  s.begin();
  for (const [x0, y0, x1, y1, r, bend] of HORNS) g.taper(x0 + bx, y0, x1 + bx, y1, r, 0.5, EC.claw, bend);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark, 2);
  for (const [, , x1, y1] of HORNS) g.dot(x1 + bx, y1 + 0.4, 0.55, CROWN_TRIM);
  s.commit();
  s.begin();
  litOrb(s, g.x(bx), 0, 13, FLESH);
  s.commit();
  // the rift in its chest, wide open once it is enraged
  const wide = (enraged ? 1.5 : 0.7) + pose.heat * 0.5 + pulse * 0.3;
  s.begin();
  g.poly(
    [
      [bx + 1, 8.4],
      [bx + 1 + wide + 0.6, 10.6],
      [bx + 1, 12.6],
      [bx + 1 - wide - 0.6, 10.6],
    ],
    EC.crackDeep,
  );
  g.poly(
    [
      [bx + 1, 9],
      [bx + 1 + wide, 10.6],
      [bx + 1, 12.2],
      [bx + 1 - wide, 10.6],
    ],
    fire,
  );
  g.hairline(bx + 1, 9.6, bx + 1, 11.6, INNER_FIRE[4]);
  if (enraged)
    for (const rift of RIFTS)
      for (let i = 1; i < rift.length; i++) {
        const [a, b] = rift[i - 1];
        const [c, d] = rift[i];
        g.stroke(a + bx, b, c + bx, d, 0.6, EC.crackDeep);
        g.stroke(a + bx, b, c + bx, d, 0.3, fire);
        g.set((a + c) / 2 + bx, (b + d) / 2, EC.crackHot);
      }
  s.commit(false);
  // the mask: brow points, a ridge down its middle, carved cheeks, slanted eye slits and a grille for a mouth
  s.begin();
  g.poly(
    MASK.map(([x, y]) => [x + bx, y] as const),
    EC.mask,
  );
  s.shadeEdges(EC.mask, EC.maskLight, EC.maskShade, 2);
  g.hairline(bx + 1, -5.5, bx + 1, 1.5, EC.maskShade);
  g.hairline(bx - 4.5, 0.5, bx - 2, 3, EC.maskShade);
  g.hairline(bx + 6.5, 0.5, bx + 4, 3, EC.maskShade);
  g.pixels(MOUTH, { m: EC.maskDeep }, bx - 0.5, 4);
  g.pixels(JEWEL, { t: CROWN_TRIM, f: fire }, bx + 0.5, -6.6);
  const map = { s: EC.bodyDeep, h: hot ? WHITE : EC.eyeCore, g: hot ? EC.eye : EC.eyeGlow };
  g.pixels(EYES.rear, map, bx - 4, -3.4);
  g.pixels(EYES.front, map, bx + 2, -3.4);
  // tears of fire run from the eyes while a blow gathers and once it is enraged
  if (hot) {
    g.hairline(bx - 2.5, -1.4, bx - 2.5, enraged ? 2 : 0, INNER_FIRE[2]);
    g.hairline(bx + 4.5, -1.4, bx + 4.5, enraged ? 2 : 0, INNER_FIRE[2]);
  }
  if (enraged)
    for (let i = 1; i < MASK_CRACK.length; i++) {
      const [a, b] = MASK_CRACK[i - 1];
      const [c, d] = MASK_CRACK[i];
      g.hairline(a + bx, b, c + bx, d, i % 2 ? EC.crackDeep : INNER_FIRE[2]);
    }
  s.commit();
  moonlight(s, true);
  g.finish(EC.outline);
  return s;
}
