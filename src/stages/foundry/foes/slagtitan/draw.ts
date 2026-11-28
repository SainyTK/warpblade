import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type TitanPose, titanPose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(96, 88, 48, 78);
const I = FORGE.iron;
const C = FORGE.crust;
const S = FORGE.steel;
const B = FORGE.brass;
const M = FORGE.molten;
const BRICK_ROWS = 5;

function legs(s: SpriteCanvas, p: TitanPose): void {
  const c = p.crouch;
  for (const [hip, foot, near] of [
    [-7, -8 - p.step * 2.5, false],
    [7, 8 + p.step * 2.5, true],
  ] as const) {
    const tone = near ? C[2] : C[1];
    s.begin();
    s.poly(
      [
        [hip - 4.5, -18 + c],
        [hip + 4.5, -18 + c],
        [foot + 4.5, -4],
        [foot - 4.5, -4],
      ],
      tone,
    );
    s.shadeEdges(tone, near ? C[3] : C[2], C[0], 2);
    s.commit();
    s.begin();
    s.block(foot * 0.5 + hip * 0.5 - 5, -11 + c * 0.5, near ? I[2] : I[1], 10, 1.5);
    s.poly(
      [
        [foot - 6, -5],
        [foot + 7, -5],
        [foot + 8, 0],
        [foot - 6.5, 0],
      ],
      near ? I[2] : I[1],
    );
    s.shadeEdges(near ? I[2] : I[1], I[3], I[0]);
    s.commit();
  }
}

function furnace(s: SpriteCanvas, p: TitanPose): void {
  const c = p.crouch;
  const top = -54 + c;
  const bottom = -16 + c;
  s.begin();
  s.poly(
    [
      [-15, top + 3],
      [-10, top],
      [11, top],
      [16, top + 4],
      [17, bottom - 4],
      [13, bottom],
      [-13, bottom],
      [-16, bottom - 5],
    ],
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[1], 2);
  s.commit();
  s.begin();
  const rowH = (bottom - top - 4) / BRICK_ROWS;
  for (let r = 1; r < BRICK_ROWS; r++) {
    const y = top + 2 + r * rowH;
    s.hairline(-15, y, 16, y, C[1]);
    for (let x = -12 + (r % 2) * 4; x < 15; x += 8) s.hairline(x, y - rowH + 0.6, x, y - 0.4, C[1]);
  }
  s.hairline(-14, top + 1, 10, top + 1, C[3]);
  s.commit(false);
  s.begin();
  s.block(-16, top + 6, I[2], 33, 2);
  s.block(-16, bottom - 6, I[2], 33, 2);
  s.commit();
  s.begin();
  for (const x of [-13, -6, 1, 8, 14]) {
    s.set(x, top + 6.5, B[3]);
    s.set(x, bottom - 5.5, B[3]);
  }
  s.commit(false);
}

function maw(s: SpriteCanvas, p: TitanPose, time: number): void {
  const c = p.crouch;
  const x0 = 0;
  const x1 = 13;
  const y0 = -40 + c;
  const y1 = -27 + c;
  const flicker = Math.sin(time * 11) > 0.3 ? 1 : 0;
  s.begin();
  s.poly(
    [
      [x0, y0 + 2],
      [x0 + 2, y0],
      [x1 - 1, y0],
      [x1, y0 + 2],
      [x1, y1],
      [x0, y1],
    ],
    p.maw > 0.2 ? M[3 + flicker] : M[1 + flicker],
  );
  s.commit();
  s.begin();
  const open = p.maw * 4.5;
  s.block(x0, y0, I[1], x1 - x0, 4.5 - open);
  s.block(x0, y1 - 4.5 + open, I[1], x1 - x0, 4.5 - open);
  for (let x = x0 + 2; x < x1; x += 2.6) s.hairline(x, y0 + 4.5 - open, x, y1 - 4.5 + open, p.maw > 0.5 ? M[2] : I[0]);
  s.commit(false);
  s.begin();
  if (p.maw > 0.5) {
    s.block(x0 + 2, y0 + 5, M[5], x1 - x0 - 4, 2);
  }
  s.hairline(x0, y0 - 0.5, x1, y0 - 0.5, B[2]);
  s.hairline(x0, y1 + 0.5, x1, y1 + 0.5, B[1]);
  s.commit(false);
}

function head(s: SpriteCanvas, p: TitanPose): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-1, -54 + c],
      [1, -60 + c],
      [8, -61 + c],
      [13, -57 + c],
      [13, -53 + c],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0], 2);
  s.commit();
  s.begin();
  const eye = p.heat > 0.6 ? WHITE : FORGE.eye;
  s.block(6, -57.5 + c, M[p.heat > 0.6 ? 5 : 3], 6, 1);
  s.set(10.5, -57.5 + c, eye);
  s.set(11.2, -57.5 + c, eye);
  s.hairline(1.4, -59.6 + c, 8, -60.6 + c, FORGE.ironGlint);
  s.commit(false);
}

function stack(s: SpriteCanvas, p: TitanPose): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-14, -52 + c],
      [-9, -52 + c],
      [-9.5, -64 + c],
      [-13.5, -64 + c],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
  s.begin();
  s.block(-15, -66 + c, I[3], 7, 2);
  s.commit();
  s.begin();
  s.hairline(-14.5, -66.2 + c, -8.5, -66.2 + c, p.heat > 0.4 || p.maw > 0.4 ? M[4] : M[2]);
  s.hairline(-13, -58 + c, -10, -58 + c, B[2]);
  s.commit(false);
}

function arm(s: SpriteCanvas, p: TitanPose, near: boolean): void {
  const c = p.crouch;
  const shoulder: Pt = near ? [12, -48 + c] : [-12, -48 + c];
  const fist = near ? p.near : p.far;
  const elbow: Pt = [(shoulder[0] + fist[0]) / 2 + (near ? 3 : -3), (shoulder[1] + fist[1]) / 2 + 3];
  const tone = near ? I[2] : I[1];
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 3.4, tone);
  s.stroke(elbow[0], elbow[1], fist[0], fist[1], 3, tone);
  s.shadeEdges(tone, near ? I[3] : I[2], I[0], 2);
  s.commit();
  s.begin();
  s.dot(shoulder[0], shoulder[1], 5, near ? S[2] : S[1]);
  s.shadeEdges(near ? S[2] : S[1], S[3], S[0], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [fist[0] - 6, fist[1] - 5],
      [fist[0] + 6, fist[1] - 5],
      [fist[0] + 6.5, fist[1] + 4.5],
      [fist[0] - 6.5, fist[1] + 4.5],
    ],
    near ? C[2] : C[1],
  );
  s.shadeEdges(near ? C[2] : C[1], C[3], C[0], 2);
  s.commit();
  s.begin();
  s.hairline(fist[0] - 5.5, fist[1] - 1.5, fist[0] + 5.5, fist[1] - 1.5, p.heat > 0.4 ? M[4] : M[2]);
  s.hairline(fist[0] - 5, fist[1] + 1.5, fist[0] + 2, fist[1] + 1, M[1]);
  s.set(fist[0] - 5.5, fist[1] - 4.5, FORGE.ironGlint);
  s.commit(false);
}

export function drawSlagtitan(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = titanPose(e, time);
  s.clear();
  arm(s, p, false);
  stack(s, p);
  legs(s, p);
  furnace(s, p);
  maw(s, p, time);
  head(s, p);
  arm(s, p, true);
  s.outline(FORGE.outline);
  return s;
}
