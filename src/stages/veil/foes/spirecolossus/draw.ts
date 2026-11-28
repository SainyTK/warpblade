import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { VEIL } from "../colors";
import { type ColossusPose, colossusPose, type Pt } from "./pose";

const canvas = detailCanvas(90, 84, 45, 76);
const S = VEIL.stone;
const K = VEIL.crystal;
const R = VEIL.rune;

function leg(s: SpriteCanvas, x: number, lift: number, far: boolean): void {
  const tone = far ? S[1] : S[3];
  s.begin();
  s.poly(
    [
      [x - 4, -16],
      [x + 4, -16],
      [x + 4.5, -3 - lift],
      [x + 6, -lift],
      [x - 5, -lift],
      [x - 4.5, -3 - lift],
    ],
    tone,
  );
  s.shadeEdges(tone, far ? S[2] : S[5], far ? S[0] : S[1], 2);
  s.hairline(x - 4, -9 - lift * 0.5, x + 4, -9 - lift * 0.5, far ? S[0] : S[1]);
  s.commit();
}

function spire(s: SpriteCanvas, p: ColossusPose): void {
  const hot = p.heat > 0.5;
  const tone = hot ? K[3] : K[2];
  s.begin();
  s.taper(-6, -38, -12, -66 - p.heat * 2, 4, 0.5, tone);
  s.taper(-2, -40, -3, -58, 3, 0.4, tone);
  s.taper(-10, -36, -19, -52, 2.6, 0.4, tone);
  s.taper(-4, -38, 4, -52, 2, 0.4, tone);
  s.shadeEdges(tone, K[4], K[1], 2);
  s.hairline(-7, -42, -11.5, -63, hot ? WHITE : K[4]);
  s.hairline(-2.5, -44, -3, -56, K[4]);
  s.commit();
}

function torso(s: SpriteCanvas, p: ColossusPose, time: number): void {
  s.begin();
  s.poly(
    [
      [-9, -24],
      [9, -24],
      [8, -17],
      [-8, -17],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.commit();
  const gap = p.open * 3;
  const core = p.open > 0.2 ? WHITE : p.heat > 0.5 ? K[4] : K[3];
  s.begin();
  s.dot(1, -32, 3.5 + p.open, p.open > 0.2 ? K[3] : K[1]);
  s.dot(1, -32, 1.6 + p.open, core);
  s.commit();
  s.begin();
  s.poly(
    [
      [-12, -44],
      [-1 - gap, -45],
      [-1 - gap, -27],
      [-10, -26],
      [-13, -33],
    ],
    S[3],
  );
  s.poly(
    [
      [3 + gap, -45],
      [13, -43],
      [14, -33],
      [11, -26],
      [3 + gap, -27],
    ],
    S[2],
  );
  s.shadeEdges(S[3], S[5], S[1], 2);
  s.shadeEdges(S[2], S[4], S[1], 2);
  const lit = p.heat > 0.4 ? R[4] : Math.sin(time * 2) > 0 ? R[3] : R[2];
  s.hairline(-10, -36, -4 - gap, -36, lit);
  s.hairline(5 + gap, -36, 11, -36, lit);
  s.hairline(-8, -40, -8, -31, S[1]);
  s.set(-11, -43, S[5]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-2, -54],
      [6, -54],
      [8, -49],
      [6, -46],
      [-3, -46],
      [-4, -50],
    ],
    S[3],
  );
  s.shadeEdges(S[3], S[5], S[1], 2);
  s.hairline(1, -50.5, 7, -50.5, p.heat > 0.5 ? WHITE : VEIL.eye);
  s.hairline(1, -50, 6, -50, VEIL.eye);
  s.commit();
}

function fist(s: SpriteCanvas, [x, y]: Pt, far: boolean, heat: number): void {
  const tone = far ? S[1] : S[3];
  s.begin();
  s.poly(
    [
      [x - 5, y - 4],
      [x + 4, y - 5],
      [x + 6, y],
      [x + 4, y + 5],
      [x - 4, y + 5],
      [x - 6, y + 1],
    ],
    tone,
  );
  s.shadeEdges(tone, far ? S[2] : S[5], far ? S[0] : S[1], 2);
  s.hairline(x + 1, y - 4, x + 1.5, y + 4, far ? S[0] : S[1]);
  s.set(x - 1.5, y, heat > 0.5 ? R[4] : R[3]);
  s.commit(!far);
}

function tether(s: SpriteCanvas, from: Pt, to: Pt, heat: number): void {
  s.begin();
  for (let i = 1; i < 5; i++) {
    const u = i / 5;
    s.block(from[0] + (to[0] - from[0]) * u - 0.5, from[1] + (to[1] - from[1]) * u - 0.5, heat > 0.5 ? R[4] : R[3]);
  }
  s.commit(false);
}

export function drawSpirecolossus(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = colossusPose(e, time);
  s.clear();
  fist(s, p.far, true, p.heat);
  leg(s, -5, Math.max(0, -p.stride), true);
  leg(s, 6, Math.max(0, p.stride), false);
  s.shift(p.lean, p.bob * 0.5);
  spire(s, p);
  torso(s, p, time);
  s.shift(0, 0);
  fist(s, p.near, false, p.heat);
  s.outline(VEIL.outline);
  tether(s, [10 + p.lean, -38], p.near, p.heat);
  return s;
}
