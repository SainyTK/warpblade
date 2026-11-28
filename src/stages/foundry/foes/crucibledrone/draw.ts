import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { FORGE } from "../../colors";
import { type DronePose, dronePose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(48, 48, 24, 24);
const B = FORGE.brass;
const I = FORGE.iron;
const S = FORGE.steel;
const M = FORGE.molten;
const C = FORGE.crust;
const PIVOT: Pt = [0, 0.5];
const BOWL: readonly Pt[] = [
  [-6.5, 0],
  [6.5, 0],
  [5.6, 5],
  [3.4, 7.6],
  [-3.4, 7.6],
  [-5.6, 5],
];

const turn = (p: DronePose, [x, y]: Pt): Pt => {
  const a = p.tilt;
  const dx = x - PIVOT[0];
  const dy = y - PIVOT[1];
  return [PIVOT[0] + dx * Math.cos(a) - dy * Math.sin(a), PIVOT[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};

function rotor(s: SpriteCanvas, p: DronePose): void {
  s.begin();
  s.stroke(0, -12, 0, -15.5, 0.7, I[2]);
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
  const reach = 10 * Math.abs(Math.cos(p.spin));
  s.begin();
  s.block(-reach, -16.5, B[2], reach * 2, 0.6);
  s.block(-reach, -16, B[1], reach * 2, 0.4);
  s.dot(0, -16.2, 1.2, B[3]);
  s.commit();
  s.begin();
  s.set(-0.5, -16.8, FORGE.brassGlint);
  if (reach > 2) s.set(-reach, -16.5, B[3]);
  s.commit(false);
}

function housing(s: SpriteCanvas, p: DronePose): void {
  s.begin();
  s.poly(
    [
      [-8.5, -4.5],
      [-7.6, -9.5],
      [-3.6, -12.6],
      [3.6, -12.6],
      [7.6, -9.5],
      [8.5, -4.5],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.commit();
  s.begin();
  s.block(-8.5, -5.6, B[1], 17, 1.4);
  s.hairline(-8.2, -5.6, 8.2, -5.6, B[3]);
  s.commit();
  s.begin();
  for (const x of [-6, -2, 2]) s.set(x, -5, B[3]);
  s.set(-5, -10.6, FORGE.steelGlint);
  s.set(-4.4, -11.4, FORGE.steelGlint);
  s.hairline(-1, -12.4, -6.8, -7.4, S[3]);
  s.commit(false);
  s.begin();
  s.dot(5, -8.6, 2.5, I[0]);
  s.commit();
  s.begin();
  const lit = p.heat > 0.6 ? M[4] : M[3];
  s.dot(5.3, -8.6, 1.5, lit);
  s.set(5.8, -9, p.heat > 0.6 ? WHITE : FORGE.eye);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [-8.5, -8],
      [-11, -9.5],
      [-11, -6],
      [-8.5, -6],
    ],
    I[2],
  );
  s.shadeEdges(I[2], I[3], I[0]);
  s.commit();
}

function crucible(s: SpriteCanvas, p: DronePose): void {
  const [la, lb] = [turn(p, [-5.5, 0]), turn(p, [5.5, 0])];
  s.begin();
  s.hairline(-6.5, -4.5, la[0], la[1], I[3]);
  s.hairline(6.5, -4.5, lb[0], lb[1], I[3]);
  s.commit(false);
  s.begin();
  s.poly(
    BOWL.map((q) => turn(p, q)),
    C[2],
  );
  s.shadeEdges(C[2], C[3], C[0], 2);
  s.commit();
  s.begin();
  const [r0, r1] = [turn(p, [-6.5, 0.2]), turn(p, [6.5, 0.2])];
  s.hairline(r0[0], r0[1], r1[0], r1[1], I[3]);
  const [s0, s1] = [turn(p, [-4.6, 4.4]), turn(p, [4.4, 4.4])];
  s.hairline(s0[0], s0[1], s1[0], s1[1], C[1]);
  const [spout] = [turn(p, [7.6, -0.4])];
  s.set(spout[0], spout[1], I[3]);
  s.commit(false);
  if (p.fill <= 0.05) return;
  s.begin();
  const level = 0.8 + (1 - p.fill) * 4;
  const w = 5.6 - (1 - p.fill) * 2;
  const [m0, m1] = [turn(p, [-w, level]), turn(p, [w, level])];
  s.hairline(m0[0], m0[1], m1[0], m1[1], p.heat > 0.6 ? M[5] : M[4]);
  const [n0, n1] = [turn(p, [-w + 1, level + 0.6]), turn(p, [w - 1, level + 0.6])];
  s.hairline(n0[0], n0[1], n1[0], n1[1], M[3]);
  s.commit(false);
}

export function drawCrucibledrone(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = dronePose(e, t + e.seed);
  s.clear();
  s.shift(p.wobble, 0);
  rotor(s, p);
  crucible(s, p);
  housing(s, p);
  s.outline(FORGE.outline);
  return s;
}
