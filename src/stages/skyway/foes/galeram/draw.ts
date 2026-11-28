import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Ramp } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { SKY_FOES as C } from "../colors";
import { RAM as R } from "./colors";
import { type RamPose, ramPose } from "./pose";

const canvas = detailCanvas(56, 40, 28, 34);
const WOOL = [
  [-8, -12, 4.4],
  [-3, -14.5, 5],
  [3, -13.5, 5],
  [7, -11, 3.8],
  [-6, -8, 4],
  [1, -8, 4.4],
  [-10.5, -9, 2.6],
] as const;

const woolTone = (p: RamPose): Ramp => R.wool.map((c, i) => mix(c, R.stormWool[i], 0.5 + p.storm * 0.4)) as Ramp;

function leg(s: SpriteCanvas, x: number, swing: number, lift: number, near: boolean): void {
  const hide = near ? R.hide[2] : R.hide[1];
  const fx = x + swing * 2.4;
  s.begin();
  s.stroke(x, -6, x + swing * 1.2, -3, 1.2, hide);
  s.stroke(x + swing * 1.2, -3, fx, -1.4 - lift, 0.9, hide);
  s.shadeEdges(hide, near ? R.hide[3] : R.hide[2], R.hide[0]);
  s.commit();
  s.begin();
  s.block(fx - 1, -1.6 - lift, near ? R.hoof[3] : R.hoof[2], 2, 1.6);
  s.shadeEdges(near ? R.hoof[3] : R.hoof[2], R.hoof[4], R.hoof[1]);
  s.commit();
}

function legs(s: SpriteCanvas, p: RamPose, near: boolean): void {
  const g = p.gait;
  const stretch = p.stretch * 1.4;
  if (near) {
    leg(s, -6, -g - stretch, Math.max(0, g) * 1.2, true);
    leg(s, 6, g + stretch, p.paw * 2.4 + Math.max(0, -g) * 1.2, true);
    return;
  }
  leg(s, -4, g - stretch, Math.max(0, -g), false);
  leg(s, 8, -g + stretch, Math.max(0, g), false);
}

function fleece(s: SpriteCanvas, p: RamPose, wool: Ramp, time: number): void {
  s.begin();
  for (const [x, y, r] of WOOL) s.dot(x, y + Math.sin(time * 3 + x) * 0.2, r, wool[1]);
  s.dot(-12.5, -12, 1.8, wool[1]);
  s.shadeEdges(wool[1], wool[2], wool[0], 2);
  s.commit();
  s.begin();
  s.dot(-4, -16.5, 2.4, wool[2]);
  s.dot(2, -16.4, 2.6, wool[2]);
  s.dot(-9.5, -13.5, 1.6, wool[2]);
  s.shadeEdges(wool[2], wool[3], wool[2]);
  s.commit(false);
  s.set(-4.5, -18, WHITE);
  s.set(1.5, -18.4, WHITE);
  if (p.storm > 0.3) {
    s.begin();
    s.hairline(-6, -10, -3.5, -12.5, R.volt[3]);
    s.hairline(-3.5, -12.5, -1, -10.5, R.volt[4]);
    s.hairline(3, -9, 5, -12, R.volt[3]);
    s.commit(false);
  }
}

const HEAD = { x: 6, y: -13, k: 1.3 } as const;

function head(s: SpriteCanvas, p: RamPose): void {
  const at = (x: number, y: number): [number, number] => [
    HEAD.x + p.daze + (x - HEAD.x) * HEAD.k,
    HEAD.y + p.head * 0.8 + (y - HEAD.y) * HEAD.k,
  ];
  const dy = p.head * 0.25;
  s.begin();
  s.poly(
    [at(7, -16), at(12, -14 + dy), at(15, -9.5 + dy), at(13.5, -7.5 + dy), at(10, -9 + dy), at(7, -11)],
    R.hide[2],
  );
  s.shadeEdges(R.hide[2], R.hide[3], R.hide[1]);
  const [nx, ny] = at(14.6, -8.6 + dy);
  s.set(nx, ny, R.hide[0]);
  s.commit();
  s.begin();
  const [ax, ay] = at(8.5, -16.5);
  const [bx, by] = at(5.5, -16);
  const [cx, cy] = at(4.5, -12.5);
  const [dx, dz] = at(7, -10.5);
  const [ex, ey] = at(10, -11.5);
  s.stroke(ax, ay, bx, by, 1.9, R.horn[2]);
  s.stroke(bx, by, cx, cy, 1.8, R.horn[2]);
  s.stroke(cx, cy, dx, dz, 1.6, R.horn[2]);
  s.stroke(dx, dz, ex, ey, 1.3, R.horn[3]);
  s.shadeEdges(R.horn[2], R.horn[4], R.horn[1]);
  s.shadeEdges(R.horn[3], R.horn[4], R.horn[1]);
  for (let k = 0; k < 4; k++) {
    const [rx, ry] = at(6.5 - k * 0.6, -16 + k * 1.4);
    s.set(rx, ry, R.horn[1]);
  }
  s.commit();
  s.begin();
  s.dot(ex, ey, 1.4, R.horn[4]);
  s.commit(false);
  s.begin();
  const [gx, gy] = at(11.6, -12.6 + dy);
  const hot = p.storm > 0.5;
  s.block(gx - 0.5, gy - 0.5, hot ? R.eyeHot : R.eye, 1.5, 1);
  s.set(gx + 1, gy, hot ? R.volt[3] : R.volt[2]);
  s.commit(false);
}

export function drawGaleram(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = ramPose(e, time);
  const wool = woolTone(p);
  const bob = p.gait ? Math.abs(p.gait) * 0.5 : 0;
  s.clear();
  s.shift(p.lean, -bob);
  legs(s, p, false);
  fleece(s, p, wool, time);
  legs(s, p, true);
  head(s, p);
  s.shift(0, 0);
  s.outline(C.outline);
  return s;
}
