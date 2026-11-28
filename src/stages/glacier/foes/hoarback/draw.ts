import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { facet, oval, type Pt, shardPoints } from "../shapes";
import { HOARBACK_COLORS } from "./colors";
import { type HoarbackPose, hoarbackPose } from "./pose";

const canvas = detailCanvas(48, 36, 24, 32);
const H = HOARBACK_COLORS.hide;
const P = HOARBACK_COLORS.plate;
const C = FOE.crystal;

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean): void {
  const tone = near ? H[2] : H[1];
  s.begin();
  s.stroke(hip[0], hip[1], foot[0], foot[1] - 1.5, near ? 2.4 : 2.1, tone);
  s.shadeEdges(tone, near ? H[3] : H[2], H[0]);
  s.commit();
  s.begin();
  s.block(foot[0] - 1.5, foot[1] - 1, near ? H[3] : H[1], 3.5, 1);
  s.set(foot[0] + 2, foot[1] - 0.5, HOARBACK_COLORS.claw);
  s.commit();
}

function belly(s: SpriteCanvas, p: HoarbackPose): void {
  const y = p.lift;
  s.begin();
  oval(s, 0, -7 + y, 11, 4, H[1]);
  s.shadeEdges(H[1], H[2], H[0]);
  s.commit();
}

function shell(s: SpriteCanvas, p: HoarbackPose): void {
  const y = p.lift;
  const r = p.rear;
  s.begin();
  oval(s, -1, -12 + y - r * 0.3, 12.5, 7.5, P[1]);
  s.shadeEdges(P[1], P[2], P[0], 2);
  s.commit();
  const ridges: readonly [number, number][] = [
    [-9, -13],
    [-4, -17],
    [2, -17],
  ];
  for (const [x, top] of ridges) {
    s.begin();
    s.poly(
      [
        [x - 3, top + 6 + y],
        [x - 1.5, top + y - r * 0.2],
        [x + 3, top + 1.5 + y - r * 0.2],
        [x + 3.5, top + 7 + y],
      ],
      P[2],
    );
    s.shadeEdges(P[2], P[3], P[1]);
    s.hairline(x - 1.5, top + y + 0.5 - r * 0.2, x + 2.5, top + 2 + y - r * 0.2, P[4]);
    s.commit();
  }
  s.begin();
  for (const [x, yy] of [
    [-11, -9],
    [-6, -8],
    [0, -8],
    [5, -9],
  ] as const) {
    s.dot(x, yy + y, 1.6, HOARBACK_COLORS.frost[1]);
  }
  s.shadeEdges(HOARBACK_COLORS.frost[1], HOARBACK_COLORS.frost[2], HOARBACK_COLORS.frost[0]);
  s.commit();
}

function head(s: SpriteCanvas, p: HoarbackPose): void {
  const y = p.lift + p.head;
  const r = p.rear;
  s.begin();
  oval(s, 12, -7 + y - r * 0.4, 4.2, 3.4, H[2]);
  s.shadeEdges(H[2], H[3], H[0]);
  s.hairline(13, -4.6 + y, 16, -4.4 + y, H[0]);
  s.commit();
  s.begin();
  s.block(14, -8 + y - r * 0.4, p.glare ? FOE.amberHot : FOE.amber, 1.5, 0.5);
  s.commit();
}

function brow(s: SpriteCanvas, p: HoarbackPose): void {
  const y = p.lift + p.head * 0.5;
  const r = p.rear;
  const lit = p.hornGlow > 0.5;
  facet(
    s,
    [
      [8, -19 + y - r],
      [15.5, -12 + y - r * 0.6],
      [16, -8 + y - r * 0.3],
      [9, -9.5 + y - r * 0.3],
      [6.5, -15 + y - r * 0.8],
    ],
    P[2],
    P[4],
    P[0],
  );
  s.begin();
  s.hairline(9.5, -15.5 + y - r * 0.8, 14.5, -10.5 + y - r * 0.5, P[4]);
  s.hairline(8.5, -11 + y - r * 0.4, 12, -10 + y - r * 0.4, P[1]);
  s.commit(false);
  facet(s, shardPoints(12, -15 + y - r * 0.7, 7 + p.hornGlow, -0.75, 1.7), lit ? C[3] : C[1], C[4], C[0]);
  if (p.hornGlow > 0) {
    s.begin();
    s.set(12 + Math.cos(-0.75) * 7, -15 + y - r * 0.7 + Math.sin(-0.75) * 7, FOE.eyeHot);
    s.commit(false);
  }
}

export function drawHoarback(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = hoarbackPose(e, t + e.seed);
  s.clear();
  leg(s, [-7, -7 + p.lift], p.hind[1], false);
  leg(s, [7, -7 + p.lift], p.front[1], false);
  belly(s, p);
  head(s, p);
  shell(s, p);
  brow(s, p);
  leg(s, [-8, -6 + p.lift], p.hind[0], true);
  leg(s, [6, -6 + p.lift], p.front[0], true);
  s.outline(FOE.outline);
  return s;
}
