import { ENEMY_COLORS as EC } from "../../../constants/palette";
import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { mix, WHITE } from "../../../utils/color";
import { EYE_DULL, FLESH_BRIGHT, INNER_FIRE } from "./colors";
import { moonlight } from "./moonlight";
import { rigsFor } from "./rig";
import { drawCloak } from "./shepherdCloak";
import { drawCrook } from "./shepherdCrook";
import { drawLantern } from "./shepherdLantern";
import { crookOf, lanternOf, nearHandOf, type Point, type ShepherdPose, shepherdPose } from "./shepherdPose";

const canvas = detailCanvas(150, 90, 75, 82);
const rigFor = rigsFor(canvas);
const ARM = { upper: 12, fore: 12, near: [2, 0], far: [-2, 1] } as const;
const LEG = { thigh: 10, shin: 11 } as const;
const HOOD: readonly Point[] = [
  [-6, -1],
  [-4, -6.5],
  [0, -8.5],
  [3.5, -7],
  [6.5, -2.5],
  [6, 3],
  [2, 4.5],
  [-4.5, 4],
];
const FACE: readonly Point[] = [
  [1.2, -3.8],
  [5.4, -2.6],
  [5, 2.4],
  [1.6, 2.6],
];
const EYES = { open: ["hc.hc"], dull: ["dd.dd"] } as const;

function bend(from: Point, to: Point, a: number, b: number, side: number): Point {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const d = Math.max(0.01, Math.hypot(dx, dy));
  const reach = Math.min(d, a + b - 0.01);
  const along = (a * a - b * b + reach * reach) / (2 * reach);
  const h = Math.sqrt(Math.max(0, a * a - along * along));
  const ux = dx / d;
  const uy = dy / d;
  return [from[0] + ux * along - uy * h * side, from[1] + uy * along + ux * h * side];
}

export function drawShepherd(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const g = rigFor(e.face);
  const pose: ShepherdPose = shepherdPose(e, t);
  const time = t + e.seed;
  const [hx, hy] = pose.hip;
  const chest: Point = [hx + pose.lean, hy - 18];
  const head: Point = [chest[0] + 4 - pose.nod * 2, chest[1] - 6 - pose.nod * 1.5];
  const tilt = pose.nod * 0.35;
  const crook = crookOf(pose);
  const lantern = lanternOf(pose, crook);
  const nearHand = nearHandOf(pose, crook);
  const kneeling = e.state === "burrow";
  const limb = (from: Point, to: Point, side: number, a: number, b: number, r0: number, r1: number, c: Color) => {
    const joint = bend(from, to, a, b, side);
    g.taper(from[0], from[1], joint[0], joint[1], r0, (r0 + r1) / 2, c);
    g.taper(joint[0], joint[1], to[0], to[1], (r0 + r1) / 2, r1, c);
  };
  const fingers = (at: Point, c: Color) => {
    for (let j = -1; j <= 1; j++) g.taper(at[0], at[1], at[0] + 1.8, at[1] + j * 0.9 + 0.8, 0.4, 0.15, c);
  };
  s.clear();
  const farShoulder: Point = [chest[0] + ARM.far[0], chest[1] + ARM.far[1]];
  s.begin();
  limb(farShoulder, pose.farHand, 1, ARM.upper, ARM.fore, 1.1, 0.75, EC.bodyDark);
  s.shadeEdges(EC.bodyDark, EC.body, EC.bodyDeep);
  s.commit();
  s.begin();
  fingers(pose.farHand, EC.clawDeep);
  s.commit();
  for (const [foot, c, light] of [
    [pose.farFoot, EC.bodyDark, EC.body],
    [pose.nearFoot, EC.body, FLESH_BRIGHT],
  ] as const) {
    s.begin();
    limb([hx + (c === EC.body ? 1.5 : -1.5), hy + 2], foot, -1, LEG.thigh, LEG.shin, 1.3, 0.9, c);
    s.shadeEdges(c, light, EC.bodyDeep, 2);
    s.commit();
    s.begin();
    g.taper(foot[0], foot[1] - 0.2, foot[0] + 3.2, foot[1] + 0.4, 0.55, 0.2, EC.clawDark);
    g.taper(foot[0], foot[1] - 0.8, foot[0] + 2.8, foot[1] - 0.6, 0.45, 0.2, EC.clawDark);
    s.shadeEdges(EC.clawDark, EC.claw, EC.clawDeep);
    s.commit();
  }
  drawCloak(s, g, { hip: pose.hip, chest, flare: pose.flare, time });
  const hood = (p: Point): [number, number] => {
    const c = Math.cos(tilt);
    const n = Math.sin(tilt);
    return [head[0] + p[0] * c + p[1] * n, head[1] - p[0] * n + p[1] * c];
  };
  s.begin();
  for (const [x0, y0, x1, y1, r] of [
    [-1.5, -6.5, -6, -12, 0.95],
    [1.2, -7.2, -1.8, -13.4, 0.85],
  ] as const) {
    const [a, b] = hood([x0, y0]);
    const [c, d] = hood([x1, y1]);
    g.taper(a, b, c, d, r, 0.3, EC.claw, -1.2);
  }
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  s.begin();
  g.poly(HOOD.map(hood), EC.body);
  s.shadeEdges(EC.body, FLESH_BRIGHT, EC.bodyDark, 2);
  s.commit();
  s.begin();
  g.poly(FACE.map(hood), EC.bodyDeep);
  s.commit();
  s.begin();
  const hot = pose.heat > 0.5;
  const [ex, ey] = hood([2.4, -0.8]);
  g.pixels(
    kneeling ? EYES.dull : EYES.open,
    {
      h: hot ? WHITE : INNER_FIRE[3],
      c: hot ? INNER_FIRE[3] : mix(INNER_FIRE[1], INNER_FIRE[2], 0.5 + 0.5 * Math.sin(time * 3)),
      d: EYE_DULL,
    },
    ex,
    ey,
  );
  s.commit(false);
  drawCrook(s, g, crook);
  const nearShoulder: Point = [chest[0] + ARM.near[0], chest[1] + ARM.near[1]];
  s.begin();
  limb(nearShoulder, nearHand, 1, ARM.upper, ARM.fore, 1.2, 0.8, EC.body);
  s.shadeEdges(EC.body, FLESH_BRIGHT, EC.bodyDark, 2);
  s.commit();
  s.begin();
  fingers(nearHand, EC.claw);
  s.shadeEdges(EC.claw, EC.clawGlint, EC.clawDark);
  s.commit();
  drawLantern(s, g, lantern.anchor, lantern.center, 1 - pose.carried, {
    enraged: e.phase === 2 && !kneeling,
    glow: pose.glow,
  });
  moonlight(s, true);
  g.finish(EC.outline);
  return s;
}
