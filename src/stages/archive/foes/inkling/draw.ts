import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { letter } from "../letters";
import { INKLING_HOP } from "./behavior";

const canvas = detailCanvas(40, 36, 20, 31);
const INK = FOE.ink;
const RIM = 18;

interface Blob {
  rx: number;
  ry: number;
  lift: number;
  lean: number;
  jitter: number;
}

function shapeOf(e: Enemy, time: number): Blob {
  if (e.state === "wind") {
    const k = clamp(e.st / (INKLING_HOP.wind * waveScale(game.wave).windup));
    return { rx: 7 + 2.6 * k, ry: 8 - 3 * k, lift: 0, lean: -0.15 * k, jitter: Math.sin(time * 70) * 0.35 * k };
  }
  if (e.state === "leap") {
    const rising = e.vy < 0;
    return { rx: rising ? 5.4 : 6.2, ry: rising ? 10.5 : 9.4, lift: 0, lean: rising ? 0.3 : 0.12, jitter: 0 };
  }
  if (e.state === "recover") {
    const k = clamp(e.st / INKLING_HOP.recover);
    const settle = k * k;
    return { rx: 11 - 4 * settle, ry: 3.2 + 4.8 * settle, lift: 0, lean: 0, jitter: 0 };
  }
  const beat = Math.max(0, Math.sin(time * 2.6 * Math.PI));
  return { rx: 7 + (1 - beat) * 0.5, ry: 7.6 + beat * 0.8, lift: beat * 1.5, lean: 0.08 * beat, jitter: 0 };
}

function outlineOf(b: Blob, time: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i <= RIM; i++) {
    const a = (Math.PI * i) / RIM;
    const ripple = Math.sin(a * 5 + time * 7) * 0.35;
    const up = Math.sin(a) * (b.ry + ripple);
    pts.push([Math.cos(a) * b.rx + b.lean * up + b.jitter, -b.lift - up]);
  }
  for (let i = 1; i < RIM; i++) {
    const u = -1 + (2 * i) / RIM;
    pts.push([u * b.rx + b.jitter, -b.lift + 0.9 * Math.sqrt(1 - u * u)]);
  }
  return pts;
}

function eyes(s: SpriteCanvas, b: Blob, e: Enemy): void {
  const y = -b.lift - b.ry * 0.58;
  const x = b.rx * 0.25 + b.lean * b.ry * 0.6 + b.jitter;
  const fierce = e.state === "wind" || e.state === "leap";
  if (e.state === "recover" || e.stun > 0) {
    s.hairline(x - 0.5, y + 0.5, x + 1.5, y + 0.5, FOE.eyeDeep);
    s.hairline(x + 2.5, y + 0.5, x + 4, y + 0.5, FOE.eyeDeep);
    return;
  }
  for (const [ex, r] of [
    [x, 1.15],
    [x + 3, 0.95],
  ] as const) {
    s.dot(ex, y, r + 0.35, INK[0]);
    s.dot(ex, y, r, fierce ? FOE.eye : FOE.eyeDeep);
    s.set(ex - 0.25, y - 0.5, fierce ? FOE.eyeHot : FOE.eye);
    s.set(ex + 0.25, y + 0.25, INK[0]);
  }
}

function mouth(s: SpriteCanvas, b: Blob, e: Enemy): void {
  if (e.state !== "wind" && e.state !== "leap") return;
  const y = -b.lift - b.ry * 0.28;
  const x0 = b.rx * 0.05 + b.jitter;
  const x1 = x0 + 5;
  s.stroke(x0, y, x1, y - 0.3, 0.7, INK[0]);
  for (let x = x0 + 0.5; x < x1; x += 1) s.set(x, y - 0.5, FOE.paper[4]);
  s.set(x0 + 2, y + 0.25, FOE.letter);
}

export function drawInkling(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const b = shapeOf(e, time);
  const hot = e.state === "wind" || e.state === "leap";
  s.clear();
  s.begin();
  const sway = Math.sin(time * 3) * 1.2;
  s.taper(b.jitter, -b.lift - b.ry + 1, -1.5 + sway, -b.lift - b.ry - 4.5, 1.1, 0.35, INK[2], 0.8);
  s.shadeEdges(INK[2], INK[4], INK[1]);
  s.commit();
  s.begin();
  s.poly(outlineOf(b, time), INK[2]);
  s.shadeEdges(INK[2], INK[3], INK[1], 2);
  s.commit(false);
  s.begin();
  s.dot(-b.rx * 0.2 + b.jitter, -b.lift - b.ry * 0.3, b.ry * 0.38, INK[1]);
  s.commit(false);
  for (let i = 0; i < 3; i++) {
    const lx = -b.rx * 0.45 + Math.sin(time * 1.3 + i * 2.1) * b.rx * 0.3 + b.jitter;
    const ly = -b.lift - b.ry * 0.35 + Math.cos(time * 1.1 + i * 2.7) * b.ry * 0.18;
    s.begin();
    letter(s, lx, ly, i + Math.floor(time * 0.7), hot ? FOE.letter : FOE.eyeDeep, hot ? FOE.letterHot : FOE.letter);
    s.commit(false);
  }
  s.begin();
  const sx = -b.rx * 0.5 + b.lean * b.ry * 0.7 + b.jitter;
  const sy = -b.lift - b.ry * 0.78;
  s.hairline(sx, sy + 1, sx + 1.5, sy, FOE.inkSheen);
  s.hairline(sx + 1.5, sy, sx + 3, sy - 0.25, FOE.inkSheen);
  s.set(sx + 0.5, sy, FOE.inkGlint);
  s.commit(false);
  s.begin();
  eyes(s, b, e);
  mouth(s, b, e);
  s.commit(false);
  s.begin();
  for (const side of [-1, 1]) {
    const drip = 1.6 + Math.sin(time * 2.2 + side) * 0.8;
    s.taper(side * b.rx * 0.72 + b.jitter, -b.lift, side * b.rx * 0.78 + b.jitter, -b.lift + drip, 0.75, 0.35, INK[2]);
  }
  if (e.state === "wind") {
    const rise = (time * 3) % 1;
    s.dot(b.rx * 0.4, -b.ry - 2 - rise * 5, 0.8, INK[3]);
    s.set(b.rx * 0.4 - 0.25, -b.ry - 2.5 - rise * 5, FOE.inkSheen);
  }
  s.commit(false);
  s.outline(FOE.outline);
  return s;
}
