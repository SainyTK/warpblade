import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";
import { CRYO } from "./constants";
import { wardLeft } from "./ward";

const canvas = detailCanvas(48, 56, 24, 52);
const R = FOE.robe;
const C = FOE.crystal;

type Pt = readonly [number, number];

function staffPose(e: Enemy): { foot: Pt; tip: Pt; hand: Pt } {
  if (e.state === "wind") return { foot: [2, -12], tip: [11, -44], hand: [5, -22] };
  if (e.state === "shoot") return { foot: [3, -20], tip: [16, -3], hand: [7, -15] };
  if (e.state === "summon") return { foot: [1, -16], tip: [17, -24], hand: [7, -19] };
  return { foot: [9, 0], tip: [9, -37], hand: [8, -17] };
}

function robe(s: SpriteCanvas, sway: number, lean: number): void {
  s.begin();
  s.poly(
    [
      [-4 + lean, -24],
      [4 + lean, -24],
      [8 + sway, 0],
      [-9 + sway * 0.5, 0],
    ],
    R[1],
  );
  s.dot(lean, -23, 4.5, R[1]);
  s.shadeEdges(R[1], R[2], R[0], 2);
  s.hairline(-2 + lean, -18, -4 + sway, -1, R[0]);
  s.hairline(2 + lean, -16, 3 + sway, -1, R[0]);
  s.hairline(5 + lean, -20, 7 + sway, -2, R[3]);
  s.commit();
  s.begin();
  for (let x = -9; x <= 8; x += 1.5) s.dot(x + sway * 0.7, -1, 1.2, FOE.fur[1]);
  s.shadeEdges(FOE.fur[1], FOE.fur[2], FOE.fur[0]);
  s.commit();
}

function hood(s: SpriteCanvas, lean: number, glare: boolean): void {
  const hx = 1 + lean;
  s.begin();
  s.dot(hx, -28, 5.2, R[2]);
  s.poly(
    [
      [hx - 4, -31],
      [hx - 9, -37],
      [hx - 1, -32.5],
    ],
    R[2],
  );
  s.shadeEdges(R[2], R[3], R[1], 2);
  s.commit();
  s.begin();
  s.dot(hx + 2.6, -27.5, 3, R[0]);
  s.commit();
  s.begin();
  s.dot(hx + 3.2, -27.4, 2, FOE.mask[1]);
  s.shadeEdges(FOE.mask[1], FOE.mask[2], FOE.mask[0]);
  s.block(hx + 3, -28.5, glare ? FOE.eyeHot : FOE.eye, 1.5, 0.5);
  s.set(hx + 2.5, -26, FOE.mask[0]);
  s.set(hx + 3.5, -25.5, FOE.mask[0]);
  s.commit();
  s.begin();
  for (let x = -4; x <= 5; x += 1.4) s.dot(hx + x * 0.9, -22.2 + Math.abs(x) * 0.15, 1.3, FOE.fur[1]);
  s.shadeEdges(FOE.fur[1], FOE.fur[2], FOE.fur[0]);
  s.commit();
}

function staff(s: SpriteCanvas, e: Enemy, glow: number): void {
  const { foot, tip, hand } = staffPose(e);
  s.begin();
  s.stroke(foot[0], foot[1], tip[0], tip[1], 0.6, FOE.staff[1]);
  s.shadeEdges(FOE.staff[1], FOE.staff[2], FOE.staff[0]);
  s.commit();
  const len = Math.hypot(tip[0] - foot[0], tip[1] - foot[1]);
  const ux = (tip[0] - foot[0]) / len;
  const uy = (tip[1] - foot[1]) / len;
  const cx = tip[0] + ux * 2.5;
  const cy = tip[1] + uy * 2.5;
  s.begin();
  s.poly(
    [
      [cx + ux * 3.5, cy + uy * 3.5],
      [cx - uy * 1.8, cy + ux * 1.8],
      [cx - ux * 2.5, cy - uy * 2.5],
      [cx + uy * 1.8, cy - ux * 1.8],
    ],
    glow > 0.5 ? C[3] : C[2],
  );
  s.shadeEdges(glow > 0.5 ? C[3] : C[2], C[4], C[1]);
  s.set(cx, cy, FOE.eyeHot);
  s.commit();
  s.begin();
  s.dot(hand[0], hand[1], 1.5, FOE.mask[1]);
  s.shadeEdges(FOE.mask[1], FOE.mask[2], FOE.mask[0]);
  s.commit();
}

function ward(s: SpriteCanvas, rise: number, time: number): void {
  const top = -34 * rise;
  const x = 13;
  const shimmer = Math.floor(time * 10) % 2;
  s.begin();
  const pts: Pt[] = [
    [x, top],
    [x + 3, top * 0.82],
    [x + 3, top * 0.2],
    [x, 0],
    [x - 2, top * 0.2],
    [x - 2, top * 0.82],
  ];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    s.hairline(a[0], a[1], b[0], b[1], i < 2 ? C[4] : C[3]);
  }
  for (let y = top + 2; y < -1; y += 1)
    for (let px = x - 1.5; px <= x + 2.5; px += 1)
      if ((Math.floor(y) + Math.floor(px) + shimmer) % 3 === 0) s.set(px, y, C[2]);
  s.hairline(x + 0.5, top + 2, x + 0.5, -2, C[4]);
  s.commit(false);
}

export function drawCryomancer(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const winding = e.state === "wind";
  const charge = winding ? clamp(e.st / CRYO.cast) : e.state === "shoot" ? 1 : 0;
  const sway = e.state === "walk" ? Math.sin(time * 4) * 0.8 : e.state === "shoot" ? 1.5 : 0;
  const lean = e.state === "shoot" ? 1.5 : winding ? -0.5 : 0;
  const bob = e.state === "walk" ? Math.round(Math.sin(time * 4) * 0.5 * 2) / 2 : 0;
  s.clear();
  s.shift(0, bob);
  robe(s, sway, lean);
  hood(s, lean, winding || e.state === "shoot");
  staff(s, e, charge);
  s.shift(0, 0);
  s.outline(FOE.outline);
  const shield = wardLeft(e);
  if (e.state === "summon") ward(s, clamp(e.st / CRYO.raise), time);
  else if (shield > 0 && (shield > 1 || Math.floor(time * 12) % 2 === 0)) ward(s, 1, time);
  return s;
}
