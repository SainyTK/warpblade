import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_FOES as C } from "../colors";
import { THRUST } from "./update";

const canvas = detailCanvas(84, 48, 34, 42);
const B = C.bronze;

interface GuardPose {
  lean: number;
  lance: number;
  tipDrop: number;
  shieldDrop: number;
  stride: number;
  heat: number;
}

function poseOf(e: Enemy, time: number): GuardPose {
  if (e.state === "wind") {
    const u = clamp(e.st / (THRUST.windup * waveScale(game.wave).windup));
    const tremble = u > 0.7 ? Math.sin(time * 60) * 0.3 : 0;
    return { lean: -2.8 * u + tremble, lance: -11 * u, tipDrop: -1.5 * u, shieldDrop: 0, stride: 1, heat: u };
  }
  if (e.state === "lunge") return { lean: 3, lance: 13, tipDrop: 0, shieldDrop: 1, stride: 3, heat: 1 };
  if (e.state === "recover") {
    const u = clamp(e.st / THRUST.recover);
    return { lean: lerp(2, 0.5, u), lance: lerp(10, 2, u), tipDrop: lerp(6, 2, u), shieldDrop: 5, stride: 2, heat: 0 };
  }
  const walking = Math.abs(e.vx) > 4;
  const stride = walking ? Math.sin(time * 7) * 2 : 0;
  return { lean: 0, lance: 0, tipDrop: 0, shieldDrop: 0, stride, heat: 0 };
}

function leg(s: SpriteCanvas, hx: number, fx: number, near: boolean): void {
  const plate = near ? B[3] : B[2];
  s.begin();
  s.stroke(hx, -11, (hx + fx) / 2 + 0.6, -5.5, 1.5, plate);
  s.stroke((hx + fx) / 2 + 0.6, -5.5, fx, -1.4, 1.3, plate);
  s.shadeEdges(plate, near ? B[4] : B[3], B[1], 2);
  s.set((hx + fx) / 2 + 1.2, -6, near ? WHITE : B[3]);
  s.commit();
  s.begin();
  s.poly(
    [
      [fx - 1.6, -2],
      [fx + 2.4, -1.6],
      [fx + 2.8, 0.2],
      [fx - 1.8, 0.2],
    ],
    near ? C.steel[2] : C.steel[1],
  );
  s.shadeEdges(near ? C.steel[2] : C.steel[1], C.steel[3], C.steel[0]);
  s.commit();
}

function cape(s: SpriteCanvas, time: number): void {
  const w = Math.sin(time * 6) * 1.2;
  const w2 = Math.sin(time * 6 - 1.2) * 1.4;
  s.begin();
  s.poly(
    [
      [-2.5, -22.5],
      [-6, -21],
      [-11, -17 + w],
      [-12.5, -12 + w2],
      [-10, -12.6 + w2],
      [-9.5, -10 + w2],
      [-7, -11],
      [-3, -13],
    ],
    C.crimson[2],
  );
  s.shadeEdges(C.crimson[2], C.crimson[3], C.crimson[1], 2);
  s.hairline(-4, -20, -9.5, -13 + w2, C.crimson[1]);
  s.commit();
}

function lance(s: SpriteCanvas, p: GuardPose, time: number): void {
  const grip = -1 + p.lance;
  const back = grip - 15;
  const tip = grip + 30;
  const y0 = -16.5;
  const y1 = -17.5 + p.tipDrop;
  const at = (x: number) => [x, lerp(y0, y1, (x - back) / (tip - back))] as const;
  s.begin();
  const [bx, by] = at(back);
  const [tx, ty] = at(tip - 4);
  s.stroke(bx, by, tx, ty, 0.6, C.steel[2]);
  s.shadeEdges(C.steel[2], C.steel[3], C.steel[1]);
  s.commit();
  const pw = Math.sin(time * 11) * 1.1;
  s.begin();
  const [px, py] = at(tip - 9);
  s.poly(
    [
      [px, py - 0.4],
      [px - 6, py - 1.2 + pw],
      [px - 4.5, py + 0.8 + pw * 0.6],
      [px - 6.5, py + 2.6 + pw],
      [px, py + 1.4],
    ],
    C.crimson[3],
  );
  s.shadeEdges(C.crimson[3], C.frill, C.crimson[1]);
  s.commit();
  s.begin();
  const [hx, hy] = at(tip - 5);
  s.poly(
    [
      [hx, hy - 1.3],
      [hx + 4, hy - 0.6],
      [hx + 6.5, hy + 0.1],
      [hx + 4, hy + 0.9],
      [hx, hy + 1.3],
    ],
    C.steel[3],
  );
  s.shadeEdges(C.steel[3], C.steel[4], C.steel[1]);
  s.set(hx + 6, hy, p.heat > 0.5 ? WHITE : C.steel[4]);
  if (p.heat > 0) s.set(hx + 6.5, hy - 0.5, C.volt[4]);
  s.commit();
  s.begin();
  const [vx, vy] = at(grip + 3);
  s.poly(
    [
      [vx - 1.5, vy - 2.2],
      [vx + 1.6, vy - 0.6],
      [vx + 1.6, vy + 0.6],
      [vx - 1.5, vy + 2.2],
    ],
    B[3],
  );
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
}

