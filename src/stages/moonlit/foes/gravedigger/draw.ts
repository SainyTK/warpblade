import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { GRAVE } from "../graveColors";
import { type DiggerPose, diggerPose } from "./pose";

const canvas = detailCanvas(48, 44, 22, 38);
const C = GRAVE.cloth;
const D = GRAVE.dirt;
const I = GRAVE.iron;
const B = GRAVE.bone;
const SKIN = GRAVE.moss;
const HAFT = GRAVE.brass;

function legs(s: SpriteCanvas, p: DiggerPose): void {
  const stride = p.step * 2;
  s.begin();
  s.taper(-1.5, -9, -2.5 - stride, -0.5, 1.4, 1.1, C[1]);
  s.shadeEdges(C[1], C[2], C[0]);
  s.commit();
  s.begin();
  s.taper(1, -9, 2 + stride, -0.5, 1.4, 1.1, C[2]);
  s.shadeEdges(C[2], C[3], C[1]);
  s.commit();
  s.begin();
  s.block(-4.5 - stride, -1.5, D[2], 3.5, 1.5);
  s.block(0.8 + stride, -1.5, D[3], 3.8, 1.5);
  s.set(3.8 + stride, -1.5, D[3]);
  s.commit();
}

function coat(s: SpriteCanvas, p: DiggerPose, time: number): void {
  const l = p.lean;
  const flap = Math.sin(time * 3) * 0.6;
  s.begin();
  s.poly(
    [
      [-4 + l * 0.6, -20],
      [3 + l, -21],
      [5 + l * 0.4, -8],
      [3.5, -5 + flap],
      [1, -6.5],
      [-1.5, -4.5 - flap],
      [-4.5, -6],
      [-7.5, -4.2 + flap],
      [-6.5 + l * 0.3, -13],
    ],
    C[2],
  );
  s.dot(-2.6 + l * 0.7, -19.2, 4.6, C[2]);
  s.shadeEdges(C[2], C[3], C[1], 2);
  s.hairline(-1 + l * 0.6, -16, -2, -6, C[1]);
  s.hairline(2 + l * 0.8, -17, 2.6, -7, C[1]);
  s.hairline(-5.5 + l * 0.5, -14, -6.5, -6, C[0]);
  s.block(-4.6 + l * 0.6, -12, D[3], 8.5 + l * 0.2, 1);
  s.set(0 + l * 0.6, -12, HAFT[3]);
  s.commit();
}

function head(s: SpriteCanvas, p: DiggerPose): void {
  const hx = 4 + p.lean * 1.1;
  const hy = -22.5 + (p.limp ? 1.5 : 0);
  s.begin();
  s.dot(hx, hy, 2.6, SKIN[1]);
  s.dot(hx + 1.2, hy + 1.6, 1.5, SKIN[1]);
  s.shadeEdges(SKIN[1], SKIN[2], SKIN[0]);
  s.commit();
  s.begin();
  const eye = p.limp ? GRAVE.ghost[0] : p.heat > 0.6 ? GRAVE.ghost[3] : GRAVE.ghost[1];
  s.block(hx + 0.6, hy - 0.4, GRAVE.hollow, 1.6, 1);
  s.set(hx + 1.2, hy - 0.4, eye);
  s.hairline(hx + 0.6, hy + 1.8, hx + 2.4, hy + 1.6, GRAVE.hollow);
  s.set(hx + 1, hy + 1.6, B[3]);
  s.set(hx + 2, hy + 1.4, B[3]);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [hx - 6, hy - 1.4],
      [hx + 7, hy - 2.4],
      [hx + 6.5, hy - 1.2],
      [hx - 6, hy - 0.2],
    ],
    D[2],
  );
  s.poly(
    [
      [hx - 3, hy - 1.6],
      [hx - 2.4, hy - 5.4],
      [hx + 2.4, hy - 5.8],
      [hx + 3.4, hy - 2],
    ],
    D[2],
  );
  s.shadeEdges(D[2], D[3], D[1]);
  s.block(hx - 2.6, hy - 2.8, C[1], 5.8, 0.8);
  s.commit();
}

function spade(s: SpriteCanvas, p: DiggerPose): void {
  const [gx, gy] = p.grip;
  const [bx, by] = p.blade;
  const len = Math.hypot(bx - gx, by - gy) || 1;
  const ux = (bx - gx) / len;
  const uy = (by - gy) / len;
  s.begin();
  s.stroke(gx - ux * 9, gy - uy * 9, bx - ux * 2.5, by - uy * 2.5, 0.55, HAFT[2]);
  s.shadeEdges(HAFT[2], HAFT[3], HAFT[1]);
  s.stroke(
    gx - ux * 9 - uy * 1.4,
    gy - uy * 9 + ux * 1.4,
    gx - ux * 9 + uy * 1.4,
    gy - uy * 9 - ux * 1.4,
    0.5,
    HAFT[1],
  );
  s.commit();
  const nx = -uy;
  const ny = ux;
  s.begin();
  s.poly(
    [
      [bx - ux * 3 + nx * 2.6, by - uy * 3 + ny * 2.6],
      [bx + ux * 2.4 + nx * 2.4, by + uy * 2.4 + ny * 2.4],
      [bx + ux * 4.2, by + uy * 4.2],
      [bx + ux * 2.4 - nx * 2.4, by + uy * 2.4 - ny * 2.4],
      [bx - ux * 3 - nx * 2.6, by - uy * 3 - ny * 2.6],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[4], I[1], 2);
  s.hairline(bx - ux * 2.4, by - uy * 2.4, bx + ux * 2.6, by + uy * 2.6, I[2]);
  s.set(bx + ux * 3.4, by + uy * 3.4, p.heat > 0.6 ? GRAVE.moon[4] : I[4]);
  s.set(bx - ux * 1 + nx * 1.4, by - uy * 1 + ny * 1.4, GRAVE.rust[1]);
  s.set(bx + ux * 1 - nx * 1.2, by + uy * 1 - ny * 1.2, GRAVE.rust[2]);
  s.commit();
}

function hand(s: SpriteCanvas, p: DiggerPose): void {
  const [gx, gy] = p.grip;
  s.begin();
  s.taper(1.5 + p.lean, -18.5, gx, gy, 1.3, 1, C[3]);
  s.shadeEdges(C[3], GRAVE.veil[0], C[1]);
  s.commit();
  s.begin();
  s.dot(gx, gy, 1.2, SKIN[2]);
  s.shadeEdges(SKIN[2], B[2], SKIN[0]);
  s.commit();
}

export function drawGravedigger(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = diggerPose(e, time);
  s.clear();
  legs(s, p);
  coat(s, p, time);
  head(s, p);
  if (p.guard) {
    hand(s, p);
    spade(s, p);
  } else {
    spade(s, p);
    hand(s, p);
  }
  moonlight(s);
  s.outline(GRAVE.outline);
  return s;
}
