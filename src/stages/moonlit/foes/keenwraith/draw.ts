import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { moonlight } from "../../../../game/enemies/night/moonlight";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { hurting } from "../strike";
import { drawTime, WRAITH } from "./pose";

const canvas = detailCanvas(44, 52, 22, 22);
const V = GRAVE.veil;
const C = GRAVE.cloth;

interface WraithPose {
  open: number;
  spread: number;
  trail: number;
  heat: number;
  limp: boolean;
}

function poseOf(e: Enemy): WraithPose {
  const limp = hurting(e);
  const trail = clamp((-e.vx * e.face) / 40, -1, 1);
  if (limp) return { open: 0.2, spread: -0.4, trail, heat: 0, limp };
  if (e.state === "wind") {
    const u = clamp(e.st / drawTime());
    return { open: u, spread: u, trail, heat: u, limp };
  }
  if (e.state === "beam") return { open: 1, spread: 1.3, trail: 1, heat: 1, limp };
  if (e.state === "recover") {
    const u = clamp(e.st / WRAITH.spent);
    return { open: 1 - u * 0.7, spread: -0.6 + u * 0.6, trail, heat: 0, limp };
  }
  return { open: 0, spread: 0, trail, heat: 0, limp };
}

function wisps(s: SpriteCanvas, p: WraithPose, time: number): void {
  s.begin();
  for (let k = 0; k < 5; k++) {
    const x0 = -5 + k * 2.4;
    const wave = Math.sin(time * 3.2 + k * 1.3);
    const x1 = x0 - 3 - p.trail * 6 + wave * 2;
    const y1 = 18 + (k % 2) * 4 - Math.abs(k - 2);
    s.taper(x0, 4, x1, y1, 2.4, 0.3, C[2], wave * 1.2);
  }
  s.shadeEdges(C[2], C[3], C[1]);
  s.commit(false);
}

function gown(s: SpriteCanvas, p: WraithPose): void {
  s.begin();
  s.poly(
    [
      [-5, -6],
      [4, -6.5],
      [6.5, 2],
      [5, 8],
      [-1, 9],
      [-6.5, 7],
      [-7, 0],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[1], 2);
  s.hairline(-2.5, -3, -3.5, 8, C[1]);
  s.hairline(1.5, -3, 2, 8, C[1]);
  s.commit();
  s.begin();
  const lift = p.open * 3;
  s.poly(
    [
      [-6, -9 - lift * 0.3],
      [-3.5, -14 - lift],
      [1.5, -15 - lift],
      [5.5, -11 - lift * 0.6],
      [6.5, -5 + lift * 0.4],
      [4.5, 3],
      [0, -2 + lift * 0.5],
      [-5, 4],
      [-8, 0],
    ],
    V[1],
  );
  s.shadeEdges(V[1], V[2], V[0], 2);
  s.hairline(-4, -10 - lift * 0.7, -6.5, 1, V[0]);
  s.hairline(-1, -12 - lift, -3, 2, V[0]);
  s.commit();
}

function face(s: SpriteCanvas, p: WraithPose): void {
  const lift = p.open * 3;
  s.begin();
  s.dot(2.8, -7 - lift * 0.2, 3 + p.open * 0.4, GRAVE.hollow);
  s.commit(false);
  s.begin();
  s.dot(3.2, -7.4 - lift * 0.2, 2, V[2]);
  s.shadeEdges(V[2], V[3], V[0]);
  const eye = p.limp ? V[0] : p.heat > 0.4 ? GRAVE.moon[4] : V[3];
  s.block(2.4, -8.6 - lift * 0.2, GRAVE.hollow, 0.8, 1.2);
  s.block(4, -8.6 - lift * 0.2, GRAVE.hollow, 0.8, 1.2);
  s.set(2.6, -8.2 - lift * 0.2, eye);
  s.set(4.2, -8.2 - lift * 0.2, eye);
  const mouth = 0.6 + p.open * 2.4;
  s.block(2.8, -6.6 - lift * 0.2, GRAVE.hollow, 1.4, mouth);
  if (p.heat > 0.3) s.block(3.1, -6.2 - lift * 0.2, p.heat > 0.8 ? GRAVE.moon[4] : GRAVE.moon[2], 0.8, mouth - 0.8);
  s.commit(false);
}

function arms(s: SpriteCanvas, p: WraithPose, time: number): void {
  const reach = p.spread;
  const sway = Math.sin(time * 2.2) * 0.6;
  s.begin();
  s.taper(3, -2, 9 + reach * 2, 1 - reach * 6 + sway, 1.2, 0.5, C[3]);
  s.taper(-4, -2, -9 - reach * 2, 2 - reach * 6 - sway, 1.2, 0.5, C[2]);
  s.shadeEdges(C[3], V[0], C[1]);
  s.commit();
  s.begin();
  for (const [hx, hy, dir] of [
    [9 + reach * 2, 1 - reach * 6 + sway, 1],
    [-9 - reach * 2, 2 - reach * 6 - sway, -1],
  ] as const) {
    for (let f = -1; f <= 1; f++) s.hairline(hx, hy, hx + dir * 2.2, hy + f * 1.4 + 1, V[2]);
  }
  s.commit(false);
}

export function drawKeenwraith(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e);
  s.clear();
  wisps(s, p, time);
  arms(s, p, time);
  gown(s, p);
  face(s, p);
  moonlight(s, true);
  s.outline(GRAVE.outline);
  return s;
}
