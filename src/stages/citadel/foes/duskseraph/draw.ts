import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { AC, VOID } from "../../../../game/enemies/abyss/colors";
import { glowEye, type Pt, sunRim } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { CITADEL_FOE, ECLIPSE } from "../colors";
import { SERAPH } from "./constants";

const canvas = detailCanvas(72, 64, 36, 32);
const WING = CITADEL_FOE.wing;
const B = CITADEL_FOE.bone;
const T = CITADEL_FOE.tabard;

interface SeraphPose {
  spread: number;
  beat: number;
  hand: Pt;
  halo: number;
  hot: boolean;
  bow: number;
}

function poseOf(e: Enemy, time: number): SeraphPose {
  const beat = Math.sin(time * 3.2);
  if (e.state === "wind") {
    const u = clamp(e.st / SERAPH.wind);
    return { spread: 1 + u * 0.3, beat: -0.6, hand: [9, -6 - u * 2], halo: u, hot: u > 0.6, bow: 0 };
  }
  if (e.state === "shoot") return { spread: 1.2, beat: 0.6, hand: [11, -3], halo: 1, hot: true, bow: 0 };
  if (e.state === "summon") {
    const u = clamp(e.st / SERAPH.shroudWind);
    return { spread: 0.9 + u * 0.4, beat: -0.9, hand: [4, -18 - u * 2], halo: u, hot: u > 0.5, bow: -1 };
  }
  if (e.state === "recover") return { spread: 0.35, beat: 0.8, hand: [5, 0], halo: 0, hot: false, bow: 2 };
  return { spread: 1, beat, hand: [6, -3], halo: 0.15, hot: false, bow: 0 };
}

function wing(s: SpriteCanvas, root: Pt, p: SeraphPose, far: boolean, upper: boolean): void {
  const k = (far ? 0.82 : 1) * p.spread;
  const lift = (upper ? -10 : 4) + p.beat * (upper ? 5 : 3);
  const base = far ? WING[1] : WING[2];
  const tip: Pt = [root[0] - (upper ? 16 : 13) * k, root[1] + lift * k];
  const elbow: Pt = [root[0] - 7 * k, root[1] + lift * 0.6 * k - 3];
  const pts: Pt[] = [root, elbow, tip];
  const feathers = upper ? 4 : 3;
  for (let i = 1; i <= feathers; i++) {
    const u = i / feathers;
    const fx = tip[0] + (root[0] - 2 - tip[0]) * u;
    const fy = tip[1] + (root[1] + 6 - tip[1]) * u + (upper ? 4 : 2);
    pts.push([fx - 1.5, fy + 3]);
    pts.push([fx + 1.5, fy]);
  }
  s.begin();
  s.poly(pts, base);
  s.shadeEdges(base, far ? WING[2] : WING[3], WING[0], 2);
  s.hairline(root[0], root[1], elbow[0], elbow[1], B[far ? 0 : 1]);
  s.hairline(elbow[0], elbow[1], tip[0], tip[1], B[far ? 0 : 1]);
  s.commit();
}

function halo(s: SpriteCanvas, x: number, y: number, p: SeraphPose, time: number): void {
  const r = 7 + p.halo * 1.5;
  s.begin();
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + time * 0.8;
    const len = r + 2 + (i % 2) * 2 + p.halo * 2;
    s.hairline(
      x + Math.cos(a) * (r - 0.5),
      y + Math.sin(a) * (r - 0.5),
      x + Math.cos(a) * len,
      y + Math.sin(a) * len,
      ECLIPSE[i % 2 ? 2 : 3],
    );
  }
  s.commit(false);
  s.begin();
  s.dot(x, y, r, p.hot ? ECLIPSE[4] : ECLIPSE[3]);
  s.dot(x + 0.6, y - 0.2, r - 1.2, AC.bodyDeep);
  s.set(x - r + 0.5, y - 2, ECLIPSE[5]);
  s.set(x - r + 1.5, y - 4, ECLIPSE[5]);
  s.commit(false);
}

