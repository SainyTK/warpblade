import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type HulkPose, hulkPose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(72, 68, 36, 60);
const I = FORGE.iron;
const P = FORGE.plate;
const S = FORGE.steel;
const B = FORGE.brass;
const M = FORGE.molten;

function legs(s: SpriteCanvas, p: HulkPose): void {
  const c = p.crouch;
  for (const [hip, foot, near] of [
    [-5, -6 - p.step * 2, false],
    [5, 6 + p.step * 2, true],
  ] as const) {
    const tone = near ? I[2] : I[1];
    s.begin();
    s.stroke(hip, -15 + c, foot * 0.7 + hip * 0.3, -7 + c * 0.6, 3, tone);
    s.stroke(foot * 0.7 + hip * 0.3, -7 + c * 0.6, foot, -3, 2.6, tone);
    s.shadeEdges(tone, near ? I[3] : I[2], I[0], 2);
    s.commit();
    s.begin();
    s.poly(
      [
        [foot - 4, -4],
        [foot + 5, -4],
        [foot + 6, 0],
        [foot - 4.5, 0],
      ],
      near ? S[2] : S[1],
    );
    s.shadeEdges(near ? S[2] : S[1], S[3], S[0]);
    s.commit();
    s.begin();
    s.dot(foot * 0.7 + hip * 0.3, -7 + c * 0.6, 1.6, B[near ? 2 : 1]);
    s.commit();
  }
}

function torso(s: SpriteCanvas, p: HulkPose): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-11, -33 + c],
      [11, -33 + c],
      [12, -22 + c],
      [9, -14 + c],
      [-9, -14 + c],
      [-12, -22 + c],
    ],
    P[2],
  );
  s.shadeEdges(P[2], P[3], P[1], 2);
  s.commit();
  s.begin();
  s.hairline(-11, -24 + c, 11.5, -24 + c, P[1]);
  s.hairline(-10.5, -23.5 + c, 11, -23.5 + c, P[3]);
  for (const x of [-9, -5, 9]) s.set(x, -31 + c, FORGE.ironGlint);
  s.block(-9, -15.5 + c, B[1], 18, 1.2);
  s.commit(false);
  s.begin();
  if (p.hatch > 0.1) {
    s.block(1.5, -22 + c, M[p.heat > 0.6 ? 5 : 4], 7, 6);
    s.commit();
    s.begin();
    for (const x of [3, 5, 7]) s.hairline(x, -22 + c, x, -16.2 + c, M[2]);
    s.poly(
      [
        [1.5, -22 + c],
        [1.5 - 4 * p.hatch, -21.5 + c],
        [1.5 - 4 * p.hatch, -16.5 + c],
        [1.5, -16 + c],
      ],
      I[2],
    );
  } else {
    s.block(1.5, -22 + c, I[2], 7, 6);
    s.commit();
    s.begin();
    s.hairline(1.5, -16.2 + c, 8.5, -16.2 + c, p.heat > 0.4 ? M[4] : M[2]);
    for (const [x, y] of [
      [2.2, -21.4],
      [7.8, -21.4],
      [2.2, -17.2],
      [7.8, -17.2],
    ] as const)
      s.set(x, y + c, B[3]);
  }
  s.commit(false);
}

function anvil(s: SpriteCanvas, p: HulkPose): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-6, -33 + c],
      [6, -33 + c],
      [7, -37 + c],
      [-7, -37 + c],
    ],
    I[1],
  );
  s.shadeEdges(I[1], I[2], I[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-15, -42 + c],
      [-15, -39 + c],
      [-11, -37 + c],
      [12, -37 + c],
      [18, -38.6 + c],
      [24, -41 + c],
      [13, -42.4 + c],
    ],
    I[3],
  );
  s.shadeEdges(I[3], I[4], I[1], 2);
  s.commit();
  s.begin();
  s.hairline(-14.5, -42 + c, 13, -42.4 + c, FORGE.ironGlint);
  s.hairline(13, -42.4 + c, 23, -41.2 + c, I[4]);
  s.set(-14, -41 + c, I[4]);
  s.commit(false);
  s.begin();
  const eye = p.heat > 0.6 ? M[5] : M[3];
  s.block(2, -35.8 + c, eye, 7, 1);
  s.set(7.5, -35.8 + c, p.heat > 0.6 ? WHITE : FORGE.eye);
  s.set(8.2, -35.8 + c, p.heat > 0.6 ? WHITE : FORGE.eye);
  s.commit(false);
}

function arm(s: SpriteCanvas, p: HulkPose, near: boolean): void {
  const c = p.crouch;
  const shoulder: Pt = near ? [8, -30 + c] : [-8, -30 + c];
  const fist = near ? p.near : p.far;
  const elbow: Pt = [(shoulder[0] + fist[0]) / 2 + (near ? 2 : -2), (shoulder[1] + fist[1]) / 2 + 2];
  const tone = near ? S[2] : S[1];
  s.begin();
  s.stroke(shoulder[0], shoulder[1], elbow[0], elbow[1], 2.4, tone);
  s.stroke(elbow[0], elbow[1], fist[0], fist[1], 2.2, tone);
  s.shadeEdges(tone, near ? S[3] : S[2], S[0]);
  s.commit();
  s.begin();
  s.dot(shoulder[0], shoulder[1], 3.6, near ? P[3] : P[2]);
  s.shadeEdges(near ? P[3] : P[2], P[4], P[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [fist[0] - 4, fist[1] - 4],
      [fist[0] + 4, fist[1] - 4],
      [fist[0] + 4.5, fist[1] + 3.5],
      [fist[0] - 4.5, fist[1] + 3.5],
    ],
    near ? I[3] : I[2],
  );
  s.shadeEdges(near ? I[3] : I[2], I[4], I[0], 2);
  s.commit();
  s.begin();
  s.block(fist[0] - 4, fist[1] - 1, near ? B[2] : B[1], 8.5, 1.4);
  s.set(fist[0] - 3.6, fist[1] - 1, FORGE.brassGlint);
  if (p.heat > 0.5 && near) s.hairline(fist[0] - 4, fist[1] + 3.4, fist[0] + 4.4, fist[1] + 3.4, M[3]);
  s.commit(false);
}

export function drawAnvilhulk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = hulkPose(e, t + e.seed);
  s.clear();
  arm(s, p, false);
  legs(s, p);
  torso(s, p);
  anvil(s, p);
  arm(s, p, true);
  s.outline(FORGE.outline);
  return s;
}
