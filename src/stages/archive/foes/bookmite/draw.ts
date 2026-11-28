import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { type BookmitePose, bookmitePose } from "./pose";

const canvas = detailCanvas(32, 28, 16, 24);
const L = FOE.leather;
const P = FOE.paper;
type Pt = [number, number];

const HALF = 5;
const THICK = 4.6;
const BASE = -3.5;

function at(p: BookmitePose, u: number, v: number): Pt {
  const c = Math.cos(p.tilt);
  const s = Math.sin(p.tilt);
  return [u * c - v * s, BASE - p.lift + u * s + v * c];
}

function legs(s: SpriteCanvas, p: BookmitePose, near: boolean): void {
  s.begin();
  const tone = near ? P[3] : P[2];
  for (const [u, phase] of [
    [-3.5, near ? 0 : Math.PI],
    [3, near ? Math.PI : 0],
  ] as const) {
    const swing = Math.sin(p.stride + phase) * 1.6;
    const [hx, hy] = at(p, u, 0);
    const reach = 1 - p.tuck * 0.6;
    const footX = hx + swing + (u > 0 ? 1.5 : -1.5) * reach;
    const footY = hy + (4 + Math.max(0, -Math.cos(p.stride + phase)) * -1) * reach;
    const kneeX = (hx + footX) / 2 + (u > 0 ? 1.5 : -1.5);
    const kneeY = hy + 1;
    s.stroke(hx, hy, kneeX, kneeY, 0.55, tone);
    s.stroke(kneeX, kneeY, footX, footY, 0.45, tone);
  }
  s.shadeEdges(tone, P[4], P[1]);
  s.commit();
}

function pages(s: SpriteCanvas, p: BookmitePose): void {
  s.begin();
  s.poly(
    [at(p, -HALF + 0.8, -0.5), at(p, HALF, -0.5), at(p, HALF, -THICK + 0.6), at(p, -HALF + 0.8, -THICK + 0.6)],
    P[3],
  );
  for (let v = -0.9; v > -THICK + 0.6; v -= 0.6) s.hairline(...at(p, -HALF + 1.4, v), ...at(p, HALF - 0.4, v), P[2]);
  s.commit();
  if (p.open <= 0.2) return;
  s.begin();
  for (let u = -1; u < HALF; u += 1.6) {
    const [x0, y0] = at(p, u, -THICK + 0.6);
    const [x1, y1] = at(p, u + 0.8, -THICK - 1.4 * p.open);
    const [x2, y2] = at(p, u + 1.4, -THICK + 0.6);
    s.poly(
      [
        [x0, y0],
        [x1, y1],
        [x2, y2],
      ],
      P[4],
    );
  }
  s.commit(false);
}

function coverBottom(s: SpriteCanvas, p: BookmitePose): void {
  s.begin();
  s.poly([at(p, -HALF, 0), at(p, HALF + 0.5, 0), at(p, HALF + 0.5, -0.9), at(p, -HALF, -0.9)], L[1]);
  s.shadeEdges(L[1], L[2], L[0]);
  s.commit();
}

function spine(s: SpriteCanvas, p: BookmitePose, time: number): void {
  s.begin();
  const sway = Math.sin(time * 4) * 0.8;
  const [rx, ry] = at(p, -HALF - 0.5, -THICK * 0.5);
  s.taper(rx, ry, rx - 3, ry + 2.5 + sway, 0.6, 0.45, FOE.wax[2], 0.6);
  s.shadeEdges(FOE.wax[2], FOE.wax[3], FOE.wax[1]);
  s.commit();
  s.begin();
  s.poly(
    [at(p, -HALF - 1, 0.2), at(p, -HALF + 0.6, 0.2), at(p, -HALF + 0.6, -THICK - 0.2), at(p, -HALF - 1, -THICK - 0.2)],
    L[2],
  );
  s.shadeEdges(L[2], L[3], L[0]);
  for (const v of [-1, -THICK + 1]) s.hairline(...at(p, -HALF - 0.8, v), ...at(p, -HALF + 0.4, v), FOE.gilt);
  s.commit();
}

function coverTop(s: SpriteCanvas, p: BookmitePose, glare: boolean): void {
  const angle = p.open * 1.1;
  const hinge = at(p, -HALF, -THICK);
  const c = Math.cos(-angle + p.tilt);
  const n = Math.sin(-angle + p.tilt);
  const lid = (u: number, v: number): Pt => [hinge[0] + u * c - v * n, hinge[1] + u * n + v * c];
  const len = HALF * 2 + 0.5;
  s.begin();
  s.poly(
    [lid(0, 0.4), lid(len, 0.4), lid(len + 0.4, -0.6), lid(len - 0.4, -1.4), lid(0.6, -1.4), lid(-0.6, -0.6)],
    L[2],
  );
  s.shadeEdges(L[2], L[3], L[0]);
  s.commit();
  s.begin();
  s.dot(...lid(-0.2, -0.4), 1.2, L[1]);
  s.set(...lid(-0.6, -0.9), L[3]);
  s.block(...lid(len - 1, -1.1), FOE.gilt);
  s.block(...lid(1, -1.4), FOE.giltDim);
  const [ex, ey] = lid(len - 3.4, -0.4);
  s.dot(ex, ey, 1, FOE.ink[0]);
  s.set(ex + 0.25, ey - 0.25, glare ? FOE.eyeHot : FOE.eye);
  s.hairline(...lid(len - 6, -0.3), ...lid(len - 4.6, -0.3), FOE.giltDim);
  s.commit(false);
}

export function drawBookmite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = bookmitePose(e, time);
  const glare = e.state === "wind" || e.state === "lunge";
  s.clear();
  legs(s, p, false);
  coverBottom(s, p);
  pages(s, p);
  spine(s, p, time);
  coverTop(s, p, glare);
  legs(s, p, true);
  s.outline(FOE.outline);
  return s;
}
