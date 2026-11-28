import type { SpriteCanvas } from "../../../../engine/sprite";
import { grain } from "../../../../utils/grain";
import { ROOTCALLER_COLORS as C } from "./colors";
import type { RootcallerPose } from "./pose";

const B = C.bark;
const M = C.moss;
const HEM = [-7, -5, -3, -1, 1, 3, 5, 7] as const;

function leg(s: SpriteCanvas, hip: number, foot: number, near: boolean): void {
  const base = near ? C.root[2] : C.root[1];
  s.begin();
  s.taper(hip, -14, foot, -1, 1.6, 1.1, base, near ? 0.6 : -0.6);
  s.taper(foot, -1, foot + 4, 0, 0.8, 0.3, base);
  s.taper(foot, -1, foot - 3.5, 0, 0.7, 0.3, base);
  s.taper(foot + 0.5, -1.5, foot + 2, 0.3, 0.6, 0.3, base);
  s.shadeEdges(base, near ? C.root[3] : C.root[2], near ? C.root[1] : C.root[0]);
  s.commit();
}

export function drawLegs(s: SpriteCanvas, p: RootcallerPose): void {
  leg(s, -2, -4 - p.stride, false);
  leg(s, 2, 4 + p.stride, true);
}

function robe(s: SpriteCanvas, l: number, d: number, time: number): void {
  s.begin();
  s.poly(
    [
      [-4 + l * 0.4, -26 + d],
      [4 + l * 0.4, -26 + d],
      [7 + l * 0.1, -6 + d],
      [-7, -6 + d],
    ],
    B[2],
  );
  HEM.forEach((x, i) => {
    const sway = Math.sin(time * 2.5 + i) * 0.5;
    s.taper(x, -7 + d, x + sway + (x > 0 ? 0.5 : -0.5), -2.5 - (i % 2) * 1.5 + d, 1, 0.3, B[2]);
  });
  s.shadeEdges(B[2], B[3], B[1], 2);
  for (const x of [-4, -1.5, 1, 3.5]) s.hairline(x * 0.7 + l * 0.35, -24 + d, x * 1.3 + l * 0.1, -7 + d, B[1]);
  for (let y = -24; y <= -8; y += 1.5)
    for (let x = -6; x <= 6; x += 1.5) {
      if (grain(x * 5, y * 3) < 0.86) continue;
      s.set(x + l * 0.2, y + d, B[0]);
    }
  s.set(3 + l * 0.4, -24 + d, C.barkGlint);
  s.set(3.5 + l * 0.35, -22 + d, B[4]);
  s.commit();
}

function shoulders(s: SpriteCanvas, l: number, d: number, time: number): void {
  s.begin();
  s.dot(-3 + l * 0.5, -27 + d, 3, M[2]);
  s.dot(2.5 + l * 0.5, -27.5 + d, 3.2, M[2]);
  for (const [x, len] of [
    [-5, 5],
    [-2, 7],
    [1, 4],
    [4, 6],
  ] as const) {
    const sway = Math.sin(time * 2 + x) * 0.4;
    s.taper(x + l * 0.5, -26 + d, x + l * 0.4 + sway, -26 + len + d, 0.8, 0.3, M[1]);
  }
  s.shadeEdges(M[2], M[3], M[1], 2);
  s.set(1.5 + l * 0.5, -30 + d, M[4]);
  s.set(2.5 + l * 0.5, -30 + d, M[4]);
  s.commit();
}

function arm(s: SpriteCanvas, from: readonly [number, number], to: readonly [number, number], near: boolean): void {
  const base = near ? B[2] : B[1];
  s.begin();
  s.taper(from[0], from[1], to[0], to[1], 1.1, 0.7, base, near ? -1 : 1);
  s.dot(to[0], to[1], 1.1, base);
  s.shadeEdges(base, near ? B[3] : B[2], B[0]);
  s.commit();
}

export function drawBackArm(s: SpriteCanvas, p: RootcallerPose): void {
  arm(s, [-3 + p.lean * 0.5, -26 + p.bob], p.backHand, false);
}

export function drawNearArm(s: SpriteCanvas, p: RootcallerPose): void {
  arm(s, [3 + p.lean * 0.5, -26 + p.bob], p.hand, true);
}

export function drawBody(s: SpriteCanvas, p: RootcallerPose, time: number): void {
  robe(s, p.lean, p.bob, time);
  shoulders(s, p.lean, p.bob, time);
}
