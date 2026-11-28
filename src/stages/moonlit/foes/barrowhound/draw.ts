import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { GRAVE } from "../graveColors";
import { type HoundPose, houndPose } from "./pose";

const canvas = detailCanvas(52, 34, 24, 28);
const H = GRAVE.hide;
const B = GRAVE.bone;
const F = GRAVE.fire;

function leg(
  s: SpriteCanvas,
  hipX: number,
  hipY: number,
  phase: number,
  p: HoundPose,
  far: boolean,
  front: boolean,
): void {
  const swing = p.gait ? Math.sin(p.gait + phase) * 2.6 : 0;
  const lift = p.gait ? Math.max(0, Math.cos(p.gait + phase)) * 1.6 : 0;
  const reach = p.stretch * (front ? 5 : -5);
  const footX = hipX + swing + reach;
  const kneeX = hipX + (front ? 0.6 : -1.8) + swing * 0.5 + reach * 0.5;
  const kneeY = (hipY + 0) / 2 - lift * 0.5 + (front ? 0 : -1);
  const tone = far ? H[1] : H[2];
  s.taper(hipX, hipY, kneeX, kneeY, front ? 1.6 : 2, 1, tone);
  s.taper(kneeX, kneeY, footX, -lift - p.stretch * 2, 1, 0.7, tone);
  s.set(footX + 0.8, -0.4 - lift - p.stretch * 2, far ? B[1] : B[2]);
  s.set(footX + 1.3, -0.4 - lift - p.stretch * 2, far ? B[1] : B[3]);
}

function legs(s: SpriteCanvas, p: HoundPose, far: boolean): void {
  const c = p.crouch;
  s.begin();
  leg(s, 6, -8 + c * 0.6, far ? 0 : Math.PI, p, far, true);
  leg(s, -7, -9 + c * 0.9, far ? Math.PI * 0.5 : Math.PI * 1.5, p, far, false);
  s.shadeEdges(far ? H[1] : H[2], far ? H[2] : H[3], H[0]);
  s.commit();
}

function body(s: SpriteCanvas, p: HoundPose, time: number): void {
  const c = p.crouch;
  const breath = Math.sin(time * 5) * 0.3;
  s.begin();
  s.taper(-8, -10 + c, -14 - p.stretch * 2, -14 + c - Math.sin(time * 6) * 1.2 - p.heat * 2, 1.6, 0.4, H[2], -0.8);
  s.poly(
    [
      [-10, -11 + c],
      [-6, -14 + c],
      [2, -14.5 + c * 0.6 + breath],
      [8, -15 + c * 0.4],
      [10, -11 + c * 0.4],
      [8, -7.5 + c * 0.5],
      [2, -7.5 + c * 0.6],
      [-4, -7 + c * 0.8],
      [-9.5, -8 + c],
    ],
    H[2],
  );
  s.dot(6.5, -11 + c * 0.4, 4.2, H[2]);
  s.shadeEdges(H[2], H[3], H[1], 2);
  for (let k = 0; k < 4; k++) s.hairline(3 - k * 2.2, -12 + c * 0.6, 2.4 - k * 2.2, -8.5 + c * 0.6, H[1]);
  s.commit();
  s.begin();
  for (let k = 0; k < 6; k++) {
    const x = -8 + k * 2.8;
    const y = -14.6 + c * (k < 3 ? 0.9 : 0.5) - (k === 4 ? 0.4 : 0);
    s.poly(
      [
        [x - 1, y + 0.6],
        [x + 0.2, y - 1.6 - p.heat * 0.8],
        [x + 1.2, y + 0.6],
      ],
      B[2],
    );
  }
  s.shadeEdges(B[2], B[3], B[1]);
  s.commit();
}

function head(s: SpriteCanvas, p: HoundPose): void {
  const c = p.crouch;
  const hx = 11 + p.stretch * 2;
  const hy = -12.5 + c * 1.1 - p.stretch;
  s.begin();
  s.poly(
    [
      [hx - 3, hy - 2.5],
      [hx + 1, hy - 3.2],
      [hx + 6.5, hy - 1],
      [hx + 6.5, hy + 0.6],
      [hx + 1, hy + 1.8],
      [hx - 3, hy + 2],
    ],
    B[2],
  );
  s.poly(
    [
      [hx - 2.6, hy - 2.4],
      [hx - 2.2, hy - 6],
      [hx - 0.2, hy - 2.8],
    ],
    H[2],
  );
  s.shadeEdges(B[2], B[3], B[1]);
  s.shadeEdges(H[2], H[3], H[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx + 0.5, hy + 1.4 + p.jaw * 0.3],
      [hx + 6, hy + 1 + p.jaw],
      [hx + 5.5, hy + 2 + p.jaw],
      [hx + 0.5, hy + 2.6],
    ],
    B[1],
  );
  s.commit();
  s.begin();
  const eye = p.dim ? F[0] : p.heat > 0.5 ? F[4] : F[2];
  s.block(hx + 0.6, hy - 1.6, GRAVE.hollow, 1.8, 1.2);
  s.set(hx + 1, hy - 1.2, eye);
  s.set(hx + 1.6, hy - 1.2, p.dim ? F[0] : F[3]);
  s.set(hx + 6.2, hy - 0.6, GRAVE.hollow);
  for (let x = hx + 2; x < hx + 6; x += 1.2) s.set(x, hy + 1, B[4]);
  if (p.jaw > 0.8) s.block(hx + 1.5, hy + 1.5, F[1], 3.6, p.jaw * 0.5);
  s.commit(false);
}

export function drawBarrowhound(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = houndPose(e, time);
  s.clear();
  legs(s, p, true);
  body(s, p, time);
  legs(s, p, false);
  head(s, p);
  moonlight(s, true);
  s.outline(GRAVE.outline);
  return s;
}