function torso(s: SpriteCanvas, time: number): void {
  const flap = Math.sin(time * 8) * 0.6;
  s.begin();
  s.poly(
    [
      [-4.5, -13.5],
      [4.2, -13.5],
      [5, -7.5 + flap],
      [3, -8.4],
      [1.4, -6.6 + flap],
      [-0.6, -8.2],
      [-2.6, -6.8 - flap],
      [-5, -8],
    ],
    C.crimson[2],
  );
  s.shadeEdges(C.crimson[2], C.crimson[3], C.crimson[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [-4.6, -21.6],
      [3.8, -22],
      [4.8, -17],
      [4, -13.4],
      [-4.2, -13],
      [-5, -17],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[1], 2);
  s.hairline(1.6, -21, 2.6, -14.4, B[4]);
  s.hairline(-4.2, -14.6, 4, -14.8, B[1]);
  for (let y = -21; y < -14; y += 1.5)
    for (let x = -4; x < 4; x += 1.5) {
      if (grain(x * 3, y * 3) > 0.82) s.set(x, y, C.verdigris[2]);
      else if (grain(y * 3, x * 3) > 0.9) s.set(x, y, C.verdigris[3]);
    }
  s.commit();
  s.begin();
  s.dot(-3, -21, 2.2, B[3]);
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
}

function helm(s: SpriteCanvas, p: GuardPose, time: number): void {
  const w = Math.sin(time * 9) * 0.8;
  s.begin();
  s.taper(-0.6, -31, -9.5, -29.5 + w, 1.7, 0.5, C.plume[2], -0.8);
  s.taper(-2, -30.6, -8, -27.2 + w * 0.7, 1.1, 0.4, C.plume[1], -0.4);
  s.shadeEdges(C.plume[2], C.plume[3], C.plume[1]);
  s.commit();
  s.begin();
  s.dot(0.8, -27, 3.4, B[3]);
  s.poly(
    [
      [-2.2, -26],
      [4.4, -26.4],
      [4, -23],
      [1, -22.6],
      [-2.4, -23.6],
    ],
    B[2],
  );
  s.shadeEdges(B[3], B[4], B[1], 2);
  s.shadeEdges(B[2], B[3], B[1]);
  s.hairline(-1.6, -30.2, 3.4, -30, B[4]);
  s.commit();
  s.begin();
  s.block(1.6, -27.4, C.outline, 3, 1);
  const glow = p.heat > 0.4 ? WHITE : C.visorGlow;
  s.set(3.2, -27.2, glow);
  s.set(3.7, -27.2, glow);
  if (p.heat > 0.4) s.set(4.2, -27.2, C.volt[3]);
  s.commit(false);
}

function shield(s: SpriteCanvas, p: GuardPose): void {
  const d = p.shieldDrop;
  const ox = p.lean > 2 ? 1 : 0;
  s.begin();
  s.stroke(-2.4, -20, 3 + ox, -17 + d, 1.1, B[2]);
  s.shadeEdges(B[2], B[3], B[1]);
  s.commit();
  const pts: [number, number][] = [
    [3 + ox, -24 + d],
    [9.6 + ox, -23 + d],
    [10.2 + ox, -14 + d],
    [7.4 + ox, -6.4 + d],
    [3.6 + ox, -9.6 + d],
  ];
  s.begin();
  s.poly(pts, B[3]);
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [4.2 + ox, -22.8 + d],
      [8.8 + ox, -22 + d],
      [9.2 + ox, -14.4 + d],
      [7.2 + ox, -8.2 + d],
      [4.6 + ox, -10.6 + d],
    ],
    C.verdigris[1],
  );
  s.shadeEdges(C.verdigris[1], C.verdigris[2], C.verdigris[0]);
  const bolt: [number, number][] = [
    [7.4, -21.4],
    [5.6, -17],
    [7.4, -16.4],
    [5.8, -11],
  ];
  for (let i = 1; i < bolt.length; i++) {
    s.hairline(bolt[i - 1][0] + ox, bolt[i - 1][1] + d, bolt[i][0] + ox, bolt[i][1] + d, C.volt[3]);
  }
  s.set(7.4 + ox, -21.4 + d, C.volt[4]);
  s.set(5.8 + ox, -11 + d, C.volt[4]);
  s.set(4.6 + ox, -22.4 + d, WHITE);
  s.commit();
}

export function drawSkyguard(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  s.shift(p.lean, Math.abs(p.lean) * 0.2);
  cape(s, time);
  s.shift(0, 0);
  leg(s, -1.5, -3 - p.stride, false);
  s.shift(p.lean, Math.abs(p.lean) * 0.2);
  lance(s, p, time);
  torso(s, time);
  s.shift(0, 0);
  leg(s, 1.5, 2 + p.stride, true);
  s.shift(p.lean, Math.abs(p.lean) * 0.2);
  helm(s, p, time);
  shield(s, p);
  s.shift(0, 0);
  s.outline(C.outline);
  return s;
}
