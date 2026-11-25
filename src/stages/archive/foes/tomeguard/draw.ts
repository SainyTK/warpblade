import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp, TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FOE } from "../colors";
import { letter } from "../letters";
import { TOMEGUARD_MOVES } from "./behavior";

const canvas = detailCanvas(56, 50, 28, 43);
const B = FOE.bronze;
const L = FOE.leather;
type Pt = [number, number];

interface Hold {
  at: Pt;
  tilt: number;
  open: number;
}

function holdOf(e: Enemy): Hold {
  const windup = waveScale(game.wave).windup;
  if (e.state === "wind") return { at: [8, -25], tilt: 0, open: clamp(e.st / (0.3 * windup)) };
  if (e.state === "shoot") return { at: [9, -26], tilt: 0, open: 1.25 };
  if (e.state === "charge") {
    const k = clamp(e.st / (TOMEGUARD_MOVES.bashWind * windup));
    return { at: [6 - 6 * k, -21 - 6 * k], tilt: -0.9 * k, open: 0 };
  }
  if (e.state === "swipe") return { at: [15, -17], tilt: 0.9, open: 0 };
  if (e.state === "recover") return { at: [6, -12], tilt: 0.5, open: 0 };
  return { at: [9, -19], tilt: 0, open: 0 };
}

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean): void {
  const tone = near ? B[2] : B[1];
  const knee: Pt = [(hip[0] + foot[0]) / 2 + 1, (hip[1] + foot[1]) / 2];
  s.begin();
  s.stroke(hip[0], hip[1], knee[0], knee[1], 2, tone);
  s.stroke(knee[0], knee[1], foot[0], foot[1] - 1.5, 1.6, tone);
  s.shadeEdges(tone, near ? B[3] : B[2], B[0], 2);
  s.commit();
  s.begin();
  s.dot(knee[0] + 0.5, knee[1], 1.6, near ? B[3] : B[2]);
  s.set(knee[0], knee[1] - 0.5, near ? FOE.bronzeLit : B[3]);
  s.poly(
    [
      [foot[0] - 2.4, foot[1] - 2.6],
      [foot[0] + 1.5, foot[1] - 2.6],
      [foot[0] + 4, foot[1]],
      [foot[0] - 2.6, foot[1]],
    ],
    near ? B[2] : B[1],
  );
  s.commit();
}

function closedBook(s: SpriteCanvas, h: Hold): void {
  const c = Math.cos(h.tilt);
  const n = Math.sin(h.tilt);
  const at = (u: number, v: number): Pt => [h.at[0] + u * c - v * n, h.at[1] + u * n + v * c];
  s.begin();
  s.poly([at(-2.5, -7), at(2.5, -7), at(2.5, 7), at(-2.5, 7)], L[2]);
  s.shadeEdges(L[2], L[3], L[0], 2);
  s.commit();
  s.begin();
  s.poly([at(-1.3, -6.2), at(1.6, -6.2), at(1.6, 6.2), at(-1.3, 6.2)], FOE.paper[3]);
  for (let v = -5.5; v <= 5.5; v += 1) s.hairline(...at(-1.1, v), ...at(1.4, v), FOE.paper[2]);
  s.commit();
  s.begin();
  for (const [u, v] of [
    [2.5, -7],
    [2.5, 6.5],
    [-2.5, -7],
    [-2.5, 6.5],
  ] as const) {
    const [x, y] = at(u, v);
    s.block(x - 0.5, y - 0.5, FOE.gilt);
  }
  const [gx, gy] = at(2.5, 0);
  s.dot(gx, gy, 1, FOE.gilt);
  s.set(gx, gy - 0.5, WHITE);
  s.commit();
}

function openBook(s: SpriteCanvas, h: Hold, time: number): void {
  const spread = 0.35 + 0.75 * Math.min(1, h.open);
  const hinge = h.at;
  for (const side of [-1, 1]) {
    const a = -Math.PI / 2 + side * spread;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const at = (u: number, v: number): Pt => [hinge[0] + dx * u - dy * v * side, hinge[1] + dy * u + dx * v * side];
    s.begin();
    s.poly([at(0, -0.6), at(9, -0.6), at(9, 1.2), at(0, 1.2)], L[2]);
    s.shadeEdges(L[2], L[3], L[0]);
    s.commit();
    s.begin();
    s.poly([at(0.5, -0.6), at(8.5, -0.6), at(8.5, -1.8), at(0.5, -1.8)], FOE.paper[4]);
    for (let u = 2; u < 8; u += 1.5) s.set(...at(u, -1.2), FOE.text);
    s.commit();
  }
  s.begin();
  const flutter = Math.sin(time * 30);
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i - 1) * 0.5 + flutter * 0.25;
    s.hairline(hinge[0], hinge[1] - 1, hinge[0] + Math.cos(a) * 8, hinge[1] - 1 + Math.sin(a) * 8, FOE.paper[3]);
  }
  s.commit();
  if (h.open > 0.5) {
    const k = clamp((h.open - 0.5) * 2);
    const cx = hinge[0];
    const cy = hinge[1] - 11;
    const r = 2 + k * 3.5;
    s.begin();
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU + time * 4;
      s.set(cx + Math.cos(a) * r, cy + Math.sin(a) * r, i % 3 ? FOE.glyph[3] : FOE.glyph[4]);
    }
    letter(s, cx - 0.5, cy - 0.5, Math.floor(time * 6), FOE.glyph[2], FOE.glyph[4]);
    s.commit(false);
  }
}

