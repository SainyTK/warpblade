import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { BLOOM_TIMES } from "./spitbloom";

const canvas = detailCanvas(52, 46, 24, 42);
const PE = BLIGHT.petal;
const ST = BLIGHT.stem;
type Pt = readonly [number, number];

interface Pose {
  head: Pt;
  bulb: number;
  open: number;
  tilt: number;
  charge: number;
}

function poseOf(e: Enemy, time: number): Pose {
  const windup = waveScale(game.wave).windup;
  const sway = Math.sin(time * 1.6) * 1.2;
  const idle: Pose = { head: [3 + sway, -21], bulb: 5.2, open: 0.25 + Math.sin(time * 2.3) * 0.15, tilt: 0, charge: 0 };
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / (BLOOM_TIMES.swell * windup)));
    return { head: [lerp(3, -1, k), lerp(-21, -23, k)], bulb: lerp(5.2, 7, k), open: 0, tilt: -0.35 * k, charge: k };
  }
  if (e.state === "shoot") {
    const k = clamp(e.st / BLOOM_TIMES.spit);
    return {
      head: [lerp(7, 4, k), -20],
      bulb: lerp(4.8, 5.2, k),
      open: lerp(1, 0.4, k),
      tilt: 0.25 * (1 - k),
      charge: 0,
    };
  }
  if (e.state === "charge") {
    const k = ease.outCubic(clamp(e.st / (BLOOM_TIMES.gape * windup)));
    return {
      head: [lerp(3, -3, k), lerp(-21, -27, k)],
      bulb: 5.6,
      open: lerp(0.3, 1.25, k),
      tilt: -0.5 * k,
      charge: 0,
    };
  }
  if (e.state === "swipe") {
    const k = clamp(e.st / BLOOM_TIMES.bite);
    return {
      head: [lerp(15, 11, k), lerp(-10, -13, k)],
      bulb: 5.6,
      open: k < 0.4 ? 0.1 : 0.1 + k * 0.3,
      tilt: 0.7,
      charge: 0,
    };
  }
  if (e.state === "recover") {
    const k = clamp(e.st / BLOOM_TIMES.rest);
    return { ...idle, head: [lerp(9, idle.head[0], k), lerp(-15, idle.head[1], k)], tilt: 0.3 * (1 - k) };
  }
  return idle;
}

function roots(s: SpriteCanvas): void {
  s.begin();
  const spread: readonly (readonly [number, number, number])[] = [
    [-11, 0.4, 1.2],
    [-6, -0.2, 1.4],
    [7, -0.1, 1.4],
    [12, 0.5, 1.1],
  ];
  for (const [x, y, r] of spread) s.taper(0, -2, x, y, 2.2, r * 0.4, BLIGHT.bark[2], x < 0 ? -1 : 1);
  s.dot(0, -1.8, 3, BLIGHT.bark[2]);
  s.shadeEdges(BLIGHT.bark[2], BLIGHT.bark[4], BLIGHT.bark[1], 2);
  s.commit();
}

function leaf(s: SpriteCanvas, x0: number, y0: number, x1: number, y1: number, droop: number): void {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2 - droop;
  const nx = (y1 - y0) * 0.22;
  const ny = (x0 - x1) * 0.22;
  s.poly(
    [
      [x0, y0],
      [mx + nx, my + ny],
      [x1, y1],
      [mx - nx * 0.5, my - ny * 0.5 + 1],
    ],
    BLIGHT.rot[2],
  );
}

function leaves(s: SpriteCanvas, time: number): void {
  const flutter = Math.sin(time * 2) * 0.4;
  s.begin();
  leaf(s, -1, -3, -13, -6 + flutter, 2);
  leaf(s, 1, -3, 12, -7 - flutter, 2.4);
  leaf(s, -1, -5, -8, -12 + flutter, 1);
  s.shadeEdges(BLIGHT.rot[2], BLIGHT.rot[3], BLIGHT.rot[1], 2);
  s.hairline(-1, -3, -12, -6 + flutter, BLIGHT.rot[1]);
  s.hairline(1, -3, 11, -7 - flutter, BLIGHT.rot[1]);
  s.set(-10, -6.5 + flutter, BLIGHT.rot[4]);
  s.set(9, -8.5 - flutter, BLIGHT.rot[4]);
  s.commit();
}

function stem(s: SpriteCanvas, head: Pt): void {
  const bend: Pt = [lerp(0, head[0], 0.15) - 3, lerp(-3, head[1], 0.55)];
  s.begin();
  const n = 8;
  for (let i = 0; i < n; i++) {
    const u0 = i / n;
    const u1 = (i + 1) / n;
    const at = (u: number): Pt => [
      (1 - u) ** 2 * 0 + 2 * (1 - u) * u * bend[0] + u * u * head[0],
      (1 - u) ** 2 * -3 + 2 * (1 - u) * u * bend[1] + u * u * head[1],
    ];
    const a = at(u0);
    const b = at(u1);
    s.stroke(a[0], a[1], b[0], b[1], lerp(1.9, 1.2, u0), ST[2]);
  }
  s.shadeEdges(ST[2], ST[3], ST[1], 1);
  for (let i = 1; i < 4; i++) {
    const u = i / 4;
    const x = 2 * (1 - u) * u * bend[0] + u * u * head[0];
    const y = (1 - u) ** 2 * -3 + 2 * (1 - u) * u * bend[1] + u * u * head[1];
    s.set(x - 1.2, y, ST[0]);
    s.set(x + 1, y + 0.5, BLIGHT.petal[2]);
  }
  s.commit();
}

