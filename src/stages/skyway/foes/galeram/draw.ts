import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Ramp } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { mix, WHITE } from "../../../../utils/color";
import { SKY_FOES as C } from "../colors";
import { RAM as R } from "./colors";
import { type RamPose, ramPose } from "./pose";

const canvas = detailCanvas(64, 44, 30, 38);
const TUFTS = [
  [-10.5, -16, 2.2],
  [-6.8, -18.4, 2.8],
  [-2.4, -19, 2.4],
  [1.6, -18.6, 2.9],
  [5.6, -16.9, 2.2],
  [-12.4, -12.2, 1.9],
  [-8.8, -13.8, 2.5],
  [-4.4, -15, 2.1],
  [-0.4, -14.6, 2.7],
  [3.8, -13.6, 2.2],
  [7.6, -13, 2.4],
  [-6.4, -10.8, 1.8],
  [0.6, -10.6, 1.9],
] as const;
const NECK = { x: 8.5, y: -13 } as const;

type Pt = readonly [number, number];
type At = (x: number, y: number) => Pt;

const woolTone = (p: RamPose): Ramp => R.wool.map((c, i) => mix(c, R.stormWool[i], p.storm * 0.55)) as Ramp;

function leg(s: SpriteCanvas, hip: Pt, swing: number, lift: number, near: boolean, wool: Ramp, front: boolean): void {
  const hide = near ? R.hide[2] : R.hide[1];
  const fleece = near ? wool[2] : wool[1];
  const kx = hip[0] + swing * 1.4 + (front ? 0.6 : -0.8);
  const ky = -6.5 - lift * 0.4;
  const fx = hip[0] + swing * 2.8;
  const fy = -1.6 - lift;
  s.begin();
  s.stroke(hip[0], hip[1], kx, ky, 2, fleece);
  s.shadeEdges(fleece, near ? wool[3] : wool[2], wool[0], 2);
  s.commit();
  s.begin();
  s.stroke(kx, ky, fx, fy, 0.85, hide);
  s.shadeEdges(hide, near ? R.hide[3] : R.hide[2], R.hide[0]);
  s.commit();
  s.begin();
  s.dot(kx, ky + 0.4, 0.9, near ? R.hide[3] : R.hide[2]);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [fx - 1.2, fy - 0.6],
      [fx + 1.6, fy - 0.6],
      [fx + 1.9, fy + 1.6],
      [fx - 1.3, fy + 1.6],
    ],
    near ? R.hoof[3] : R.hoof[2],
  );
  s.shadeEdges(near ? R.hoof[3] : R.hoof[2], R.hoof[4], R.hoof[1]);
  s.commit();
}

function legs(s: SpriteCanvas, p: RamPose, near: boolean, wool: Ramp): void {
  const g = p.gait;
  const st = p.stretch * 1.6;
  if (near) {
    leg(s, [-7, -10], -g - st, Math.max(0, g) * 1.4, true, wool, false);
    leg(s, [5.5, -10], g + st, p.paw * 2.6 + Math.max(0, -g) * 1.4, true, wool, true);
    return;
  }
  leg(s, [-5, -10], g - st, Math.max(0, -g) * 1.2, false, wool, false);
  leg(s, [7.5, -10], -g + st, Math.max(0, g) * 1.2, false, wool, true);
}

function torso(s: SpriteCanvas, wool: Ramp, time: number): void {
  s.begin();
  s.dot(-12.8, -15, 1.8, wool[2]);
  s.dot(-13.8, -13.4, 1.3, wool[2]);
  s.shadeEdges(wool[2], wool[3], wool[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-12, -16],
      [-6, -19.5],
      [4, -19.5],
      [9, -16],
      [10, -11],
      [7, -8.5],
      [-7, -8.5],
      [-12.5, -11],
    ],
    wool[1],
  );
  s.shadeEdges(wool[1], wool[2], wool[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [-10.5, -10.5],
      [8.5, -10.5],
      [6.5, -8],
      [-8, -8],
    ],
    wool[0],
  );
  s.commit(false);
  for (const [x, y, r] of TUFTS) {
    const bob = Math.sin(time * 2.4 + x * 0.7) * 0.15;
    s.begin();
    const low = y > -12;
    const base = low ? wool[1] : wool[2];
    s.dot(x, y + bob, r, base);
    s.shadeEdges(base, low ? wool[2] : wool[3], wool[0], 2);
    s.commit();
    if (low) continue;
    s.begin();
    s.hairline(x - r * 0.7, y + bob - r * 0.2, x - r * 0.2, y + bob - r * 0.75, wool[4]);
    s.set(x + r * 0.2, y + bob - r * 0.8, wool[3]);
    s.commit(false);
  }
}

