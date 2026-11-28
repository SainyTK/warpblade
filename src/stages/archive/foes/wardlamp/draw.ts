import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { type WardlampPose, wardlampPose } from "./pose";

const canvas = detailCanvas(48, 64, 24, 32);
const B = FOE.bronze;
const G = FOE.spectre;
type Pt = [number, number];
type Frame = (x: number, y: number) => Pt;

const HANG = -15;

function frameOf(p: WardlampPose): Frame {
  const c = Math.cos(p.tilt);
  const n = Math.sin(p.tilt);
  return (x, y) => [x * c - (y - HANG) * n, HANG + x * n + (y - HANG) * c];
}

function chain(s: SpriteCanvas, at: Frame): void {
  const [hx, hy] = at(0, HANG);
  s.begin();
  for (let i = 0; i < 4; i++) {
    const y = hy - 2 - i * 2.2;
    if (i % 2) s.stroke(hx, y - 0.8, hx, y + 0.8, 0.45, FOE.iron[3]);
    else s.dot(hx, y, 0.9, FOE.iron[2]);
  }
  s.shadeEdges(FOE.iron[2], FOE.iron[4], FOE.iron[0]);
  s.commit();
  s.begin();
  s.dot(hx, hy, 1.6, B[2]);
  s.shadeEdges(B[2], B[3], B[0]);
  s.set(hx, hy, FOE.ink[0]);
  s.commit();
}

function cap(s: SpriteCanvas, at: Frame): void {
  s.begin();
  s.poly([at(-6.5, -7.5), at(6.5, -7.5), at(3, -12), at(-3, -12)], B[2]);
  s.shadeEdges(B[2], B[3], B[0], 2);
  s.commit();
  s.begin();
  s.poly([at(-7, -8.5), at(7, -8.5), at(7, -6.8), at(-7, -6.8)], B[3]);
  s.shadeEdges(B[3], FOE.bronzeLit, B[1]);
  for (const x of [-4, 0, 4]) s.set(...at(x, -10), FOE.verdigris);
  s.commit();
}

function glass(s: SpriteCanvas, at: Frame): void {
  s.begin();
  s.poly([at(-5.5, -6.8), at(5.5, -6.8), at(5, 6.5), at(-5, 6.5)], G[0]);
  s.commit();
  s.begin();
  s.dot(...at(0, 0), 4.6, G[1]);
  s.commit(false);
}

function flame(s: SpriteCanvas, at: Frame, p: WardlampPose, time: number): void {
  const F = p.gold ? FOE.glyph : FOE.flame;
  const h = 6.5 * p.flame;
  const lick = Math.sin(time * 18) * 0.8;
  s.begin();
  s.poly([at(-1.3, 5.5), at(1.3, 5.5), at(1.3, 2.4), at(-1.3, 2.4)], FOE.paper[3]);
  s.shadeEdges(FOE.paper[3], FOE.paper[4], FOE.paper[1]);
  s.set(...at(1.2, 3.2), FOE.wax[2]);
  s.set(...at(1.2, 4), FOE.wax[2]);
  s.commit(false);
  s.begin();
  s.taper(...at(0, 1.8), ...at(lick * 0.6, 1.8 - h), 2.2 * Math.min(1.3, p.flame), 0.3, F[2], lick * 0.4);
  s.commit(false);
  s.begin();
  s.taper(...at(0, 1.6), ...at(lick * 0.4, 1.8 - h * 0.7), 1.5 * Math.min(1.3, p.flame), 0.3, F[3], lick * 0.3);
  s.dot(...at(0, 1), 0.9, F[4]);
  s.commit(false);
  if (p.flame < 0.6) return;
  s.begin();
  const eye = p.glare ? FOE.ink[0] : F[1];
  s.set(...at(-0.75, 0.2 - h * 0.25), eye);
  s.set(...at(0.75, 0.2 - h * 0.25), eye);
  s.commit(false);
}

function frame(s: SpriteCanvas, at: Frame): void {
  s.begin();
  for (const x of [-5.5, 5.5]) s.stroke(...at(x, -7), ...at(x * 0.92, 6.5), 0.7, B[2]);
  s.stroke(...at(0, -7), ...at(0, -5), 0.5, B[2]);
  s.shadeEdges(B[2], B[3], B[0]);
  s.commit();
  s.begin();
  s.hairline(...at(-4, -5.5), ...at(-4, -1), FOE.paperGlint);
  s.set(...at(-3.2, -5), FOE.paperGlint);
  s.hairline(...at(3.6, 2), ...at(3.6, 4.5), G[3]);
  s.commit(false);
}

function base(s: SpriteCanvas, at: Frame, time: number): void {
  s.begin();
  s.poly([at(-7, 6.2), at(7, 6.2), at(5, 9), at(1.2, 10.5), at(-1.2, 10.5), at(-5, 9)], B[2]);
  s.shadeEdges(B[2], B[3], B[0], 2);
  s.commit();
  s.begin();
  const sway = Math.sin(time * 2.5) * 0.8;
  const [tx, ty] = at(0, 10.5);
  s.taper(tx, ty, tx + sway, ty + 5, 0.8, 0.5, FOE.wax[2]);
  s.dot(tx + sway, ty + 5.5, 1, FOE.wax[1]);
  s.shadeEdges(FOE.wax[2], FOE.wax[3], FOE.wax[0]);
  s.commit();
}

export function drawWardlamp(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = wardlampPose(e, time);
  const at = frameOf(p);
  s.clear();
  chain(s, at);
  glass(s, at);
  flame(s, at, p, time);
  frame(s, at);
  cap(s, at);
  base(s, at, time);
  s.outline(FOE.outline);
  return s;
}
