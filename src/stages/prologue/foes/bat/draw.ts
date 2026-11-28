import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { glowEye } from "../../../../game/enemies/day/paint";
import type { Enemy } from "../../../../types/enemy";
import { BAT_COLORS as C } from "./colors";
import { type BatPose, batPose } from "./pose";

const canvas = detailCanvas(36, 32, 18, 16);
type Pt = readonly [number, number];
const SHOULDER: Pt = [1.6, -0.6];
const WING: readonly Pt[] = [
  [0, -0.6],
  [3, -1.8],
  [6, -2.6],
  [11, -1],
  [9.5, 2],
  [8, 1.2],
  [6.5, 3],
  [4.6, 2],
  [3, 3.2],
  [0, 2],
];
const FINGERS: readonly Pt[] = [
  [11, -1],
  [9.5, 2],
  [6.5, 3],
];
const WRIST: Pt = [6, -2.6];
const M = C.membrane;
const F = C.fur;

function wingPoint(p: BatPose, side: number, [u, v]: Pt): [number, number] {
  const a = p.flap * 0.75;
  const su = u * p.spread;
  return [side * (SHOULDER[0] + su * Math.cos(a) + v * Math.sin(a)), SHOULDER[1] - su * Math.sin(a) + v * Math.cos(a)];
}

function wing(s: SpriteCanvas, p: BatPose, side: number): void {
  s.begin();
  s.poly(
    WING.map((q) => wingPoint(p, side, q)),
    M[2],
  );
  s.shadeEdges(M[2], M[3], M[1]);
  const [sx, sy] = wingPoint(p, side, WING[0]);
  const [wx, wy] = wingPoint(p, side, WRIST);
  s.hairline(sx, sy, wx, wy, C.bone);
  for (const finger of FINGERS) {
    const [fx, fy] = wingPoint(p, side, finger);
    s.hairline(wx, wy, fx, fy, M[0]);
  }
  s.set(wx, wy - 0.5, F[3]);
  s.commit();
}

function ears(s: SpriteCanvas, hurt: boolean): void {
  const droop = hurt ? 1.5 : 0;
  s.begin();
  s.poly(
    [
      [-0.8, -3.8],
      [-2.4 - droop, -7.6 + droop * 2],
      [0.6, -4.6],
    ],
    C.ear[1],
  );
  s.poly(
    [
      [1.6, -4.4],
      [3.4 + droop, -7.8 + droop * 2],
      [3.2, -3.8],
    ],
    C.ear[2],
  );
  s.shadeEdges(C.ear[2], C.ear[3], C.ear[0]);
  s.hairline(-0.4, -4.2, -1.8 - droop, -6.8 + droop * 2, C.ear[0]);
  s.hairline(2.4, -4.4, 3.2 + droop, -7 + droop * 2, C.ear[1]);
  s.commit();
}

function body(s: SpriteCanvas, p: BatPose, time: number): void {
  s.begin();
  s.dot(0.4, 0.6, 2.7, F[2]);
  s.dot(1, -2.6, 2.1, F[2]);
  s.shadeEdges(F[2], F[3], F[1], 2);
  s.set(-0.2, -4.2, C.furGlint);
  s.commit();
  s.begin();
  s.dot(0.9, 1.2, 1.5, C.belly);
  s.shadeEdges(C.belly, C.bellyLit, C.bellyDark);
  s.commit();
  s.begin();
  s.hairline(-0.6, 3, -0.8, 4, F[0]);
  s.hairline(1.4, 3, 1.6, 4, F[0]);
  s.commit(false);
  s.begin();
  const hot = p.glare > 0.5;
  if (p.hurt) {
    s.hairline(0, -3.2, 0.8, -2.6, F[0]);
    s.hairline(2, -2.6, 2.8, -3.2, F[0]);
  } else {
    const blink = Math.floor(time * 2.3) % 7 === 0;
    const glow = hot ? C.eyeHot : C.eye;
    if (!blink) {
      glowEye(s, 0, -3.2, p.glare > 0 ? C.eye : C.eyeDim, glow);
      glowEye(s, 2, -3.2, p.glare > 0 ? C.eye : C.eyeDim, glow);
    }
  }
  s.set(1, -1.3, C.fang);
  s.set(2, -1.3, C.fang);
  if (hot) s.block(1, -1.4, C.fang, 1.5, 1);
  s.commit(false);
}

export function drawBat(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = batPose(e, t);
  s.clear();
  wing(s, p, -1);
  wing(s, p, 1);
  ears(s, p.hurt);
  body(s, p, time);
  s.outline(C.outline);
  return s;
}
