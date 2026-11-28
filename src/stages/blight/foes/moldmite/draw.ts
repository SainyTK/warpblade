import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { lerp } from "../../../../utils/math";
import { MITE } from "./colors";
import { type MitePose, mitePose } from "./pose";

const canvas = detailCanvas(28, 22, 14, 18);
const S = MITE.shell;
const LEGS = 3;

function legs(s: SpriteCanvas, p: MitePose, time: number, near: boolean): void {
  const tone = near ? MITE.leg[3] : MITE.leg[1];
  s.begin();
  for (let i = 0; i < LEGS; i++) {
    const hx = -3 + i * 3 + (near ? 0.5 : -0.5);
    const phase = Math.sin(p.stride + i * 2.2 + (near ? 0 : Math.PI));
    const wave = p.flail ? Math.sin(time * 40 + i * 2) * 1.6 : 0;
    const step = phase * 1.4 + wave;
    const lift = Math.max(0, -phase) * 1.1;
    const kneeX = hx + (i - 1) * 1.4 + step * 0.4;
    const kneeY = lerp(-4.6, -3.6, p.tuck) - (p.flail ? 1 : 0);
    const footX = lerp(hx + (i - 1) * 2.6 + step, hx + (i - 1) * 0.8, p.tuck);
    const footY = lerp(-lift, -2.6, p.tuck) - (p.flail ? 2 + wave * 0.5 : 0);
    s.hairline(hx, -3, kneeX, kneeY, tone);
    s.hairline(kneeX, kneeY, footX, footY, tone);
  }
  s.commit(false);
}

function body(s: SpriteCanvas, p: MitePose): void {
  const rx = 4.6 * (1 + p.squash * 0.6);
  const ry = 3.2 * (1 - p.squash);
  const cy = -3.2 - ry * 0.6;
  s.begin();
  const pts: [number, number][] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI + (i / 16) * Math.PI;
    pts.push([Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  for (let i = 1; i < 16; i++) {
    const a = (i / 16) * Math.PI;
    pts.push([Math.cos(a) * rx, cy + Math.sin(a) * ry * 0.7]);
  }
  s.poly(pts, S[2]);
  s.shadeEdges(S[2], S[3], S[1], 1);
  s.commit();
  s.begin();
  s.hairline(-rx + 1.5, cy + 0.4, rx - 1.5, cy + 0.6, S[1]);
  s.set(-rx * 0.45, cy - ry * 0.55, S[4]);
  s.set(-rx * 0.45 + 0.5, cy - ry * 0.55, S[4]);
  s.commit(false);
}

function mold(s: SpriteCanvas, p: MitePose, time: number): void {
  const ry = 3.2 * (1 - p.squash);
  const top = -3.2 - ry * 1.6;
  s.begin();
  s.dot(-1.6, top + 0.6, 2.1, MITE.mold[2]);
  s.dot(0.8, top + 0.2, 1.7, MITE.mold[3]);
  s.dot(-3.4, top + 1.6, 1.1, MITE.mold[2]);
  s.shadeEdges(MITE.mold[2], MITE.mold[4], MITE.mold[1]);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const x = -3.2 + i * 1.4;
    const sway = Math.sin(time * 3 + i * 1.7) * 0.4;
    const h = 1.6 + (i % 2) * 1.1;
    s.hairline(x, top + 0.4, x + sway, top - h, MITE.mold[3]);
    s.set(x + sway, top - h - 0.5, i % 2 ? MITE.fuzz[3] : MITE.fuzz[4]);
  }
  s.commit(false);
}

function head(s: SpriteCanvas, p: MitePose): void {
  const hx = 4.6 + p.squash * 1.2;
  const hy = -3.6 + p.squash * 0.8;
  s.begin();
  s.dot(hx, hy, 1.9, S[1]);
  s.shadeEdges(S[1], S[3], S[0]);
  s.commit();
  s.begin();
  const open = 0.4 + p.gape * 0.9;
  s.hairline(hx + 1.2, hy - 0.2, hx + 3, hy - open, MITE.mandible[2]);
  s.hairline(hx + 1.2, hy + 0.6, hx + 3, hy + 0.6 + open * 0.7, MITE.mandible[1]);
  s.set(hx + 3, hy - open, MITE.mandible[3]);
  s.block(hx + 0.2, hy - 1.2, p.fierce ? MITE.eyeHot : MITE.eye, 1);
  s.set(hx - 1, hy - 1, MITE.eye);
  s.commit(false);
}

export function drawMoldmite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = mitePose(e, time);
  s.clear();
  s.shift(p.shiver, 0);
  legs(s, p, time, false);
  body(s, p);
  mold(s, p, time);
  head(s, p);
  legs(s, p, time, true);
  s.outline(MITE.outline);
  return s;
}
