import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { SKY_FOES as C } from "../colors";
import { WARDEN as K } from "./colors";
import { type WardenPose, wardenPose } from "./pose";

const canvas = detailCanvas(84, 84, 40, 74);
const B = K.bronze;

type Pt = readonly [number, number];

function leg(s: SpriteCanvas, hx: number, fx: number, near: boolean): void {
  const plate = near ? B[2] : B[1];
  s.begin();
  s.stroke(hx, -16, (hx + fx) / 2 + 0.6, -8, 2, plate);
  s.stroke((hx + fx) / 2 + 0.6, -8, fx, -2, 1.7, plate);
  s.shadeEdges(plate, near ? B[3] : B[2], B[0], 2);
  s.commit();
  s.begin();
  s.dot((hx + fx) / 2 + 1, -8.5, 1.6, near ? K.patina[2] : K.patina[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [fx - 2.2, -2.8],
      [fx + 3.4, -2.2],
      [fx + 3.8, 0],
      [fx - 2.4, 0],
    ],
    near ? K.iron[2] : K.iron[1],
  );
  s.shadeEdges(near ? K.iron[2] : K.iron[1], K.iron[3], K.iron[0]);
  s.commit();
}

function cape(s: SpriteCanvas, time: number): void {
  const w = Math.sin(time * 4) * 1.2;
  const w2 = Math.sin(time * 4 - 1) * 1.4;
  s.begin();
  s.poly(
    [
      [-3, -38],
      [-7, -34],
      [-10, -22 + w],
      [-12, -10 + w2],
      [-8.5, -11 + w2],
      [-7, -8 + w2],
      [-3, -14],
    ],
    K.cloth[1],
  );
  s.shadeEdges(K.cloth[1], K.cloth[2], K.cloth[0], 2);
  s.hairline(-6, -32, -9.5, -12 + w2, K.cloth[0]);
  s.commit();
}

function torso(s: SpriteCanvas): void {
  s.begin();
  s.poly(
    [
      [-5.5, -38],
      [5, -38.5],
      [6, -30],
      [4.6, -22],
      [-4.6, -21.5],
      [-6, -30],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[0], 2);
  for (const y of [-33, -28]) s.hairline(-5.4, y, 5.4, y - 0.3, B[1]);
  s.hairline(4, -37.5, 5.4, -30, B[4]);
  for (let y = -37; y < -22; y += 1.5)
    for (let x = -5; x < 5; x += 1.5) if (grain(x * 3 + 5, y * 3) > 0.84) s.set(x, y, K.patina[2]);
  s.commit();
  s.begin();
  s.block(-5, -23, K.iron[1], 10, 2);
  s.shadeEdges(K.iron[1], K.iron[2], K.iron[0]);
  s.commit();
  s.begin();
  s.dot(0.5, -22, 1.3, B[3]);
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-1.5, -21],
      [3, -21],
      [3.4, -10],
      [0.8, -8.5],
      [-1.8, -10],
    ],
    K.cloth[2],
  );
  s.shadeEdges(K.cloth[2], K.cloth[3], K.cloth[0]);
  s.hairline(1.4, -19, 0.2, -16, K.light[3]);
  s.hairline(0.2, -16, 1.8, -15.5, K.light[3]);
  s.hairline(1.8, -15.5, 0.6, -12, K.light[4]);
  s.commit();
}

function pauldron(s: SpriteCanvas): void {
  s.begin();
  s.dot(-2.5, -36.5, 4, B[2]);
  s.shadeEdges(B[2], B[4], B[0], 2);
  for (let k = 0; k < 3; k++) s.set(-5 + k * 2.4, -33.5, B[1]);
  s.commit();
}

