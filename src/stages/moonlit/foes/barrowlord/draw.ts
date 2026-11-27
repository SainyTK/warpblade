import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { GRAVE } from "../graveColors";
import { type LordPose, lordPose } from "./pose";

const canvas = detailCanvas(76, 64, 34, 54);
const I = GRAVE.iron;
const R = GRAVE.rust;
const C = GRAVE.cloth;
const S = GRAVE.bone;
const F = GRAVE.fire;

function legs(s: SpriteCanvas, p: LordPose): void {
  const stride = p.step * 2.5;
  const c = p.crouch;
  for (const [hip, foot, tone] of [
    [-3, -3.5 - stride, I[1]],
    [3, 3.5 + stride, I[2]],
  ] as const) {
    s.begin();
    s.taper(hip + p.lean * 0.3, -14 + c, (hip + foot) / 2 + 1, -7 + c * 0.5, 2.4, 2, tone);
    s.taper((hip + foot) / 2 + 1, -7 + c * 0.5, foot, -1.5, 2, 2, tone);
    s.block(foot - 2.5, -2, tone, 5.5, 2);
    s.shadeEdges(tone, I[3], I[0]);
    s.set((hip + foot) / 2 + 1.6, -8 + c * 0.5, I[4]);
    s.commit();
  }
}

function tabard(s: SpriteCanvas, p: LordPose, time: number): void {
  const l = p.lean;
  const c = p.crouch;
  const flap = Math.sin(time * 2.4) * 0.8;
  s.begin();
  s.poly(
    [
      [-5 + l * 0.5, -16 + c],
      [5 + l * 0.5, -16 + c],
      [4.5 + flap, -4 + c * 0.5],
      [2, -6 + c * 0.5],
      [0.5, -3 + c * 0.5 - flap],
      [-2, -5.5 + c * 0.5],
      [-4.5 - flap, -3.5 + c * 0.5],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[1]);
  s.hairline(-1 + l * 0.5, -14 + c, -1.5, -5 + c * 0.5, F[0]);
  s.hairline(1.5 + l * 0.5, -14 + c, 1.8, -5 + c * 0.5, F[0]);
  s.commit();
}

function torso(s: SpriteCanvas, p: LordPose): void {
  const l = p.lean;
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-7 + l * 0.8, -31 + c],
      [7 + l, -31.5 + c],
      [6.5 + l * 0.6, -16 + c],
      [-6 + l * 0.5, -15.5 + c],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[1], 2);
  s.hairline(l * 0.8, -30 + c, l * 0.6, -17 + c, I[1]);
  s.block(-6.5 + l * 0.5, -18 + c, R[1], 13, 2);
  s.set(-0.5 + l * 0.6, -18 + c, GRAVE.brass[3]);
  s.set(0 + l * 0.6, -17.5 + c, GRAVE.brass[3]);
  for (const [x, y] of [
    [-4, -27],
    [4, -24],
    [-3, -21],
  ] as const)
    s.set(x + l * 0.7, y + c, R[2]);
  s.commit();
  if (p.open) {
    s.begin();
    s.hairline(1 + l * 0.8, -28 + c, -1 + l * 0.7, -24 + c, F[3]);
    s.hairline(-1 + l * 0.7, -24 + c, 1.5 + l * 0.7, -20 + c, F[2]);
    s.commit(false);
  }
}

function pauldron(s: SpriteCanvas, x: number, y: number, tone: number): void {
  s.begin();
  s.dot(x, y, 4, tone);
  s.shadeEdges(tone, I[4], I[0], 2);
  s.commit();
  s.begin();
  s.hairline(x - 3, y + 1.5, x + 3, y + 1.5, I[1]);
  s.set(x - 1, y - 2.4, I[4]);
  s.commit(false);
}

