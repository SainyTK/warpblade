import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { FORGE } from "../../colors";
import { drawAnvil } from "./drawAnvil";
import { drawBellows, drawHammer, drawHelm } from "./drawGear";
import { type Pt, type SmithPose, smithPose } from "./pose";

const canvas = detailCanvas(124, 116, 64, 108);
const I = FORGE.iron;
const P = FORGE.plate;
const M = FORGE.molten;
const B = FORGE.brass;
const H = FORGE.hide;
const L = FORGE.leather;
const CORE_CRACKS: readonly Pt[] = [
  [-7, -8],
  [6, -9],
  [9, 2],
  [-8, 4],
  [1, 9],
  [-2, -10],
];

function limb(s: SpriteCanvas, a: Pt, b: Pt, r0: number, r1: number, base: Color, light: Color, dark: Color): void {
  s.begin();
  s.taper(a[0], a[1], b[0], b[1], r0, r1, base);
  s.shadeEdges(base, light, dark, 2);
  s.commit();
}

function legs(s: SpriteCanvas, p: SmithPose, c: number): void {
  for (const [hip, foot, near] of [
    [-6, -11 - p.step * 3, false],
    [6, 11 + p.step * 3, true],
  ] as const) {
    const knee: Pt = [(hip + foot) / 2 + 2, -11 + c * 0.5];
    const shade = near ? I[2] : I[1];
    limb(s, [hip, -24 + c], knee, 4.6, 4, shade, near ? I[3] : I[2], I[0]);
    limb(s, knee, [foot, -3], 4, 3.4, shade, near ? I[3] : I[2], I[0]);
    s.begin();
    s.dot(knee[0] + 1, knee[1], 2.4, near ? B[2] : B[1]);
    s.shadeEdges(near ? B[2] : B[1], B[3], B[0]);
    s.commit();
    s.begin();
    s.poly(
      [
        [foot - 5, -5],
        [foot + 5, -5],
        [foot + 8, -1.5],
        [foot + 8, 0],
        [foot - 5.5, 0],
      ],
      near ? I[2] : I[1],
    );
    s.shadeEdges(near ? I[2] : I[1], near ? I[3] : I[2], I[0]);
    s.commit();
  }
}

function core(s: SpriteCanvas, cx: number, cy: number, p: SmithPose, time: number): void {
  const pulse = Math.sin(time * 6) * 0.6;
  const open = p.cracked ? 1 : p.burst;
  s.begin();
  for (const [dx, dy] of CORE_CRACKS) s.stroke(cx, cy, cx + dx * open, cy + dy * open, 0.6, M[3]);
  s.dot(cx, cy, (2 + open * 3.5 + pulse * open) * Math.max(0.35, open), M[3]);
  s.commit(false);
  s.begin();
  s.dot(cx - 0.5, cy - 0.5, (1 + open * 2.4) * Math.max(0.4, open), M[4]);
  s.dot(cx - 1, cy - 1, 0.6 + open * 1.2, open > 0.5 ? M[5] : M[4]);
  s.commit(false);
  if (open > 0.5) s.set(cx - 1.5, cy - 1.5, WHITE);
}