function helm(s: SpriteCanvas, bob: number, hot: boolean, time: number): void {
  const y = -33 + bob;
  s.begin();
  s.poly(
    [
      [-4.5, y + 7],
      [-5, y + 2],
      [-3, y - 1.5],
      [1, y - 2.5],
      [4.5, y - 0.5],
      [5.5, y + 3],
      [4.5, y + 7],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[0], 2);
  s.stroke(-3.5, y - 1.5, 3.5, y - 2.2, 0.6, B[3]);
  s.commit();
  s.begin();
  s.stroke(-1, y - 2.8, -4, y - 5.5 + Math.sin(time * 2) * 0.4, 0.8, L[2]);
  s.stroke(-4, y - 5.5 + Math.sin(time * 2) * 0.4, -6.5, y - 4 + Math.sin(time * 2 + 1) * 0.6, 0.6, L[1]);
  s.commit();
  s.begin();
  s.stroke(0.5, y + 2.5, 5, y + 2.5, 0.55, FOE.ink[0]);
  s.set(2.5, y + 2.5, hot ? FOE.eyeHot : FOE.eye);
  s.set(4, y + 2.5, hot ? FOE.eye : FOE.eyeDeep);
  for (let x = 1; x <= 4; x += 1.5) s.set(x, y + 4.5, FOE.ink[1]);
  s.commit(false);
}

export function drawTomeguard(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const walking = e.state === "walk" && Math.abs(e.vx) > 2;
  const stride = walking ? Math.sin(time * 5) * 2.2 : 0;
  const bob = walking ? -Math.abs(Math.cos(time * 5)) * 0.5 : e.state === "recover" ? 1 : 0;
  const hot = e.state === "wind" || e.state === "shoot" || e.state === "charge";
  const hold = holdOf(e);
  s.clear();
  s.begin();
  s.stroke(-4, -22 + bob, -6, -14 + bob, 1.6, B[1]);
  s.dot(-6, -13 + bob, 1.7, B[1]);
  s.commit();
  leg(s, [-2, -12 + bob], [-2 - stride, 0], false);
  s.begin();
  s.poly(
    [
      [-6, -14 + bob],
      [6, -14 + bob],
      [7, -7 + bob],
      [-7, -7 + bob],
    ],
    L[1],
  );
  s.shadeEdges(L[1], L[2], L[0]);
  s.hairline(0, -13 + bob, 0, -7.5 + bob, L[0]);
  s.commit();
  leg(s, [2, -12 + bob], [2 + stride, 0], true);
  s.begin();
  s.poly(
    [
      [-6.5, -26 + bob],
      [5.5, -27 + bob],
      [7, -20 + bob],
      [5, -13 + bob],
      [-5.5, -13 + bob],
      [-7, -20 + bob],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[0], 3);
  s.hairline(1, -26 + bob, 2, -14 + bob, B[3]);
  s.hairline(1.5, -26 + bob, 2.5, -14 + bob, B[1]);
  s.stroke(-5.5, -14.5 + bob, 5, -14.5 + bob, 0.6, B[1]);
  for (const [x, y] of [
    [-4.5, -24],
    [4, -24.5],
    [-4.5, -16],
    [3.5, -16],
  ] as const)
    s.set(x, y + bob, FOE.bronzeLit);
  s.set(-3, -21 + bob, FOE.verdigris);
  s.set(-2.5, -20.5 + bob, FOE.verdigris);
  s.set(-3, -19 + bob, FOE.verdigris);
  s.commit();
  s.begin();
  s.dot(0, -26.5 + bob, 2.6, FOE.ink[1]);
  s.taper(-5, -14 + bob, -5.5, -10 + Math.sin(time * 2.4) + bob, 0.6, 0.25, FOE.ink[2]);
  s.commit();
  helm(s, bob, hot, time);
  s.begin();
  s.dot(-1.5, -24.5 + bob, 3.6, B[2]);
  s.shadeEdges(B[2], FOE.bronzeLit, B[1], 2);
  s.stroke(-4.5, -23 + bob, 1.5, -22 + bob, 0.4, B[1]);
  s.commit();
  const hand: Pt = [hold.at[0] - 2.5, hold.at[1] + (hold.open > 0 ? 1 : 2)];
  s.begin();
  s.stroke(-1, -22 + bob, (hand[0] - 1) / 2, (hand[1] - 22 + bob) / 2 + 1, 1.5, B[2]);
  s.stroke((hand[0] - 1) / 2, (hand[1] - 22 + bob) / 2 + 1, hand[0], hand[1], 1.3, B[2]);
  s.shadeEdges(B[2], B[3], B[0]);
  s.commit();
  if (hold.open > 0) openBook(s, hold, time);
  else closedBook(s, hold);
  s.begin();
  s.dot(hand[0], hand[1], 1.5, B[3]);
  s.set(hand[0] - 0.5, hand[1] - 0.5, FOE.bronzeLit);
  s.commit();
  s.outline(FOE.outline);
  return s;
}
