import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { mix } from "../../../../utils/color";
import { FOE } from "../colors";
import { type HushwardenPose, hushwardenPose } from "./pose";

const canvas = detailCanvas(120, 100, 60, 88);
const I = FOE.ink;
const P = FOE.paper;
const R = FOE.iron;
type Pt = readonly [number, number];

function robe(s: SpriteCanvas, p: HushwardenPose, time: number): void {
  const l = p.lean;
  s.begin();
  s.poly(
    [
      [-7 + l, -40],
      [7 + l, -40],
      [9 + l * 0.6, -24],
      [12, -1],
      [-13, -1],
      [-9 + l * 0.4, -24],
    ],
    I[1],
  );
  for (let x = -12; x <= 11; x += 3) {
    const flick = Math.sin(time * 3 + x * 0.7) * 1.4;
    s.taper(x, -2, x - 1.5 + flick, 1, 1.6, 0.4, I[1]);
  }
  s.shadeEdges(I[1], I[2], I[0], 2);
  for (const [x0, x1] of [
    [-4, -7],
    [0, -1],
    [4, 6],
  ] as const)
    s.hairline(x0 + l, -36, x1, -2, I[0]);
  s.hairline(6 + l, -36, 10, -3, I[3]);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const x = -10 + i * 6;
    const sway = Math.sin(time * 2.6 + i * 1.3) * 0.8;
    s.poly(
      [
        [x, -4],
        [x + 2, -4],
        [x + 1.6 + sway, 1],
        [x + 0.3 + sway, 0.4],
      ],
      i % 2 ? P[1] : P[2],
    );
  }
  s.commit();
  s.begin();
  s.stroke(-8 + l * 0.5, -22, 8 + l * 0.6, -22, 0.8, FOE.leather[1]);
  s.commit();
  s.begin();
  const kx = -5 + l * 0.5;
  s.dot(kx, -19.5, 1.6, FOE.giltDim);
  s.dot(kx, -19.5, 0.8, I[1]);
  for (let i = 0; i < 3; i++) {
    const a = 1.2 + i * 0.35 + Math.sin(time * 3 + i) * 0.1;
    s.stroke(
      kx + Math.cos(a) * 1.4,
      -19.5 + Math.sin(a) * 1.4,
      kx + Math.cos(a) * 4.2,
      -19.5 + Math.sin(a) * 4.2,
      0.35,
      FOE.gilt,
    );
  }
  s.commit(false);
}

function collar(s: SpriteCanvas, p: HushwardenPose): void {
  const l = p.lean;
  s.begin();
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI;
    const x = l + Math.cos(a) * 7;
    const y = -41 + Math.sin(a) * 3;
    s.poly(
      [
        [l, -40],
        [x - 1.6, y],
        [x + Math.cos(a) * 2.5, y + Math.sin(a) * 2.5 - 1],
        [x + 1.6, y],
      ],
      i % 2 ? P[3] : P[4],
    );
  }
  s.shadeEdges(P[3], P[4], P[1]);
  s.commit();
}

function head(s: SpriteCanvas, p: HushwardenPose, time: number): void {
  const hx = 1 + p.lean * 1.2;
  const hy = -48;
  s.begin();
  s.poly(
    [
      [hx - 5, hy + 5],
      [hx - 5.5, hy - 3],
      [hx - 2.5, hy - 10 + Math.sin(time * 1.5) * 0.4],
      [hx + 1.5, hy - 7],
      [hx + 5, hy - 2],
      [hx + 5, hy + 5],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0], 2);
  s.commit();
  s.begin();
  s.dot(hx + 1.5, hy, 3.4, I[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 0.5, hy - 4],
      [hx + 3.5, hy - 4],
      [hx + 4.3, hy + 1],
      [hx + 2.5, hy + 5],
      [hx + 0.5, hy + 5],
      [hx - 0.8, hy + 1],
    ],
    P[4],
  );
  s.shadeEdges(P[4], FOE.paperGlint, P[2], 2);
  s.commit();
  s.begin();
  const glow = p.glare ? FOE.eyeHot : FOE.eye;
  for (const x of [hx + 0.7, hx + 3.2]) {
    s.block(x - 0.5, hy - 1.5, I[0], 1.2, 1.4);
    s.set(x, hy - 1, glow);
  }
  s.hairline(hx + 0.6, hy + 2.6, hx + 3.4, hy + 2.6, FOE.text);
  for (let x = hx + 1; x <= hx + 3.2; x += 0.75) s.hairline(x, hy + 2, x, hy + 3.2, FOE.text);
  s.commit(false);
}