function torso(s: SpriteCanvas, p: SmithPose, c: number, time: number): void {
  const x = p.lean * 0.5;
  const y = c;
  const seam = p.cracked ? M[2] : M[1];
  s.begin();
  s.poly(
    [
      [x - 13, y - 29],
      [x + 12, y - 29],
      [x + 10, y - 19],
      [x - 11, y - 19],
    ],
    L[1],
  );
  s.shadeEdges(L[1], L[2], L[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [x - 15, y - 57],
      [x + 11, y - 59],
      [x + 19, y - 50],
      [x + 18, y - 38],
      [x + 12, y - 29],
      [x - 11, y - 29],
      [x - 17, y - 38],
      [x - 18, y - 50],
    ],
    P[2],
  );
  s.shadeEdges(P[2], P[3], P[0], 2);
  s.commit();
  s.begin();
  for (let row = 0; row < 5; row++) {
    const ry = y - 52 + row * 5;
    const half = 17 - Math.abs(row - 1.5) * 1.6;
    s.hairline(x - half, ry, x + half + 1, ry, P[0]);
    s.hairline(x - half + 0.5, ry - 0.5, x + half + 0.5, ry - 0.5, seam);
    s.hairline(x - half + 0.5, ry + 0.5, x + half, ry + 0.5, P[3]);
  }
  for (let i = 0; i < 9; i++) {
    const gx = x - 13 + grain(i, 3) * 28;
    const gy = y - 54 + grain(3, i) * 22;
    s.set(gx, gy, P[4]);
  }
  s.hairline(x - 14, y - 56.5, x + 10, y - 58.5, P[4]);
  s.hairline(x + 11, y - 58.5, x + 18.5, y - 50, FORGE.ironGlint);
  s.hairline(x - 10, y - 29.5, x + 11, y - 29.5, M[1]);
  if (!p.cracked && p.burst <= 0) {
    s.hairline(x + 1, y - 46, x + 3, y - 40, M[2]);
    s.hairline(x + 3, y - 40, x + 1, y - 35, M[1]);
    s.set(x + 2, y - 42, M[3]);
  }
  s.commit(false);
  if (p.cracked || p.burst > 0) core(s, x + 2, y - 42, p, time);
  s.begin();
  s.block(x - 13, y - 30, B[1], 26, 2.2);
  s.poly(
    [
      [x - 1, y - 31.5],
      [x + 5, y - 31.5],
      [x + 4, y - 28],
      [x + 3, y - 27],
      [x + 1, y - 27],
      [x, y - 28],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[0]);
  s.commit();
  s.begin();
  s.set(x + 0.5, y - 31, FORGE.brassGlint);
  s.commit(false);
}

function flameBeard(s: SpriteCanvas, p: SmithPose, c: number, time: number): void {
  const x = 9 + p.lean;
  const y = -55 + c;
  const flick = (i: number): number => Math.sin(time * 11 + i * 1.9) * 1.2;
  s.begin();
  s.poly(
    [
      [x - 3, y],
      [x + 7, y],
      [x + 7 + flick(1) * 0.5, y + 5],
      [x + 4 + flick(2), y + 11],
      [x + 2, y + 7],
      [x - 1 + flick(3), y + 12],
      [x - 2, y + 5],
    ],
    FORGE.beard[1],
  );
  s.shadeEdges(FORGE.beard[1], FORGE.beard[2], FORGE.beard[0]);
  s.commit(false);
  s.begin();
  s.hairline(x + 1, y + 1, x + 0.5 + flick(4) * 0.5, y + 8, FORGE.beard[3]);
  s.hairline(x + 4, y + 1, x + 4 + flick(5) * 0.6, y + 7, FORGE.beard[3]);
  s.set(x + 2, y + 1, M[5]);
  s.commit(false);
}

function pauldron(s: SpriteCanvas, at: Pt, near: boolean): void {
  const [x, y] = at;
  const base = near ? P[3] : P[2];
  s.begin();
  s.poly(
    [
      [x - 7, y + 3],
      [x - 6, y - 3],
      [x - 1, y - 6],
      [x + 5, y - 5],
      [x + 8, y],
      [x + 7, y + 5],
      [x - 5, y + 6],
    ],
    base,
  );
  s.shadeEdges(base, near ? P[4] : P[3], P[0], 2);
  s.commit();
  s.begin();
  s.hairline(x - 5, y + 5.5, x + 7, y + 4.5, B[near ? 2 : 1]);
  s.hairline(x - 4, y + 1, x + 6, y, I[1]);
  s.set(x - 1, y - 5, FORGE.ironGlint);
  s.commit(false);
}

function arm(s: SpriteCanvas, shoulder: Pt, hand: Pt, near: boolean): void {
  const mid: Pt = [(shoulder[0] + hand[0]) / 2 - 2, (shoulder[1] + hand[1]) / 2 + 3];
  const skin = near ? H[2] : H[1];
  limb(s, shoulder, mid, 4.2, 3.6, skin, near ? FORGE.crust[3] : H[2], H[0]);
  limb(s, mid, hand, 3.6, 3, skin, near ? FORGE.crust[3] : H[2], H[0]);
  s.begin();
  s.hairline(shoulder[0], shoulder[1] + 2, mid[0], mid[1], near ? M[2] : M[1]);
  s.hairline(mid[0], mid[1], hand[0] - 1, hand[1] - 1, near ? M[3] : M[1]);
  s.commit(false);
  s.begin();
  s.stroke(
    mid[0] + (hand[0] - mid[0]) * 0.55,
    mid[1] + (hand[1] - mid[1]) * 0.55,
    hand[0],
    hand[1],
    3.4,
    near ? I[2] : I[1],
  );
  s.shadeEdges(near ? I[2] : I[1], I[3], I[0]);
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 3, skin);
  s.shadeEdges(skin, FORGE.crust[3], H[0]);
  s.commit();
}

function ingot(s: SpriteCanvas, at: Pt): void {
  s.begin();
  s.block(at[0] - 3, at[1] - 3, M[3], 6, 2.5);
  s.hairline(at[0] - 2.5, at[1] - 2.5, at[0] + 2.5, at[1] - 2.5, M[5]);
  s.commit(false);
}

export function drawCindersmith(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = smithPose(e, time);
  const c = p.crouch;
  const lean = p.lean;
  s.clear();
  drawAnvil(s, p, time);
  arm(s, [-12 + lean * 0.5, -51 + c], p.reach, false);
  if (p.ingot) ingot(s, p.reach);
  pauldron(s, [-13 + lean * 0.5, -54 + c], false);
  drawBellows(s, p, c);
  legs(s, p, c);
  torso(s, p, c, time);
  drawHelm(s, p, c);
  drawHammer(s, p);
  arm(s, [13 + lean * 0.5, -50 + c], p.hand, true);
  pauldron(s, [14 + lean * 0.5, -53 + c], true);
  flameBeard(s, p, c, time);
  s.outline(FORGE.outline);
  return s;
}
