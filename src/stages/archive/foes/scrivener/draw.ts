import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { TAU } from "../../../../utils/math";
import { FOE } from "../colors";
import { letter } from "../letters";
import { scrivenerHidden } from "./behavior";
import { type ScrivenerPose, scrivenerPose } from "./pose";

const canvas = detailCanvas(60, 60, 30, 52);
const I = FOE.ink;
const P = FOE.paper;
const G = FOE.spectre;
type Pt = readonly [number, number];

function scroll(s: SpriteCanvas, p: ScrivenerPose, time: number): void {
  const sway = Math.sin(time * 2.2) * 1.2;
  const top: Pt = [-3 + p.lean * 0.3, -14 + p.hunch];
  const mid: Pt = [-9 + sway * 0.5, -7];
  const end: Pt = [-14 + sway, -1];
  s.begin();
  s.taper(top[0], top[1], mid[0], mid[1], 1.6, 1.8, P[3], 0.5);
  s.taper(mid[0], mid[1], end[0], end[1], 1.8, 1.4, P[3], -0.5);
  s.dot(end[0] - 0.5, end[1], 1.6, P[2]);
  s.shadeEdges(P[3], P[4], P[1]);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const u = 0.2 + i * 0.2;
    const x = top[0] + (end[0] - top[0]) * u;
    const y = top[1] + (end[1] - top[1]) * u;
    s.hairline(x - 0.8, y, x + 0.6, y - 0.3, FOE.text);
  }
  s.commit(false);
}

function robe(s: SpriteCanvas, p: ScrivenerPose, time: number): void {
  const h = p.hunch;
  const l = p.lean;
  s.begin();
  s.poly(
    [
      [-5 + l * 0.6, -25 + h],
      [3 + l, -27 + h],
      [7 + l, -22 + h],
      [8 + l * 0.4, -10],
      [9, -1],
      [-9, -1],
      [-8 + l * 0.2, -12],
    ],
    I[2],
  );
  for (let x = -8; x <= 8; x += 2.5) {
    const flick = Math.sin(time * 5 + x) * 1.2;
    s.taper(x, -2, x - 1 + flick, 1 + Math.abs(flick) * 0.4, 1.2, 0.3, I[2]);
  }
  s.shadeEdges(I[2], I[3], I[0], 2);
  s.hairline(-2 + l * 0.5, -20 + h, -4, -1, I[1]);
  s.hairline(3 + l * 0.6, -18 + h, 4, -1, I[1]);
  s.hairline(6 + l * 0.6, -20 + h, 7.5, -3, I[3]);
  s.commit();
  s.begin();
  s.stroke(-6 + l * 0.3, -14 + h * 0.5, 7 + l * 0.4, -14 + h * 0.5, 0.7, FOE.leather[1]);
  s.commit();
  s.begin();
  s.dot(5 + l * 0.4, -12 + h * 0.5, 1.7, FOE.bronze[2]);
  s.shadeEdges(FOE.bronze[2], FOE.bronzeLit, FOE.bronze[0]);
  s.block(4.5 + l * 0.4, -14.5 + h * 0.5, FOE.bronze[3], 1, 1);
  s.commit();
}