function helm(s: SpriteCanvas, p: LordPose): void {
  const hx = 1.5 + p.lean * 1.2;
  const hy = -35 + p.crouch + (p.limp ? 1 : 0);
  s.begin();
  for (const [dx, h] of [
    [-3.5, 4],
    [-1.2, 6],
    [1.2, 5],
    [3.4, 3.5],
  ] as const)
    s.poly(
      [
        [hx + dx - 1, hy - 3],
        [hx + dx, hy - 3 - h],
        [hx + dx + 1, hy - 3],
      ],
      I[3],
    );
  s.shadeEdges(I[3], I[4], I[1]);
  s.commit();
  s.begin();
  s.dot(hx, hy, 4.2, I[2]);
  s.block(hx - 3.6, hy, I[2], 8, 3.6);
  s.shadeEdges(I[2], I[3], I[1], 2);
  s.commit();
  s.begin();
  const eye = p.open ? F[1] : p.heat > 0.5 ? F[4] : F[2];
  s.block(hx - 0.5, hy - 0.6, GRAVE.hollow, 5, 1.4);
  s.set(hx + 1.2, hy - 0.2, eye);
  s.set(hx + 3, hy - 0.2, eye);
  if (p.heat > 0.5) s.set(hx + 2.1, hy - 0.2, F[3]);
  s.hairline(hx + 2, hy + 1.6, hx + 2, hy + 3, I[1]);
  s.commit(false);
}

function sword(s: SpriteCanvas, p: LordPose): void {
  const [gx, gy] = p.grip;
  const [tx, ty] = p.tip;
  const len = Math.hypot(tx - gx, ty - gy) || 1;
  const ux = (tx - gx) / len;
  const uy = (ty - gy) / len;
  const nx = -uy;
  const ny = ux;
  const guard = 2.5;
  s.begin();
  s.stroke(gx - ux * 4, gy - uy * 4, gx + ux * guard, gy + uy * guard, 0.7, GRAVE.dirt[3]);
  s.dot(gx - ux * 4.5, gy - uy * 4.5, 1.1, GRAVE.brass[2]);
  s.stroke(
    gx + ux * guard + nx * 4,
    gy + uy * guard + ny * 4,
    gx + ux * guard - nx * 4,
    gy + uy * guard - ny * 4,
    0.7,
    I[3],
  );
  s.shadeEdges(I[3], I[4], I[1]);
  s.commit();
  const base = guard + 1;
  const w = 3.4;
  s.begin();
  s.poly(
    [
      [gx + ux * base + nx * w, gy + uy * base + ny * w],
      [tx - ux * 2 + nx * w, ty - uy * 2 + ny * w],
      [tx + nx * w * 0.4, ty + ny * w * 0.4],
      [tx - nx * w * 0.4, ty - ny * w * 0.4],
      [tx - ux * 2 - nx * w, ty - uy * 2 - ny * w],
      [gx + ux * base - nx * w, gy + uy * base - ny * w],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[3], S[1], 2);
  const mid = (len + base) / 2;
  const glyph = p.heat > 0.5 ? F[3] : p.open ? F[0] : F[1];
  for (let d = base + 3; d < len - 3; d += 3.4) {
    const cx = gx + ux * d;
    const cy = gy + uy * d;
    s.hairline(cx - nx * 1.2, cy - ny * 1.2, cx + nx * 1.2, cy + ny * 1.2, d < mid ? glyph : S[1]);
  }
  s.hairline(
    gx + ux * base + nx * 2.6,
    gy + uy * base + ny * 2.6,
    tx - ux * 2 + nx * 2.6,
    ty - uy * 2 + ny * 2.6,
    S[3],
  );
  s.set(gx + ux * (len * 0.7) - nx * 2, gy + uy * (len * 0.7) - ny * 2, GRAVE.moss[2]);
  s.commit();
}

function arm(s: SpriteCanvas, p: LordPose, shoulderX: number, tone: number): void {
  const [gx, gy] = p.grip;
  const sx = shoulderX + p.lean;
  const sy = -28 + p.crouch;
  const ex = (sx + gx) / 2 - 1;
  const ey = (sy + gy) / 2 + 2;
  s.begin();
  s.taper(sx, sy, ex, ey, 2, 1.8, tone);
  s.taper(ex, ey, gx, gy, 1.8, 1.6, tone);
  s.dot(gx, gy, 1.9, I[1]);
  s.shadeEdges(tone, I[3], I[0]);
  s.commit();
}

export function drawBarrowlord(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = lordPose(e, time);
  s.clear();
  arm(s, p, -5, I[1]);
  legs(s, p);
  tabard(s, p, time);
  torso(s, p);
  pauldron(s, -6 + p.lean * 0.8, -29 + p.crouch, I[1]);
  helm(s, p);
  sword(s, p);
  arm(s, p, 5, I[2]);
  pauldron(s, 6 + p.lean, -29.5 + p.crouch, I[2]);
  moonlight(s, true);
  s.outline(GRAVE.outline);
  return s;
}