function frill(s: SpriteCanvas, p: Pose): void {
  const [hx, hy] = p.head;
  s.begin();
  for (let i = 0; i < 5; i++) {
    const a = Math.PI * 0.55 + i * 0.42 + p.tilt;
    const len = p.bulb + 3.2 + (i % 2) * 1.2;
    s.taper(hx - 1, hy, hx - 1 + Math.cos(a) * len, hy - Math.sin(a) * len * 0.9, 1.5, 0.3, PE[3], i % 2 ? 0.6 : -0.6);
  }
  s.shadeEdges(PE[3], PE[4], PE[1]);
  s.commit();
}

function head(s: SpriteCanvas, p: Pose, time: number, fierce: boolean): void {
  const [hx, hy] = p.head;
  const r = p.bulb;
  const c = Math.cos(p.tilt);
  const sn = Math.sin(p.tilt);
  const rot = (x: number, y: number): Pt => [hx + x * c - y * sn, hy + x * sn + y * c];
  s.begin();
  s.dot(hx, hy, r, PE[2]);
  s.shadeEdges(PE[2], PE[3], PE[1], 2);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const a = -2.2 + i * 0.55;
    const [x0, y0] = rot(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2);
    const [x1, y1] = rot(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9);
    s.hairline(x0, y0, x1, y1, PE[1]);
  }
  if (p.charge > 0) {
    const [gx, gy] = rot(-r * 0.25, r * 0.1);
    s.dot(gx, gy, r * 0.45 * p.charge + 0.5, BLIGHT.poison[3]);
    s.dot(gx - 0.4, gy - 0.4, r * 0.2 * p.charge + 0.3, BLIGHT.poison[4]);
  }
  for (let i = 0; i < 3; i++) {
    const [sx, sy] = rot(-r * 0.4 + i * 1.4, -r * 0.55 + (i % 2) * 0.8);
    s.set(sx, sy, BLIGHT.spore[2]);
  }
  s.commit(false);
  const gape = p.open * 3.2;
  s.begin();
  const lip: Pt[] = [
    rot(r * 0.25, -0.4),
    rot(r + 3.2, -1.2 - gape),
    rot(r + 3.5, 0.2),
    rot(r + 3.2, 1.2 + gape * 0.7),
    rot(r * 0.25, 0.6),
  ];
  s.poly(lip, BLIGHT.maw);
  s.commit(false);
  s.begin();
  const upper: Pt[] = [
    rot(r * 0.1, -r * 0.65),
    rot(r + 3.6, -1.4 - gape),
    rot(r + 3.4, -0.3 - gape),
    rot(r * 0.4, -0.4),
  ];
  const lower: Pt[] = [
    rot(r * 0.4, 0.8),
    rot(r + 3.2, 0.9 + gape * 0.7),
    rot(r + 2.6, 2 + gape * 0.7),
    rot(r * 0.1, r * 0.6),
  ];
  s.poly(upper, PE[3]);
  s.poly(lower, PE[2]);
  s.shadeEdges(PE[3], PE[4], PE[2]);
  s.commit();
  s.begin();
  for (let i = 0; i < 4; i++) {
    const u = 0.35 + i * 0.2;
    const [ux, uy] = rot(lerp(r * 0.4, r + 3.4, u), lerp(-0.4, -0.3 - gape, u) + 0.5);
    const [lx, ly] = rot(lerp(r * 0.4, r + 3, u), lerp(0.8, 0.9 + gape * 0.7, u) - 0.5);
    s.set(ux, uy, BLIGHT.tooth);
    s.set(lx, ly, BLIGHT.tooth);
  }
  if (p.open > 0.6) {
    const [tx, ty] = rot(r + 1, 0.2);
    s.set(tx, ty, BLIGHT.poison[3]);
    s.set(tx + 0.5, ty, BLIGHT.poison[4]);
  }
  const [ex, ey] = rot(r * 0.35, -r * 0.42);
  s.block(ex - 0.5, ey - 0.5, fierce ? BLIGHT.eyeHot : BLIGHT.eye, 1);
  s.set(ex - 0.5, ey - 0.5, BLIGHT.eyeHot);
  const drip = (time * 0.9) % 1;
  if (p.open > 0.2 && drip < 0.7) {
    const [dx, dy] = rot(r + 2.4, 1.4 + gape * 0.7);
    s.block(dx, dy + drip * 3, BLIGHT.poison[3], 0.5, 1);
  }
  s.commit(false);
}

export function drawSpitbloom(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const fierce = e.state === "wind" || e.state === "charge";
  s.clear();
  roots(s);
  stem(s, p.head);
  leaves(s, time);
  frill(s, p);
  head(s, p, time, fierce);
  s.outline(BLIGHT.outline);
  return s;
}