function arm(s: SpriteCanvas, p: HushwardenPose, near: boolean): void {
  const shoulder: Pt = [near ? 5 + p.lean : -4 + p.lean, -37];
  const hand: Pt = near ? p.hand : [-7 + p.lean, -26];
  const lifted: Pt = near ? hand : [-2 + p.lean * 0.5, -40 - 16 * p.raise];
  const to: Pt = !near && p.raise > 0 ? lifted : hand;
  const elbow: Pt = [(shoulder[0] + to[0]) / 2 + (near ? 1 : -2), (shoulder[1] + to[1]) / 2 + 2];
  const tone = near ? I[2] : I[1];
  s.begin();
  s.taper(shoulder[0], shoulder[1], elbow[0], elbow[1], 2.2, 1.7, tone);
  s.taper(elbow[0], elbow[1], to[0], to[1], 1.8, 1.3, tone);
  s.shadeEdges(tone, near ? I[3] : I[2], I[0]);
  s.commit();
  s.begin();
  s.dot(to[0], to[1], 1.2, FOE.spectre[near ? 2 : 1]);
  if (!near && p.raise > 0.5) s.stroke(to[0], to[1], to[0] + 0.3, to[1] - 3, 0.4, FOE.spectre[3]);
  s.commit();
}

function chain(s: SpriteCanvas, p: HushwardenPose): void {
  const [hx, hy] = p.hand;
  const [bx, by] = p.book;
  const len = Math.hypot(bx - hx, by - hy);
  const n = Math.max(2, Math.round(len / 2));
  s.begin();
  for (let i = 1; i < n; i++) {
    const u = i / n;
    const sag = p.slack * Math.sin(Math.PI * u) * 6;
    const x = hx + (bx - hx) * u;
    const y = hy + (by - hy) * u + sag;
    if (i % 2) s.dot(x, y, 0.65, R[3]);
    else s.block(x - 0.5, y - 0.25, R[2], 1, 0.5);
  }
  s.commit(false);
}

function grimoire(s: SpriteCanvas, p: HushwardenPose): void {
  const c = Math.cos(p.tilt);
  const n = Math.sin(p.tilt);
  const [bx, by] = p.book;
  const at = (u: number, v: number): [number, number] => [bx + u * c - v * n, by + u * n + v * c];
  const L = FOE.leather;
  s.begin();
  s.poly([at(-5, -6.5), at(5, -6.5), at(5, 6.5), at(-5, 6.5)], L[1]);
  s.shadeEdges(L[1], L[2], L[0], 2);
  s.commit();
  s.begin();
  s.poly([at(5, -6), at(6.5, -5.5), at(6.5, 5.5), at(5, 6)], P[3]);
  s.commit();
  s.begin();
  for (const [u, v] of [
    [-5, -6.5],
    [5, -6.5],
    [-5, 6.5],
    [5, 6.5],
  ] as const)
    s.dot(...at(u * 0.85, v * 0.85), 1.2, R[3]);
  s.shadeEdges(R[3], R[4], R[1]);
  s.commit();
  s.begin();
  const lid = 1 - p.eye;
  s.dot(...at(0, 0), 2.4, I[0]);
  s.dot(...at(0, 0), 1.6, p.eye > 0.2 ? mix(FOE.eye, FOE.letterHot, p.eye) : FOE.wax[1]);
  s.set(...at(0, 0), p.eye > 0.5 ? FOE.eyeHot : I[0]);
  if (lid > 0.3) s.hairline(...at(-2, 0), ...at(2, 0), L[0]);
  s.commit(false);
}

function hush(s: SpriteCanvas, p: HushwardenPose, time: number): void {
  if (p.raise <= 0.2) return;
  s.begin();
  for (let i = 0; i < 3; i++) {
    const r = 4 + ((time * 10 + i * 4) % 12);
    for (let a = -0.9; a <= 0.9; a += 0.15)
      s.set(2 + Math.cos(a - Math.PI / 2) * r, -58 + Math.sin(a - Math.PI / 2) * r * 0.5, FOE.spectre[r < 10 ? 3 : 2]);
  }
  s.commit(false);
}

export function drawHushwarden(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = hushwardenPose(e, time);
  const shield = e.state === "walk";
  s.clear();
  arm(s, p, false);
  if (!shield) {
    chain(s, p);
    grimoire(s, p);
  }
  robe(s, p, time);
  collar(s, p);
  head(s, p, time);
  if (shield) {
    chain(s, p);
    grimoire(s, p);
  }
  arm(s, p, true);
  s.outline(FOE.outline);
  hush(s, p, time);
  return s;
}
