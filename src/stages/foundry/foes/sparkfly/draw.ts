import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type FlyPose, flyPose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(28, 24, 14, 12);
const M = FORGE.molten;
const C = FORGE.crust;
const S = FORGE.steel;

const tilt = (p: FlyPose, [x, y]: Pt): Pt => [x, y + x * p.pitch];

function wing(s: SpriteCanvas, p: FlyPose, near: boolean): void {
  const lift = p.wing * (near ? 4.2 : 3.4);
  const root = tilt(p, [near ? 0.6 : -0.2, -1.6]);
  const back = near ? -6.5 : -5;
  const shape: Pt[] = [
    root,
    [root[0] + back * 0.4, root[1] - lift - 1.2],
    [root[0] + back, root[1] - lift * 0.8 - 0.4],
    [root[0] + back * 0.8, root[1] - lift * 0.2 + 0.6],
  ];
  const skin = near ? S[3] : S[2];
  s.begin();
  s.poly(shape, skin);
  s.shadeEdges(skin, near ? S[4] : S[3], S[1]);
  s.commit();
  s.begin();
  s.hairline(root[0], root[1], shape[2][0], shape[2][1], near ? FORGE.steelGlint : S[3]);
  s.commit(false);
}

function body(s: SpriteCanvas, p: FlyPose): void {
  const glowBase = p.heat > 0.7 ? M[4] : p.heat > 0.35 ? M[3] : M[2];
  s.begin();
  const [ax, ay] = tilt(p, [-3.6, 0.2]);
  s.dot(ax, ay, 2.6, glowBase);
  s.shadeEdges(glowBase, p.heat > 0.7 ? M[5] : M[4], M[1]);
  s.commit();
  s.begin();
  s.set(ax - 0.5, ay - 0.8, p.heat > 0.5 ? WHITE : M[5]);
  const [r0x, r0y] = tilt(p, [-2.4, -1.6]);
  const [r1x, r1y] = tilt(p, [-2.4, 1.8]);
  s.hairline(r0x, r0y, r1x, r1y, C[1]);
  s.commit(false);
  s.begin();
  const [tx, ty] = tilt(p, [-0.4, 0]);
  s.dot(tx, ty, 1.8, C[2]);
  const [hx, hy] = tilt(p, [2, -0.6]);
  s.dot(hx, hy, 1.5, C[2]);
  s.shadeEdges(C[2], C[3], C[0]);
  s.commit();
  s.begin();
  s.set(hx + 0.8, hy - 0.5, p.heat > 0.5 ? WHITE : FORGE.eye);
  s.hairline(hx + 0.4, hy - 1.2, hx + 2.2, hy - 3, C[3]);
  s.hairline(hx + 1, hy - 1, hx + 3.2, hy - 2, C[2]);
  s.hairline(tx - 0.6, ty + 1.4, tx - 1.4, ty + 3, C[1]);
  s.hairline(tx + 0.6, ty + 1.4, tx + 1.2, ty + 3, C[1]);
  s.commit(false);
}

export function drawSparkfly(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = flyPose(e, t + e.seed);
  s.clear();
  wing(s, p, false);
  body(s, p);
  wing(s, p, true);
  s.outline(FORGE.outline);
  return s;
}
