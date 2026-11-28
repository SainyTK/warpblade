import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { VEIL } from "../colors";
import { type RamPose, ramPose } from "./pose";

const canvas = detailCanvas(56, 40, 28, 33);
const S = VEIL.stone;
const K = VEIL.crystal;
const BODY: readonly (readonly [number, number])[] = [
  [-13, -9],
  [-12.5, -15],
  [-7, -18.5],
  [4, -18.5],
  [9, -15.5],
  [10, -9],
  [6, -6],
  [-10, -6],
];

function leg(s: SpriteCanvas, x: number, swing: number, far: boolean): void {
  const tone = far ? S[1] : S[3];
  s.begin();
  s.taper(x, -9, x + swing * 0.4, -4, 2.2, 1.6, tone);
  s.taper(x + swing * 0.4, -4, x + swing, -1, 1.6, 1.4, tone);
  s.shadeEdges(tone, far ? S[2] : S[4], far ? S[0] : S[1]);
  s.block(x + swing - 1.5, -1.5, far ? K[0] : K[1], 3, 1.5);
  s.commit();
}

function barrel(s: SpriteCanvas, p: RamPose, time: number): void {
  s.begin();
  s.taper(-8, -17, -12, -24 - p.heat, 1.8, 0.3, K[2]);
  s.taper(-3.5, -18, -6, -25.5 - p.heat, 2, 0.3, K[2]);
  s.taper(1, -18, 0, -23, 1.5, 0.3, K[2]);
  s.taper(-12, -12, -16, -14, 1.1, 0.3, K[2]);
  s.shadeEdges(K[2], K[4], K[1]);
  s.hairline(-4, -19, -5.5, -24.5, p.heat > 0.5 ? WHITE : K[3]);
  s.commit();
  s.begin();
  s.poly(BODY, S[2]);
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.hairline(-11.5, -13, 8.5, -13, S[1]);
  s.hairline(-4, -18, -4.5, -13, S[1]);
  s.hairline(3, -18, 3.5, -13, S[1]);
  s.hairline(-1, -13, -1.5, -7, S[1]);
  const glow = p.heat > 0.5 ? VEIL.rune[4] : Math.sin(time * 2.4) > 0.3 ? VEIL.rune[3] : VEIL.rune[2];
  s.hairline(-10, -10, -5, -10, glow);
  s.hairline(-5, -10, -3.5, -8.5, glow);
  s.hairline(1, -10, 6, -10, glow);
  s.set(-10, -17, S[5]);
  s.set(-9, -17.5, S[5]);
  s.commit();
}

const HORN: readonly (readonly [number, number, number])[] = [
  [10, -18, 2.1],
  [7, -20.5, 1.9],
  [3.5, -18.5, 1.6],
  [3, -14, 1.3],
  [5.5, -11, 1],
  [8, -12, 0.6],
];

function head(s: SpriteCanvas, p: RamPose, time: number): void {
  s.shift(p.lean + p.head * 0.5, p.head);
  s.begin();
  s.poly(
    [
      [6, -16],
      [10, -18.5],
      [14, -16.5],
      [18, -11],
      [17.5, -8],
      [13.5, -7.5],
      [9, -10],
      [6.5, -12.5],
    ],
    S[3],
  );
  s.shadeEdges(S[3], S[5], S[1], 2);
  s.hairline(14.5, -9.5, 17.5, -9.5, S[1]);
  s.set(17, -11, S[0]);
  s.block(12.5, -15, p.heat > 0.5 || p.dazed ? VEIL.eyeHot : VEIL.eye, 1.5, 1);
  s.commit();
  const horn = p.heat > 0.5 ? K[3] : K[2];
  s.begin();
  for (let i = 1; i < HORN.length; i++) {
    const [x0, y0, r0] = HORN[i - 1];
    const [x1, y1, r1] = HORN[i];
    s.taper(x0, y0, x1, y1, r0, r1, horn);
  }
  s.shadeEdges(horn, K[4], K[1]);
  s.hairline(9.5, -19.5, 6.5, -21, p.heat > 0.5 ? WHITE : K[4]);
  s.hairline(4, -18.5, 3.5, -15, K[3]);
  s.commit();
  if (p.dazed) {
    s.begin();
    for (let i = 0; i < 3; i++) {
      const a = time * 6 + (i * TAU) / 3;
      s.set(10 + Math.cos(a) * 5, -24 + Math.sin(a) * 1.5, i % 2 ? VEIL.eye : K[4]);
    }
    s.commit(false);
  }
  s.shift(0, 0);
}

export function drawShardram(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = ramPose(e, time);
  s.clear();
  leg(s, -9, -p.stride, true);
  leg(s, 5, p.stride, true);
  s.shift(p.lean, p.hurt ? -1 : 0);
  barrel(s, p, time);
  head(s, p, time);
  s.shift(0, 0);
  leg(s, -7, p.stride, false);
  leg(s, 7.5, -p.stride, false);
  s.outline(VEIL.outline);
  return s;
}