function helm(s: SpriteCanvas, p: WardenPose): void {
  s.begin();
  s.poly(
    [
      [-4.2, -38],
      [-4.8, -44],
      [-3, -49],
      [1, -51],
      [4.6, -48],
      [5.6, -43],
      [5, -38.5],
    ],
    B[2],
  );
  s.poly(
    [
      [-3, -49],
      [-8.5, -51.5],
      [-4.5, -46],
    ],
    B[1],
  );
  s.shadeEdges(B[2], B[3], B[0], 2);
  s.shadeEdges(B[1], B[2], B[0]);
  s.hairline(0.5, -50.5, 0.5, -44.5, B[4]);
  s.commit();
  s.begin();
  s.block(0.5, -43.8, C.outline, 5.2, 1.4);
  const lit: Color = p.light > 0.75 ? WHITE : K.slit;
  s.set(4, -43.4, lit);
  s.set(4.6, -43.4, lit);
  s.set(5.2, -43.4, p.light > 0.75 ? K.light[3] : K.slit);
  s.commit(false);
}

function pole(s: SpriteCanvas, p: WardenPose): void {
  const [hx, hy] = p.hand;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - hx, ty - hy) || 1;
  const ux = (tx - hx) / len;
  const uy = (ty - hy) / len;
  s.begin();
  s.stroke(hx - ux * 14, hy - uy * 14, tx, ty, 0.7, K.iron[1]);
  s.shadeEdges(K.iron[1], K.iron[3], K.iron[0]);
  s.commit();
  s.begin();
  s.stroke(tx, ty, tx + ux * 1.5 + 2.4, ty + uy * 1.5, 0.6, B[3]);
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
}

function lantern(s: SpriteCanvas, p: WardenPose, time: number): Pt {
  const [tx, ty] = p.tip;
  const sway = Math.sin(time * 3) * 0.8;
  const lx = tx + 2.6 + sway * 0.4;
  const ly = ty + 6;
  s.begin();
  s.hairline(tx + 2.4, ty, lx, ly - 4.6, K.iron[2]);
  s.commit(false);
  const glass: Color = p.dim ? K.light[0] : p.light > 0.8 ? WHITE : p.light > 0.55 ? K.light[4] : K.light[3];
  s.begin();
  s.poly(
    [
      [lx - 2.8, ly - 3],
      [lx + 2.8, ly - 3],
      [lx + 3.2, ly + 3],
      [lx - 3.2, ly + 3],
    ],
    glass,
  );
  s.commit();
  s.begin();
  s.poly(
    [
      [lx, ly - 6],
      [lx + 3.8, ly - 3],
      [lx - 3.8, ly - 3],
    ],
    B[2],
  );
  s.poly(
    [
      [lx - 3.8, ly + 2.8],
      [lx + 3.8, ly + 2.8],
      [lx + 2.6, ly + 4.6],
      [lx - 2.6, ly + 4.6],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[4], B[0]);
  for (const dx of [-1.6, 0, 1.6]) s.hairline(lx + dx, ly - 2.8, lx + dx, ly + 2.8, B[1]);
  s.commit(false);
  if (!p.dim) s.set(lx - 0.8, ly - 1.6, WHITE);
  return [lx, ly];
}

function arm(s: SpriteCanvas, p: WardenPose): void {
  const [hx, hy] = p.hand;
  const ex = (2 + hx) / 2 + 1.5;
  const ey = (hy - 35) / 2 + 3;
  s.begin();
  s.stroke(2, -35, ex, ey, 1.8, B[2]);
  s.stroke(ex, ey, hx, hy, 1.6, K.iron[2]);
  s.shadeEdges(B[2], B[3], B[0]);
  s.shadeEdges(K.iron[2], K.iron[3], K.iron[0]);
  s.commit();
  s.begin();
  s.dot(hx, hy, 1.9, B[3]);
  s.shadeEdges(B[3], B[4], B[1]);
  s.commit();
}

export function drawLanternwarden(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = wardenPose(e, time);
  s.clear();
  s.shift(p.lean, 0);
  cape(s, time);
  s.shift(0, 0);
  leg(s, -2, -3 - p.stride, false);
  s.shift(p.lean, 0);
  torso(s);
  pauldron(s);
  s.shift(0, 0);
  leg(s, 2, 2 + p.stride, true);
  s.shift(p.lean, 0);
  helm(s, p);
  pole(s, p);
  lantern(s, p, time);
  arm(s, p);
  s.shift(0, 0);
  s.outline(C.outline);
  return s;
}
