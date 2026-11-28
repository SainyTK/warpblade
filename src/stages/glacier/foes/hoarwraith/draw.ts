import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { facet, type Pt, shardPoints } from "../shapes";
import { WRAITH_COLORS } from "./colors";
import { type WraithPose, wraithPose } from "./pose";

const canvas = detailCanvas(46, 52, 23, 26);
const S = WRAITH_COLORS.shroud;
const B = WRAITH_COLORS.bone;
const C = FOE.crystal;

function shroud(s: SpriteCanvas, p: WraithPose): void {
  const y = p.bob;
  const l = p.lean;
  const hem: Pt[] = [];
  for (let i = 0; i <= 6; i++) {
    const x = 6 - i * 2.4 - l * 1.2;
    const len = 18 + ((i * 7) % 4) + Math.sin(p.trail + i * 1.3) * 2;
    hem.push([x + Math.sin(p.trail * 0.8 + i) * 1.2, len + y]);
    if (i < 6) hem.push([x - 1.2, 13 + y + Math.sin(p.trail + i) * 0.8]);
  }
  s.begin();
  s.poly(
    [
      [-4 + l * 0.3, -12 + y],
      [5 + l * 0.6, -12 + y],
      [9 + l * 0.2, -2 + y],
      [8 - l * 0.6, 12 + y],
      ...hem,
      [-9 - l, 12 + y],
      [-8 - l * 0.4, -2 + y],
    ],
    S[2],
  );
  s.poly(
    [
      [1 + l * 0.5, -8 + y],
      [5 + l * 0.5, -6 + y],
      [6 - l * 0.4, 12 + y],
      [0 - l, 15 + y],
      [-3 - l, 12 + y],
    ],
    S[1],
  );
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.hairline(1 + l * 0.4, -6 + y, -1 - l, 14 + y, S[0]);
  s.hairline(5 + l * 0.4, -4 + y, 5 - l * 0.6, 12 + y, S[0]);
  s.hairline(-4 + l * 0.2, -8 + y, -6 - l, 10 + y, S[3]);
  s.hairline(-7 - l * 0.4, -1 + y, -8 - l, 11 + y, S[4]);
  s.commit();
}

function hood(s: SpriteCanvas, p: WraithPose): void {
  const y = p.bob;
  const hx = 2 + p.lean;
  s.begin();
  s.dot(hx, -14 + y, 6.2, S[2]);
  s.poly(
    [
      [hx - 5, -17 + y],
      [hx - 9, -23 + y],
      [hx - 2, -19.5 + y],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.commit();
  s.begin();
  s.dot(hx + 2.5, -13.5 + y, 3.8, WRAITH_COLORS.hollow);
  s.commit();
  const eye = p.glare > 0.5 ? FOE.eyeHot : WRAITH_COLORS.eye;
  s.begin();
  s.block(hx + 1.5, -15 + y, eye, 1, 1);
  s.block(hx + 4, -15 + y, eye, 1, 1);
  if (p.mouth > 0.1) s.block(hx + 2.5, -12.5 + y, WRAITH_COLORS.eye, 1.5, Math.max(0.5, p.mouth * 2.5));
  s.commit(false);
  for (const [dx, len, a] of [
    [-3, 5, -2.2],
    [0, 6.5, -1.75],
    [3, 5, -1.3],
  ] as const)
    facet(s, shardPoints(hx + dx, -19 + y, len, a, 1.2), C[1], C[4], C[0]);
}

function arm(s: SpriteCanvas, p: WraithPose, hand: Pt, near: boolean): void {
  const y = p.bob;
  const shoulder: Pt = near ? [5 + p.lean, -7 + y] : [-3 + p.lean, -7 + y];
  const hx = hand[0] + p.lean;
  const hy = hand[1] + y;
  const elbow: Pt = [(shoulder[0] + hx) / 2 + (near ? 2 : -2), (shoulder[1] + hy) / 2 + 2];
  const tone = near ? B[1] : B[0];
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], near ? 1.6 : 1.3, near ? S[3] : S[2]);
  s.stroke(elbow[0], elbow[1], hx, hy, 0.7, tone);
  s.shadeEdges(tone, B[2], B[0]);
  s.commit();
  s.begin();
  for (let i = -1; i <= 1; i++) {
    const a = Math.atan2(hy - elbow[1], hx - elbow[0]) + i * 0.45 * p.spread;
    s.hairline(hx, hy, hx + Math.cos(a) * 3.5, hy + Math.sin(a) * 3.5, near ? B[2] : B[1]);
  }
  s.commit();
}

export function drawHoarwraith(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = wraithPose(e, t + e.seed);
  s.clear();
  s.shift(p.jolt, 0);
  arm(s, p, p.farHand, false);
  shroud(s, p);
  hood(s, p);
  arm(s, p, p.hand, true);
  s.shift(0, 0);
  s.outline(FOE.outline);
  return s;
}