function headFrame(p: RamPose): At {
  const tilt = p.head * 0.55;
  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);
  const ox = NECK.x + p.daze * 0.8 + p.head * 1.5;
  const oy = NECK.y + p.head * 2.5;
  return (x, y) => [ox + x * cos - y * sin, oy + x * sin + y * cos];
}

function neck(s: SpriteCanvas, at: At, wool: Ramp): void {
  const [hx, hy] = at(2.5, -2.5);
  s.begin();
  s.taper(5.5, -14, hx, hy, 3.6, 2.8, wool[1], 0);
  s.shadeEdges(wool[1], wool[2], wool[0], 2);
  s.commit();
  s.begin();
  for (const [u, v] of [
    [0.5, -4.2],
    [-1, -1.5],
    [1.5, 0.5],
  ] as const) {
    const [x, y] = at(u, v);
    s.dot(x, y, 1.7, wool[2]);
  }
  s.shadeEdges(wool[2], wool[3], wool[1]);
  s.commit();
}

function head(s: SpriteCanvas, at: At, p: RamPose): void {
  s.begin();
  s.poly(
    [at(1.5, -5.5), at(5.5, -5.8), at(9.5, -3.2), at(10.2, -1), at(8.6, 0.6), at(4.5, 0.6), at(1.8, -1.2)],
    R.hide[2],
  );
  s.shadeEdges(R.hide[2], R.hide[3], R.hide[0], 2);
  s.commit();
  s.begin();
  const [m0, m1] = at(7.2, -3.6);
  const [m2, m3] = at(9.6, -2.4);
  s.hairline(m0, m1, m2, m3, R.hide[4]);
  const [n0, n1] = at(9.4, -1.6);
  s.set(n0, n1, R.hide[0]);
  const [l0, l1] = at(7.6, -0.2);
  const [l2, l3] = at(9.4, -0.4);
  s.hairline(l0, l1, l2, l3, R.hide[0]);
  s.commit();
  s.begin();
  s.poly([at(2.8, -3.2), at(-0.6, -1.4), at(-1, 0.2), at(2.4, -1.8)], R.hide[3]);
  s.shadeEdges(R.hide[3], R.hide[4], R.hide[1]);
  const [ix, iy] = at(1.2, -1.4);
  s.set(ix, iy, R.hide[1]);
  s.commit();
  s.begin();
  const [ex, ey] = at(5.6, -3.8);
  const hot = p.storm > 0.5;
  s.block(ex - 1, ey - 0.8, C.outline, 2.4, 1.8);
  s.block(ex - 0.5, ey - 0.4, hot ? R.eyeHot : R.eye, 1.4, 1);
  s.set(ex + 0.9, ey - 0.3, hot ? R.volt[4] : R.volt[3]);
  s.commit(false);
}

function horn(s: SpriteCanvas, at: At): void {
  const path: Pt[] = [
    at(3.6, -5.6),
    at(1, -7.4),
    at(-1.8, -6.4),
    at(-2.8, -3.4),
    at(-1.4, -0.6),
    at(1.2, 0.4),
    at(2.6, -0.8),
  ];
  s.begin();
  for (let i = 1; i < path.length; i++) {
    const r = 1.9 - i * 0.2;
    s.stroke(path[i - 1][0], path[i - 1][1], path[i][0], path[i][1], r, R.horn[2]);
  }
  s.shadeEdges(R.horn[2], R.horn[3], R.horn[0], 2);
  for (let i = 1; i < path.length - 1; i++) {
    const [x, y] = path[i];
    s.set(x + 0.4, y + 0.3, R.horn[1]);
  }
  const [hx, hy] = at(0.6, -7.4);
  s.set(hx, hy, R.horn[4]);
  const [kx, ky] = at(-2.6, -4.4);
  s.set(kx, ky, R.horn[4]);
  s.commit();
  s.begin();
  const [tx, ty] = path[path.length - 1];
  s.dot(tx, ty, 0.9, R.horn[4]);
  s.commit(false);
}

function crackle(s: SpriteCanvas, p: RamPose): void {
  if (p.storm < 0.3) return;
  s.begin();
  s.hairline(-7, -12, -4.5, -15, R.volt[3]);
  s.hairline(-4.5, -15, -2, -12.5, R.volt[4]);
  s.hairline(2, -13, 4, -16, R.volt[3]);
  s.set(-4.5, -15, WHITE);
  s.commit(false);
}

export function drawGaleram(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = ramPose(e, time);
  const wool = woolTone(p);
  const at = headFrame(p);
  const bob = p.gait ? Math.abs(p.gait) * 0.6 : 0;
  s.clear();
  s.shift(p.lean, -bob);
  legs(s, p, false, wool);
  torso(s, wool, time);
  crackle(s, p);
  legs(s, p, true, wool);
  neck(s, at, wool);
  head(s, at, p);
  horn(s, at);
  s.shift(0, 0);
  s.outline(C.outline);
  return s;
}