function hood(s: SpriteCanvas, p: ScrivenerPose, time: number): void {
  const hx = 5 + p.lean;
  const hy = -29 + p.hunch;
  s.begin();
  s.dot(hx, hy, 4.6, I[3]);
  s.poly(
    [
      [hx - 3, hy - 3],
      [hx - 9, hy - 2 + Math.sin(time * 2) * 0.6],
      [hx - 3.5, hy + 1.5],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[4], I[1], 2);
  s.commit();
  s.begin();
  s.dot(hx + 2, hy + 0.5, 2.9, I[0]);
  s.commit();
  s.begin();
  s.dot(hx + 2.6, hy + 0.6, 1.9, G[1]);
  s.shadeEdges(G[1], G[2], G[0]);
  const eye = p.glare ? FOE.eyeHot : FOE.eye;
  s.set(hx + 2.5, hy, eye);
  s.set(hx + 3.8, hy, p.glare ? FOE.eye : FOE.eyeDeep);
  s.taper(hx + 2.5, hy + 2.2, hx + 2 + Math.sin(time * 3) * 0.6, hy + 5, 0.7, 0.2, G[2]);
  s.commit(false);
}

function quill(s: SpriteCanvas, p: ScrivenerPose): void {
  const [hx, hy] = p.hand;
  const [nx, ny] = p.nib;
  const dx = hx - nx;
  const dy = hy - ny;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const top: Pt = [hx + ux * 12, hy + uy * 12];
  s.begin();
  s.taper(hx + ux * 1, hy + uy * 1, top[0], top[1], 2.2, 0.5, P[4], 1.4);
  s.shadeEdges(P[4], FOE.paperGlint, P[2]);
  s.hairline(hx, hy, top[0], top[1], P[2]);
  s.commit();
  s.begin();
  s.stroke(hx, hy, nx - ux * 2, ny - uy * 2, 0.45, P[2]);
  s.poly(
    [
      [nx - ux * 2 - uy * 0.8, ny - uy * 2 + ux * 0.8],
      [nx, ny],
      [nx - ux * 2 + uy * 0.8, ny - uy * 2 - ux * 0.8],
    ],
    FOE.steel[2],
  );
  s.set(nx, ny, I[0]);
  s.commit();
}

function arm(s: SpriteCanvas, p: ScrivenerPose, far: boolean): void {
  const shoulder: Pt = [far ? 1 + p.lean : 3 + p.lean, -23 + p.hunch];
  const hand: Pt = far ? [8 + p.lean, -20 + p.hunch] : p.hand;
  const elbow: Pt = [(shoulder[0] + hand[0]) / 2 - 1, (shoulder[1] + hand[1]) / 2 + 2];
  const tone = far ? I[1] : I[3];
  s.begin();
  s.taper(shoulder[0], shoulder[1], elbow[0], elbow[1], 1.8, 1.4, tone);
  s.taper(elbow[0], elbow[1], hand[0] - 1, hand[1], 1.5, 1.1, tone);
  s.shadeEdges(tone, far ? I[2] : I[4], I[0]);
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 1.1, far ? G[1] : G[2]);
  s.set(hand[0] + 0.5, hand[1] - 0.5, G[3]);
  s.commit();
}

function ledger(s: SpriteCanvas, p: ScrivenerPose): void {
  const x = 9 + p.lean;
  const y = -20 + p.hunch;
  s.begin();
  s.poly(
    [
      [x - 3, y - 1.5],
      [x, y - 0.5],
      [x + 3, y - 1.5],
      [x + 3, y + 1],
      [x, y + 2],
      [x - 3, y + 1],
    ],
    P[3],
  );
  s.shadeEdges(P[3], P[4], P[1]);
  s.hairline(x, y - 0.5, x, y + 2, P[1]);
  s.commit();
}

function swirl(s: SpriteCanvas, p: ScrivenerPose, time: number): void {
  if (p.swirl <= 0) return;
  const [nx, ny] = p.nib;
  const r = 7 - p.swirl * 3;
  s.begin();
  for (let i = 0; i < 4; i++) {
    const a = time * 6 + (i * TAU) / 4;
    letter(
      s,
      nx + Math.cos(a) * r - 0.5,
      ny + Math.sin(a) * r * 0.7 - 0.5,
      i + Math.floor(time * 5),
      FOE.letter,
      FOE.letterHot,
    );
  }
  s.commit(false);
}

export function drawScrivener(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  s.clear();
  if (scrivenerHidden(e)) return s;
  const p = scrivenerPose(e, time);
  scroll(s, p, time);
  arm(s, p, true);
  robe(s, p, time);
  ledger(s, p);
  hood(s, p, time);
  quill(s, p);
  arm(s, p, false);
  s.outline(FOE.outline);
  swirl(s, p, time);
  return s;
}
