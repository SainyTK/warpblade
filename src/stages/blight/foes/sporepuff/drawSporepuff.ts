import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp, TAU } from "../../../../utils/math";
import { BLIGHT } from "../../colors";
import { PUFF, swellTime } from "./sporepuff";

const canvas = detailCanvas(34, 40, 17, 17);
const P = BLIGHT.puff;
const PORES = 7;
const TENDRILS = 4;

function sizeOf(e: Enemy): number {
  if (e.state === "wind") return lerp(5.6, 8, clamp(e.st / swellTime(e)));
  if (e.state === "recover") return lerp(3.4, 5.6, clamp((e.st - PUFF.spent * 0.5) / (PUFF.spent * 0.5)));
  return 5.6;
}

function tendrils(s: SpriteCanvas, r: number, time: number, spent: boolean): void {
  s.begin();
  for (let i = 0; i < TENDRILS; i++) {
    const x0 = (i - (TENDRILS - 1) / 2) * r * 0.42;
    const y0 = r * 0.55;
    const len = (spent ? 4 : 6) + (i % 2) * 2.5;
    let px = x0;
    let py = y0;
    for (let k = 1; k <= 4; k++) {
      const u = k / 4;
      const nx = x0 + Math.sin(time * 3 + i * 1.7 + u * 3) * 1.4 * u;
      const ny = y0 + len * u;
      s.hairline(px, py, nx, ny, k < 3 ? P[1] : BLIGHT.rot[3]);
      px = nx;
      py = ny;
    }
    s.set(px, py, BLIGHT.spore[3]);
  }
  s.commit(false);
}

const WARTS: readonly (readonly [number, number, number])[] = [
  [-0.45, -0.55, 0.9],
  [0.15, -0.75, 0.7],
  [0.55, -0.35, 0.6],
  [-0.7, -0.05, 0.6],
  [-0.15, -0.3, 0.5],
];

function cap(s: SpriteCanvas, r: number, wob: number, spent: boolean): void {
  s.begin();
  s.dot(0, 0, r, P[1]);
  s.dot(-r * 0.12, -r * 0.18, r * 0.82, P[2]);
  s.shadeEdges(P[1], P[2], P[0], 2);
  s.commit();
  s.begin();
  s.dot(-r * 0.38, -r * 0.48, r * 0.26, P[3]);
  s.set(-r * 0.45, -r * 0.6, P[4]);
  s.commit(false);
  s.begin();
  for (const [u, v, k] of WARTS) {
    const x = u * r;
    const y = v * r;
    s.block(x - k * 0.5, y - k * 0.5, P[0], k);
    s.set(x - k * 0.5, y - k * 0.5, P[3]);
  }
  s.commit(false);
  s.begin();
  const band = r * 0.42;
  for (let x = -r + 0.8; x <= r - 0.8; x += 0.5) {
    const y = band + Math.sin(x * 1.6 + wob) * 0.4;
    if (x * x + y * y < (r - 0.3) ** 2) {
      s.set(x, y, BLIGHT.rot[2]);
      s.set(x, y + 0.5, BLIGHT.rot[1]);
    }
  }
  if (spent)
    for (let i = 0; i < 4; i++) {
      const a = -2.4 + i * 0.6;
      s.hairline(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3, Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85, P[0]);
    }
  s.commit(false);
}

function pores(s: SpriteCanvas, r: number, time: number, charge: number): void {
  s.begin();
  for (let i = 0; i < PORES; i++) {
    const x = -r * 0.75 + (i / (PORES - 1)) * r * 1.5;
    const y = r * 0.42 + 1 + Math.sin(x * 1.6) * 0.4;
    if (x * x + y * y > (r - 0.2) ** 2) continue;
    const lit = charge > 0.4 || Math.sin(time * 4 + i * 2) > 0.3;
    s.block(x - 0.5, y - 0.5, lit ? BLIGHT.spore[3] : BLIGHT.spore[1], 1, 0.5 + charge * 0.5);
  }
  s.commit(false);
}

function eye(s: SpriteCanvas, r: number, charge: number, spent: boolean): void {
  s.begin();
  const ex = r * 0.34;
  const ey = r * 0.02;
  if (spent) {
    s.hairline(ex - 1.2, ey, ex + 1.2, ey + 0.4, P[0]);
  } else {
    const open = 1.5 + charge;
    s.block(ex - 1.5, ey - open * 0.5 - 0.5, P[0], 3, open + 1);
    s.block(ex - 1, ey - open * 0.5, charge > 0.5 ? BLIGHT.eyeHot : BLIGHT.eye, 2, open);
    s.block(ex - 0.25, ey - open * 0.5, P[0], 0.5, open);
    s.set(ex - 1, ey - open * 0.5, BLIGHT.eyeHot);
  }
  s.hairline(ex - 0.5, ey + 2.2, ex + 1.6, ey + 2.5 + charge, P[0]);
  s.commit(false);
}

export function drawSporepuff(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const r = sizeOf(e);
  const spent = e.state === "recover" && e.st < PUFF.spent * 0.6;
  const charge = e.state === "wind" ? clamp(e.st / swellTime(e)) : 0;
  const shiver = charge > 0 ? Math.sin(time * 60) * charge * 0.5 : 0;
  const wob = time * 2;
  s.clear();
  s.shift(shiver, Math.sin(time * TAU * 0.4) * 0.4);
  tendrils(s, r, time, spent);
  cap(s, r, wob, spent);
  pores(s, r, time, charge);
  eye(s, r, charge, spent);
  s.outline(BLIGHT.outline);
  return s;
}
