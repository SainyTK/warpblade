import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { FOE } from "../colors";
import { facet, type Pt, shardPoints } from "../shapes";
import { TUSK_COLORS } from "./colors";
import { type TuskPose, tuskPose } from "./pose";

const canvas = detailCanvas(80, 56, 40, 50);
const Wl = TUSK_COLORS.wool;
const Hd = TUSK_COLORS.hide;
const T = TUSK_COLORS.tusk;
const C = FOE.crystal;

const CRUST: readonly (readonly [number, number, number, number])[] = [
  [-20, -25, 5, -2.3],
  [-14, -29, 7, -2],
  [-7, -31, 8, -1.75],
  [0, -31, 7, -1.5],
  [6, -29, 5, -1.3],
];

function leg(s: SpriteCanvas, hip: Pt, foot: Pt, near: boolean): void {
  const tone = near ? Hd[2] : Hd[1];
  s.begin();
  s.stroke(hip[0], hip[1], foot[0], foot[1] - 2.5, near ? 3.4 : 3, tone);
  s.shadeEdges(tone, near ? Wl[3] : Hd[2], Hd[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [foot[0] - 3, foot[1] - 3],
      [foot[0] + 3, foot[1] - 3],
      [foot[0] + 3.5, foot[1]],
      [foot[0] - 3.5, foot[1]],
    ],
    TUSK_COLORS.hoof,
  );
  s.hairline(foot[0] - 2.5, foot[1] - 2.5, foot[0] + 2.5, foot[1] - 2.5, Hd[1]);
  s.commit();
}

function wool(s: SpriteCanvas, p: TuskPose): void {
  const y = p.lift;
  s.begin();
  s.dot(-13, -19 + y, 10, Wl[2]);
  s.dot(-1, -21 + y, 11.5, Wl[2]);
  s.dot(9, -19 + y + p.head * 0.3, 9.5, Wl[2]);
  s.stroke(-16, -14 + y, 12, -13 + y, 6, Wl[2]);
  s.stroke(-17, -11 + y, 12, -11 + y, 3, Wl[1]);
  for (let x = -21; x <= 14; x += 3) {
    const len = 4 + ((x * 7 + 40) % 3);
    s.taper(x, -11 + y, x - 1, -11 + y + len, 1.6, 0.6, Wl[2]);
  }
  s.shadeEdges(Wl[2], Wl[3], Wl[1], 3);
  for (let i = 0; i < 9; i++) {
    const x = -20 + i * 4.2;
    s.hairline(x, -22 + y + (i % 3), x - 1.5, -15 + y + (i % 2), Wl[1]);
  }
  s.hairline(-20, -27 + y, 4, -32 + y, Wl[4]);
  s.commit();
  if (p.sheen <= 0) return;
  s.begin();
  for (let i = 0; i < 6; i++) {
    const x = -18 + i * 6;
    if ((i + Math.floor(p.sheen * 4)) % 2 === 0) s.hairline(x, -26 + y, x + 3, -17 + y, C[3]);
  }
  s.commit(false);
}

function crust(s: SpriteCanvas, p: TuskPose): void {
  const lit = p.sheen > 0.6;
  for (const [x, top, len, angle] of CRUST)
    facet(s, shardPoints(x, top + p.lift + 2, len, angle, 2), lit ? C[2] : C[1], C[4], C[0]);
}

function head(s: SpriteCanvas, p: TuskPose): void {
  const hy = -16 + p.lift + p.head;
  const hx = 19;
  s.begin();
  s.dot(hx - 3, hy - 7, 5.5, Wl[2]);
  s.dot(hx + 1, hy - 1, 5.5, Wl[2]);
  s.shadeEdges(Wl[2], Wl[4], Wl[1], 2);
  s.hairline(hx - 6, hy - 11, hx - 1, hy - 12, Wl[4]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx + 2, hy - 4],
      [hx + 6.5, hy - 1],
      [hx + 6, hy + 4],
      [hx + 1, hy + 4],
    ],
    Hd[2],
  );
  s.shadeEdges(Hd[2], Wl[3], Hd[0]);
  s.commit();
  const curl = p.toss * 3;
  s.begin();
  s.taper(hx + 5, hy + 2, hx + 7 - curl, hy + 11 - curl, 2, 1.2, Hd[2], 1.5);
  s.taper(hx + 7 - curl, hy + 11 - curl, hx + 9 - curl, hy + 13 - curl * 1.5, 1.2, 0.8, Hd[2], 1);
  s.shadeEdges(Hd[2], Wl[3], Hd[0]);
  for (let i = 0; i < 3; i++) s.set(hx + 5.5 - curl * (i / 3), hy + 5 + i * 2 - curl * (i / 3), Hd[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [hx - 4, hy - 4],
      [hx - 8, hy - 1],
      [hx - 6, hy + 4],
      [hx - 2, hy + 1],
    ],
    Wl[1],
  );
  s.shadeEdges(Wl[1], Wl[2], Hd[1]);
  s.commit();
  s.begin();
  const eye = p.dazed ? Wl[1] : p.glare ? FOE.eyeHot : FOE.eye;
  s.block(hx + 1.5, hy - 3, eye, 1.5, p.dazed ? 0.5 : 1);
  s.set(hx + 0.5, hy - 4, Hd[0]);
  s.set(hx + 2.5, hy - 4.5, Hd[0]);
  s.commit(false);
}

function tusk(s: SpriteCanvas, p: TuskPose, near: boolean): void {
  const hy = -16 + p.lift + p.head;
  const root: Pt = [near ? 23 : 21, hy + 3];
  const swing = p.toss * 6;
  const mid: Pt = [root[0] + 7, root[1] + 5 - swing * 0.5];
  const tip: Pt = [root[0] + 12 + swing * 0.3, root[1] - 2 - swing];
  const scale = near ? 1 : 0.8;
  const tone = p.sheen > 0.6 || p.toss > 0.5 ? T[2] : T[1];
  s.begin();
  s.taper(root[0], root[1], mid[0], mid[1], 1.8 * scale, 1.3 * scale, tone, -0.8);
  s.taper(mid[0], mid[1], tip[0], tip[1], 1.3 * scale, 0.4, tone, -0.8);
  s.shadeEdges(tone, T[3], T[0]);
  s.commit();
  if (near) {
    s.begin();
    s.set(tip[0], tip[1], T[3]);
    s.commit(false);
  }
}

export function drawRimetusk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = tuskPose(e, t + e.seed);
  s.clear();
  s.shift(p.jolt, 0);
  leg(s, [-10, -12 + p.lift], p.hind[1], false);
  leg(s, [9, -12 + p.lift], p.front[1], false);
  tusk(s, p, false);
  crust(s, p);
  wool(s, p);
  head(s, p);
  tusk(s, p, true);
  leg(s, [-12, -11 + p.lift], p.hind[0], true);
  leg(s, [10, -11 + p.lift], p.front[0], true);
  s.shift(0, 0);
  s.outline(FOE.outline);
  return s;
}