function robe(s: SpriteCanvas, p: SeraphPose, time: number): void {
  const sway = Math.sin(time * 2.4) * 1.5;
  s.begin();
  s.poly(
    [
      [-4, -14],
      [5, -14],
      [6.5, -2],
      [4 + sway * 0.5, 8],
      [1 + sway, 18],
      [-1 + sway * 0.6, 12],
      [-3.5 + sway * 0.3, 16],
      [-5, 4],
      [-6, -4],
    ],
    T[2],
  );
  s.shadeEdges(T[2], T[3], T[0], 2);
  s.hairline(0, -12, sway * 0.6, 12, T[1]);
  s.hairline(-3, -10, -3 + sway * 0.3, 10, T[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-4.5, -20 + p.bow],
      [5, -20 + p.bow],
      [6, -13],
      [-5, -13],
    ],
    WING[2],
  );
  s.shadeEdges(WING[2], WING[3], WING[0]);
  s.hairline(-4, -14, 5.5, -14, ECLIPSE[2]);
  s.dot(0.5, -17 + p.bow, 1.1, p.hot ? VOID[4] : VOID[2]);
  s.commit();
}

function head(s: SpriteCanvas, p: SeraphPose): void {
  const hx = 1.5;
  const hy = -24 + p.bow;
  s.begin();
  s.poly(
    [
      [hx - 3.5, hy + 4],
      [hx - 4, hy - 1.5],
      [hx - 1.5, hy - 4.5],
      [hx + 2.5, hy - 4],
      [hx + 4, hy],
      [hx + 3, hy + 4],
    ],
    B[1],
  );
  s.shadeEdges(B[1], B[3], B[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 4.5, hy + 4.5],
      [hx - 5, hy - 2],
      [hx - 2, hy - 5.5],
      [hx - 2.5, hy - 1],
      [hx - 2, hy + 5],
    ],
    WING[1],
  );
  s.shadeEdges(WING[1], WING[2], WING[0]);
  s.hairline(hx + 0.5, hy + 1.5, hx + 3.5, hy + 1.5, B[0]);
  s.commit();
  glowEye(s, hx + 2.6, hy - 0.8, p.hot ? AC.eyeHot : AC.eye, p.hot ? AC.eye : AC.eyeDim, AC.eyeHot);
  s.begin();
  s.hairline(hx + 2.5, hy + 0.3, hx + 2.2, hy + 4, VOID[3]);
  s.commit(false);
}

function arm(s: SpriteCanvas, p: SeraphPose): void {
  const shoulder: Pt = [3, -18 + p.bow];
  const [hx, hy] = p.hand;
  s.begin();
  s.taper(shoulder[0], shoulder[1], hx, hy, 1.4, 0.9, B[1]);
  s.shadeEdges(B[1], B[2], B[0]);
  s.commit();
  s.begin();
  s.dot(hx + 0.5, hy, 1.4 + p.halo * 0.8, p.hot ? VOID[4] : VOID[3]);
  s.set(hx, hy - 0.5, VOID[5]);
  s.commit(false);
}

export function drawDuskseraph(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const bob = e.state === "drift" ? Math.round(Math.sin(time * 1.8) * 1.2) : 0;
  s.clear();
  s.shift(0, bob);
  halo(s, -1, -26 + p.bow, p, time);
  wing(s, [-1, -17 + p.bow], p, true, true);
  wing(s, [-1, -13 + p.bow], p, true, false);
  robe(s, p, time);
  head(s, p);
  wing(s, [-3, -16 + p.bow], p, false, true);
  wing(s, [-3, -12 + p.bow], p, false, false);
  arm(s, p);
  s.shift(0, 0);
  sunRim(s, AC.rim, AC.rimSoft, 0.35);
  s.outline(AC.outline);
  return s;
}
