import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type HoundPose, houndPose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(52, 40, 26, 34);
const I = FORGE.iron;
const P = FORGE.plate;
const L = FORGE.leather;
const B = FORGE.brass;
const M = FORGE.molten;
const C = FORGE.crust;

function leg(s: SpriteCanvas, p: HoundPose, hip: number, phase: number, near: boolean): void {
  const c = p.crouch;
  const swing = p.gallop ? Math.sin(phase) * 5 : p.stride * (near ? 2.2 : -2.2) * (phase > 0 ? -1 : 1);
  const lift = p.gallop ? Math.max(0, Math.cos(phase)) * 2.5 : Math.max(0, swing * 0.4);
  const hipY = -11 + c;
  const knee: Pt = [hip + swing * 0.5 + (hip > 0 ? 1 : -1.5), -5.5 + c * 0.5 - lift * 0.5];
  const paw: Pt = [hip + swing, -1 - lift];
  const tone = near ? I[2] : I[1];
  s.begin();
  s.stroke(hip, hipY, knee[0], knee[1], 1.6, tone);
  s.stroke(knee[0], knee[1], paw[0], paw[1], 1.2, tone);
  s.shadeEdges(tone, near ? I[3] : I[2], I[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [paw[0] - 1.6, paw[1] - 1.2],
      [paw[0] + 2.4, paw[1] - 1],
      [paw[0] + 3, paw[1] + 1],
      [paw[0] - 1.8, paw[1] + 1],
    ],
    near ? C[2] : C[1],
  );
  s.shadeEdges(near ? C[2] : C[1], C[3], C[0]);
  s.commit();
}

function bellows(s: SpriteCanvas, p: HoundPose): void {
  const c = p.crouch;
  const rise = 2.5 + p.bellows * 4;
  const base = -18.5 + c;
  s.begin();
  s.poly(
    [
      [-9, base],
      [-8, base - rise],
      [0, base - rise - 0.6],
      [2.5, base],
    ],
    L[2],
  );
  s.shadeEdges(L[2], L[3], L[1]);
  s.commit();
  s.begin();
  const folds = 3;
  for (let i = 1; i <= folds; i++) {
    const y = base - (rise * i) / (folds + 1);
    s.hairline(-8.6, y, 1.6, y - 0.2, B[i === folds ? 3 : 2]);
  }
  s.hairline(-8, base - rise, 0, base - rise - 0.6, B[3]);
  s.set(-7.8, base - rise, FORGE.brassGlint);
  s.commit(false);
}

function exhaustPipe(s: SpriteCanvas, p: HoundPose): void {
  const c = p.crouch;
  s.begin();
  s.stroke(-11, -14 + c, -13.5, -18 + c, 1.2, I[2]);
  s.stroke(-13.5, -18 + c, -14, -21 + c, 1.3, I[2]);
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
  s.begin();
  s.hairline(-15, -21.6 + c, -13, -21.6 + c, p.heat > 0.4 ? M[4] : M[1]);
  s.commit(false);
}

function torso(s: SpriteCanvas, p: HoundPose, time: number): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-12, -16 + c],
      [-8, -19.5 + c],
      [5, -20 + c],
      [10, -17 + c],
      [10.5, -10 + c],
      [7, -8 + c],
      [-9, -8.5 + c],
      [-12.5, -11 + c],
    ],
    P[2],
  );
  s.shadeEdges(P[2], P[3], P[1], 2);
  s.commit();
  s.begin();
  for (const x of [-6, -1, 4]) s.hairline(x, -19.4 + c, x - 0.8, -9 + c, P[1]);
  for (const x of [-5.4, -0.4, 4.6]) s.set(x, -18 + c, FORGE.ironGlint);
  s.hairline(-11, -11 + c, 9, -9 + c, P[0]);
  s.commit(false);
  const flicker = Math.sin(time * 13) > 0 ? 1 : 0;
  s.begin();
  s.block(3.5, -15.5 + c, M[p.heat > 0.6 ? 4 : 2 + flicker], 5.5, 4.5);
  s.commit();
  s.begin();
  for (const x of [4.5, 6.2, 7.9]) s.hairline(x, -15.5 + c, x, -11.2 + c, I[0]);
  s.hairline(3.5, -15.6 + c, 9, -15.6 + c, B[2]);
  s.set(5.2, -12.5 + c, p.heat > 0.6 ? M[5] : M[4]);
  s.commit(false);
}

function head(s: SpriteCanvas, p: HoundPose): void {
  const c = p.crouch;
  const hy = p.head + c;
  const jaw = p.jaw * 4;
  s.begin();
  s.poly(
    [
      [8, -15 + hy],
      [13, -15 + hy + jaw * 0.3],
      [19, -13.5 + hy + jaw],
      [18.5, -11.5 + hy + jaw],
      [9, -11 + hy],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
  if (p.jaw > 0.1) {
    s.begin();
    s.poly(
      [
        [10, -15.5 + hy],
        [18.5, -14.6 + hy + jaw * 0.5],
        [18, -13.5 + hy + jaw],
        [10, -13.5 + hy],
      ],
      p.heat > 0.5 ? M[4] : M[2],
    );
    s.commit(false);
  }
  s.begin();
  s.poly(
    [
      [7.5, -21 + hy],
      [11, -22.5 + hy],
      [16, -20.5 + hy],
      [20, -17.5 + hy],
      [19.6, -15 + hy],
      [12, -15.4 + hy],
      [8, -15 + hy],
    ],
    P[3],
  );
  s.shadeEdges(P[3], P[4], P[1], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [8.5, -21.5 + hy],
      [9, -25 + hy],
      [11.5, -22.2 + hy],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
  s.begin();
  const eye = p.heat > 0.5 ? WHITE : FORGE.eye;
  s.block(13.5, -19.5 + hy, M[3], 2.5, 1);
  s.block(14.5, -19.5 + hy, eye, 1, 1);
  s.hairline(16, -15.6 + hy, 19.4, -15.4 + hy, C[0]);
  for (const x of [16.6, 18.2]) s.set(x, -15 + hy, FORGE.ironGlint);
  s.set(10.5, -21.8 + hy, FORGE.ironGlint);
  s.set(19.2, -17 + hy, I[4]);
  s.commit(false);
}

export function drawBellowhound(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = houndPose(e, time);
  const run = time * 26;
  s.clear();
  leg(s, p, -8, run + 1.6, false);
  leg(s, p, 6, run + 4.7, false);
  exhaustPipe(s, p);
  torso(s, p, time);
  bellows(s, p);
  leg(s, p, -6.5, run, true);
  leg(s, p, 7.5, run + 3.1, true);
  head(s, p);
  s.outline(FORGE.outline);
  return s;
}
