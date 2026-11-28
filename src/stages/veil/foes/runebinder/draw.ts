import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { VEIL } from "../colors";
import { type BinderPose, binderPose } from "./pose";

const canvas = detailCanvas(64, 64, 30, 56);
const S = VEIL.stone;
const R = VEIL.rune;
const O = VEIL.robe;
const ROBE: readonly (readonly [number, number])[] = [
  [-4, -25],
  [4, -25],
  [6.5, -16],
  [8, -3],
  [9, 0],
  [-9, 0],
  [-7.5, -4],
  [-6, -16],
];

function orbiters(s: SpriteCanvas, time: number, front: boolean, heat: number): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const a = time * 1.6 + (i * TAU) / 3;
    if (Math.sin(a) > 0 !== front) continue;
    const x = Math.cos(a) * 12 - 2;
    const y = -30 + Math.sin(a) * 3 - i;
    s.poly(
      [
        [x - 2, y - 1],
        [x, y - 2.5],
        [x + 2, y - 1],
        [x + 1, y + 1.5],
        [x - 1.5, y + 1],
      ],
      S[front ? 3 : 2],
    );
    s.set(x - 1, y - 1.5, front ? S[5] : S[3]);
    s.set(x, y, heat > 0.5 ? R[4] : R[front ? 3 : 2]);
  }
  s.commit(front);
}

function robe(s: SpriteCanvas, p: BinderPose, time: number): void {
  s.shift(p.lean, 0);
  s.begin();
  s.poly(ROBE, O[2]);
  s.shadeEdges(O[2], O[3], O[0], 2);
  s.hairline(0, -24, -1 + p.sway, -1, O[0]);
  s.hairline(3, -18, 4.5 + p.sway, -1, O[1]);
  s.hairline(-8.5, -1, 8.5, -1, O[0]);
  s.commit();
  s.begin();
  s.taper(-3, -24, -4.5 + p.sway, -3, 1, 1.2, R[1]);
  s.taper(2.5, -24, 3 + p.sway, -3, 1, 1.2, R[1]);
  s.shadeEdges(R[1], R[2], R[0]);
  for (let y = -20; y < -3; y += 4) {
    const lit = p.heat > 0.6 || Math.sin(time * 3 + y) > 0.3;
    s.set(-4 + p.sway * ((y + 24) / 24), y, lit ? R[4] : R[3]);
    s.set(2.8 + p.sway * ((y + 24) / 24), y + 2, lit ? R[4] : R[3]);
  }
  s.commit();
  s.begin();
  s.taper(3, -21, 6 + p.arms * 2, -18 - p.arms * 12, 1.6, 1.2, O[3]);
  s.dot(6 + p.arms * 2, -18 - p.arms * 12, 1.5, S[3]);
  s.shadeEdges(O[3], O[3], O[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-5, -26],
      [-2, -33],
      [3, -34],
      [6, -29],
      [5, -24],
      [-4, -23],
    ],
    O[1],
  );
  s.shadeEdges(O[1], O[3], O[0], 2);
  s.commit();
  s.begin();
  s.taper(-1, -32, -3, -38 - p.heat, 1.2, 0.3, VEIL.crystal[2]);
  s.taper(1.5, -33, 2, -37, 0.9, 0.3, VEIL.crystal[2]);
  s.taper(-3, -31, -6, -34, 0.8, 0.3, VEIL.crystal[2]);
  s.shadeEdges(VEIL.crystal[2], VEIL.crystal[4], VEIL.crystal[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [1, -31],
      [5, -31],
      [5.5, -26.5],
      [2, -25],
    ],
    S[3],
  );
  s.shadeEdges(S[3], S[5], S[1]);
  s.hairline(2.5, -29, 5, -29, p.heat > 0.5 ? WHITE : VEIL.eye);
  s.set(3.5, -27, R[3]);
  s.commit();
  s.shift(0, 0);
}

function tablet(s: SpriteCanvas, p: BinderPose, time: number): void {
  const ca = Math.cos(p.tilt);
  const sa = Math.sin(p.tilt);
  const at = (x: number, y: number) => [p.tx + x * ca - y * sa, p.ty + x * sa + y * ca] as const;
  s.begin();
  s.poly([at(-3, -8), at(3, -8), at(3.5, 8), at(-2.5, 8)], S[2]);
  s.shadeEdges(S[2], S[5], S[1], 2);
  const lit = p.heat > 0.4 ? R[4] : Math.sin(time * 2.2) > 0 ? R[3] : R[2];
  s.hairline(...at(0, -5), ...at(0, 5), lit);
  s.hairline(...at(-1.5, -2), ...at(1.5, -2), lit);
  s.hairline(...at(-1.5, 2.5), ...at(1.5, 3.5), lit);
  s.hairline(...at(-2.5, 0), ...at(3, 0), S[1]);
  s.commit();
}

export function drawRunebinder(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = binderPose(e, time);
  s.clear();
  orbiters(s, time, false, p.heat);
  robe(s, p, time);
  tablet(s, p, time);
  s.outline(VEIL.outline);
  orbiters(s, time, true, p.heat);
  return s;
}
