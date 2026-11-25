import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp, lerp } from "../../../../utils/math";
import { FORGE } from "../../colors";
import { GUARD_TIMES } from "./behavior";

type Pt = readonly [number, number];
const canvas = detailCanvas(60, 56, 28, 46);
const S = FORGE.steel;
const L = FORGE.leather;
const B = FORGE.brass;
const M = FORGE.molten;
const BEARD = FORGE.beard;

interface Pose {
  hand: Pt;
  head: Pt;
  shield: Pt;
  shieldTilt: number;
  crouch: number;
  heat: number;
  step: number;
}

function poseOf(e: Enemy, time: number): Pose {
  if (e.state === "wind") {
    const u = clamp(e.st / GUARD_TIMES.wind);
    const lift = Math.min(1, u * 2);
    return {
      hand: [lerp(-4, -3, lift), lerp(-13, -25, lift)],
      head: [lerp(-10, -9, lift), lerp(-23, -37, lift)],
      shield: [5, -2],
      shieldTilt: -0.15,
      crouch: -lift,
      heat: u,
      step: 0,
    };
  }
  if (e.state === "swipe")
    return { hand: [8, -11], head: [18, -3], shield: [3, 1], shieldTilt: 0.25, crouch: 2, heat: 1, step: 0 };
  if (e.state === "recover") {
    const u = clamp(e.st / GUARD_TIMES.recover);
    return {
      hand: [7, -9 - u * 2],
      head: [17, -3],
      shield: [4, 3],
      shieldTilt: 0.3,
      crouch: 2 - u,
      heat: 0.6 * (1 - u),
      step: 0,
    };
  }
  const stride = e.state === "walk" ? Math.sin(time * 5) : 0;
  return {
    hand: [-4, -13 + Math.abs(stride) * 0.5],
    head: [-10, -23 + Math.abs(stride) * 0.5],
    shield: [7, 0],
    shieldTilt: 0,
    crouch: -Math.abs(stride) * 0.5,
    heat: 0,
    step: stride,
  };
}

function legs(s: SpriteCanvas, p: Pose): void {
  const c = p.crouch;
  for (const [hip, foot, near] of [
    [-2.5, -3 - p.step * 1.5, false],
    [2.5, 3 + p.step * 1.5, true],
  ] as const) {
    s.begin();
    s.stroke(hip, -9 + c, foot * 0.6 + hip * 0.4, -4 + c * 0.5, 1.9, near ? S[2] : S[1]);
    s.stroke(foot * 0.6 + hip * 0.4, -4 + c * 0.5, foot, -1.5, 1.7, near ? S[2] : S[1]);
    s.shadeEdges(near ? S[2] : S[1], near ? S[3] : S[2], S[0]);
    s.commit();
    s.begin();
    s.poly(
      [
        [foot - 2.2, -2.6],
        [foot + 2.8, -2.4],
        [foot + 3.4, 0],
        [foot - 2.4, 0],
      ],
      near ? L[2] : L[1],
    );
    s.shadeEdges(near ? L[2] : L[1], L[3], L[0]);
    s.commit();
  }
}

function torso(s: SpriteCanvas, p: Pose): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-6.5, -19 + c],
      [6.5, -19 + c],
      [7.5, -10 + c],
      [6, -7 + c],
      [-6, -7 + c],
      [-7.5, -10 + c],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.commit();
  s.begin();
  for (let y = -16.5; y < -9; y += 2.5) {
    s.hairline(-6, y + c, 6.5, y + c, S[1]);
    s.hairline(-5.5, y + 0.5 + c, 6, y + 0.5 + c, S[3]);
  }
  for (let y = -17.5; y < -9; y += 2.5) s.set(-2.5, y + c, B[2]);
  s.set(-5, -18 + c, FORGE.steelGlint);
  s.set(-4.5, -18 + c, FORGE.steelGlint);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [-6, -8 + c],
      [6, -8 + c],
      [5.2, -2 + c * 0.5],
      [-5.2, -2 + c * 0.5],
    ],
    L[2],
  );
  s.shadeEdges(L[2], L[3], L[1]);
  s.commit();
  s.begin();
  s.block(-6, -9 + c, B[1], 12, 1.2);
  s.block(-1, -9.4 + c, B[3], 2, 2);
  s.set(-0.5, -9.4 + c, FORGE.brassGlint);
  s.commit();
}

function helm(s: SpriteCanvas, p: Pose): void {
  const c = p.crouch;
  s.begin();
  s.poly(
    [
      [-4.2, -24.5 + c],
      [-1.5, -27 + c],
      [3, -27 + c],
      [5.2, -24 + c],
      [5.4, -19 + c],
      [-4.4, -19 + c],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.commit();
  s.begin();
  s.poly(
    [
      [-1, -27 + c],
      [1.5, -29.5 + c],
      [3.5, -27 + c],
    ],
    B[2],
  );
  s.shadeEdges(B[2], B[3], B[1]);
  s.commit();
  s.begin();
  s.block(0.5, -23.2 + c, M[p.heat > 0.6 ? 5 : 4], 4.5, 0.8);
  s.block(2.4, -23 + c, M[3], 0.8, 2.6);
  s.set(4.6, -23.2 + c, p.heat > 0.6 ? WHITE : FORGE.eye);
  s.commit(false);
  s.begin();
  s.poly(
    [
      [-1.4, -19.6 + c],
      [6.2, -19.6 + c],
      [6, -16 + c],
      [4.6, -13 + c],
      [3.6, -10 + c],
      [2.4, -13 + c],
      [0.6, -11.5 + c],
      [0, -15 + c],
    ],
    BEARD[1],
  );
  s.shadeEdges(BEARD[1], BEARD[2], BEARD[0]);
  s.commit();
  s.begin();
  s.hairline(1.4, -19 + c, 1.2, -13 + c, BEARD[2]);
  s.hairline(3, -19 + c, 3.6, -11 + c, BEARD[3]);
  s.hairline(4.6, -19 + c, 5, -15 + c, BEARD[2]);
  s.block(3.1, -11 + c, B[3], 1, 1);
  s.block(0.4, -12.4 + c, B[2], 1, 1);
  s.set(3.1, -11 + c, FORGE.brassGlint);
  s.set(5.4, -18.6 + c, BEARD[3]);
  s.commit(false);
}

function pauldron(s: SpriteCanvas, p: Pose): void {
  const c = p.crouch;
  const [sx, sy] = p.shield;
  s.begin();
  s.stroke(4, -16 + c, sx + 2.5, sy - 12, 1.5, S[1]);
  s.shadeEdges(S[1], S[2], S[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [1.5, -19 + c],
      [5, -19.6 + c],
      [7.4, -17.6 + c],
      [7, -15 + c],
      [2, -15.4 + c],
    ],
    S[3],
  );
  s.shadeEdges(S[3], S[4], S[1]);
  s.commit();
  s.begin();
  s.hairline(2, -15.4 + c, 7, -15 + c, B[2]);
  s.set(4, -18.6 + c, FORGE.steelGlint);
  s.commit(false);
}

function hammerArm(s: SpriteCanvas, p: Pose): void {
  const c = p.crouch;
  const [hx, hy] = p.hand;
  s.begin();
  s.stroke(-4.5, -16 + c, (hx - 4.5) / 2, (hy - 16 + c) / 2 + 1, 1.5, S[2]);
  s.stroke((hx - 4.5) / 2, (hy - 16 + c) / 2 + 1, hx, hy, 1.3, S[2]);
  s.shadeEdges(S[2], S[3], S[0]);
  s.commit();
}

function hammer(s: SpriteCanvas, p: Pose): void {
  const [hx, hy] = p.hand;
  const [kx, ky] = p.head;
  const len = Math.hypot(kx - hx, ky - hy) || 1;
  const dx = (kx - hx) / len;
  const dy = (ky - hy) / len;
  s.begin();
  s.stroke(hx - dx * 2.5, hy - dy * 2.5, kx, ky, 0.7, FORGE.wood[1]);
  s.shadeEdges(FORGE.wood[1], FORGE.wood[2], FORGE.wood[0]);
  s.commit();
  const nx = -dy;
  const ny = dx;
  const corner = (a: number, b: number): Pt => [kx + dx * a + nx * b, ky + dy * a + ny * b];
  s.begin();
  s.poly([corner(-2.2, -4.5), corner(2.6, -4.5), corner(2.6, 4.5), corner(-2.2, 4.5)], FORGE.iron[3]);
  s.shadeEdges(FORGE.iron[3], FORGE.iron[4], FORGE.iron[1], 2);
  s.commit();
  s.begin();
  const face = p.heat > 0.3 ? M[Math.min(5, 2 + Math.round(p.heat * 3))] : FORGE.iron[2];
  const [ax, ay] = corner(-2, 4.6);
  const [bx, by] = corner(2.4, 4.6);
  s.hairline(ax, ay, bx, by, face);
  const [cx, cy] = corner(-2, 4.1);
  const [ex, ey] = corner(2.4, 4.1);
  s.hairline(cx, cy, ex, ey, p.heat > 0.3 ? M[2] : FORGE.iron[2]);
  s.commit(false);
  s.begin();
  s.dot(hx, hy, 1.3, S[3]);
  s.shadeEdges(S[3], S[4], S[1]);
  s.commit();
}

function shield(s: SpriteCanvas, p: Pose): void {
  const [sx, sy] = p.shield;
  const tilt = p.shieldTilt;
  const at = (x: number, y: number): Pt => [sx + x + y * tilt * -0.4, sy + y];
  s.begin();
  s.poly([at(1, -22), at(6, -21), at(6.4, -6), at(3.5, -2), at(0.6, -6)], FORGE.iron[2]);
  s.shadeEdges(FORGE.iron[2], FORGE.iron[3], FORGE.iron[0], 2);
  s.commit();
  s.begin();
  const rim: Pt[] = [at(1, -22), at(6, -21), at(6.4, -6), at(3.5, -2), at(0.6, -6), at(1, -22)];
  for (let i = 1; i < rim.length; i++) s.hairline(rim[i - 1][0], rim[i - 1][1], rim[i][0], rim[i][1], B[2]);
  const [ux, uy] = at(3.6, -15);
  s.block(ux - 1.5, uy, B[1], 3, 1);
  s.block(ux - 0.5, uy + 1, B[1], 1, 2);
  s.block(ux - 1.2, uy + 3, B[2], 2.4, 0.8);
  s.set(ux - 1.5, uy, FORGE.brassGlint);
  for (const [x, y] of [
    [2, -19.5],
    [5, -19],
    [2, -8],
    [5, -8],
  ] as const) {
    const [rx, ry] = at(x, y);
    s.set(rx, ry, FORGE.ironGlint);
  }
  s.commit(false);
}

export function drawForgeguard(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  const shouldered = e.state === "walk";
  if (shouldered) hammer(s, p);
  if (shouldered) hammerArm(s, p);
  legs(s, p);
  torso(s, p);
  helm(s, p);
  if (!shouldered) hammerArm(s, p);
  if (!shouldered) hammer(s, p);
  pauldron(s, p);
  shield(s, p);
  s.outline(FORGE.outline);
  return s;
}
