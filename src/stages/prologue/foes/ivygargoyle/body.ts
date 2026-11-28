import type { SpriteCanvas } from "../../../../engine/sprite";
import { glowEye } from "../../../../game/enemies/day/paint";
import { mix, WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { GARGOYLE_COLORS as C } from "./colors";
import type { GargoylePose } from "./pose";

const S = C.slate;
type Pt = readonly [number, number];
const CRACK: readonly Pt[] = [
  [2, -4.5],
  [3.8, -1.5],
  [2.4, 1.2],
  [4, 4.2],
];
const WOUNDS: readonly (readonly [number, number, number])[] = [
  [1.5, -2.5, 2.2],
  [-3, 0.5, 1.6],
  [1, 4, 1.5],
];
const LEAVES: readonly Pt[] = [
  [-5.5, -2.5],
  [-2, 2.8],
  [1.5, 5.6],
  [2, -11.6],
];

export function drawTail(s: SpriteCanvas, p: GargoylePose): void {
  const y = p.bob;
  s.begin();
  s.taper(-4, 6 + y, -13, 9.5 + y, 1.5, 0.6, S[1], -1.6);
  s.poly(
    [
      [-12.5, 7.6 + y],
      [-17, 10 + y],
      [-13, 11.4 + y],
    ],
    S[1],
  );
  s.shadeEdges(S[1], S[2], S[0]);
  s.commit();
}

export function drawFarLimbs(s: SpriteCanvas, p: GargoylePose): void {
  const y = p.bob;
  s.begin();
  s.dot(-3, 6 + y, 3, S[1]);
  s.stroke(-2.5, 8 + y, -1.5, 10.4, 1.1, S[1]);
  s.shadeEdges(S[1], S[2], S[0]);
  s.hairline(-2, 11, 1, 11, C.claw);
  s.commit();
}

function torso(s: SpriteCanvas, y: number): void {
  s.begin();
  s.dot(-1.5, -1.5 + y, 5.6, S[2]);
  s.dot(3, 0 + y, 5, S[2]);
  s.dot(0.5, 4.5 + y, 4.4, S[2]);
  s.shadeEdges(S[2], S[3], S[1], 2);
  for (let gy = -6; gy <= 8; gy += 1.5)
    for (let gx = -6; gx <= 7; gx += 1.5) {
      if (grain(gx * 3 + 11, gy * 3) < 0.86) continue;
      if (Math.hypot(gx - 0.5, gy - 1) > 5) continue;
      s.set(gx, gy + y, S[1]);
    }
  s.hairline(1, 4 + y, 6, 2.8 + y, S[1]);
  s.hairline(0.5, 6 + y, 4.5, 5.4 + y, S[1]);
  s.set(-4, -5.5 + y, C.slateGlint);
  s.set(-3.5, -6 + y, C.slateGlint);
  s.set(1.5, -4.2 + y, C.slateGlint);
  s.commit();
}

function cracks(s: SpriteCanvas, p: GargoylePose): void {
  const y = p.bob;
  const hot = p.heat > 0.8 ? WHITE : mix(C.crack, C.crackHot, p.heat);
  s.begin();
  for (let i = 1; i < CRACK.length; i++)
    s.hairline(CRACK[i - 1][0], CRACK[i - 1][1] + y, CRACK[i][0], CRACK[i][1] + y, mix(C.crackDeep, C.crack, p.heat));
  s.set(3.8, -1.5 + y, hot);
  s.set(2.4, 1.2 + y, p.heat > 0.5 ? hot : C.crack);
  if (p.open > 0)
    for (const [x, wy, r] of WOUNDS) {
      s.dot(x, wy + y, r * p.open, C.crackDeep);
      s.dot(x, wy + y, r * p.open * 0.6, C.crack);
      s.set(x, wy + y, hot);
    }
  s.commit(false);
}

function horns(s: SpriteCanvas, y: number): void {
  s.begin();
  s.taper(7.5, -10.5 + y, 5, -14.5 + y, 0.9, 0.3, C.horn[1], -0.8);
  s.shadeEdges(C.horn[1], C.horn[2], C.horn[0]);
  s.commit();
  s.begin();
  s.taper(5, -10.5 + y, -1, -16 + y, 1.5, 0.4, C.horn[2], -1.6);
  s.shadeEdges(C.horn[2], C.horn[3], C.horn[1]);
  s.hairline(3.5, -12 + y, 4.2, -10.8 + y, C.horn[1]);
  s.hairline(1.5, -13.6 + y, 2.4, -12.6 + y, C.horn[1]);
  s.commit();
}

function head(s: SpriteCanvas, p: GargoylePose): void {
  const y = p.bob;
  horns(s, y);
  s.begin();
  s.dot(6.5, -7 + y, 4, S[2]);
  s.poly(
    [
      [8.5, -9 + y],
      [12.5, -7.8 + y],
      [12.5, -5 + y],
      [9, -4.2 + y],
    ],
    S[2],
  );
  s.shadeEdges(S[2], S[3], S[1], 2);
  s.commit();
  const drop = p.jaw * 2;
  s.begin();
  s.poly(
    [
      [7.5, -4.6 + y],
      [12, -4.4 + y + drop],
      [11.5, -3 + y + drop],
      [7.5, -2.6 + y],
    ],
    S[1],
  );
  s.shadeEdges(S[1], S[2], S[0]);
  s.commit();
  s.begin();
  if (drop > 0.6) s.block(9, -4.6 + y, C.crackDeep, 2.5, drop * 0.6);
  s.block(11, -4.6 + y, C.claw, 0.5, 1);
  s.block(9.5, -4.6 + y, C.claw, 0.5, 1);
  s.hairline(6.8, -9.4 + y, 10.8, -8.6 + y, S[0]);
  s.hairline(7, -9.8 + y, 10, -9.2 + y, S[3]);
  const fierce = p.heat > 0.6;
  glowEye(s, 9, -8 + y, fierce ? C.crackHot : C.crack, fierce ? WHITE : C.eye);
  s.set(12, -6.8 + y, S[0]);
  s.commit(false);
}

function nearLimbs(s: SpriteCanvas, p: GargoylePose): void {
  const y = p.bob;
  s.begin();
  s.dot(0, 6.5 + y, 3.6, S[2]);
  s.stroke(1, 9 + y, 2.5, 10.4, 1.2, S[2]);
  s.shadeEdges(S[2], S[3], S[1]);
  s.commit();
  s.begin();
  s.stroke(4, -1 + y, 7.5, 6 + y, 1.3, S[2]);
  s.dot(7.5, 6 + y, 1.5, S[2]);
  s.shadeEdges(S[2], S[3], S[1]);
  s.hairline(7, 7.4 + y, 8.4, 9.4 + y, C.claw);
  s.hairline(8.4, 7 + y, 10, 8.6 + y, C.claw);
  s.hairline(1.5, 11, 5, 11, C.claw);
  s.commit();
}

function ivy(s: SpriteCanvas, y: number): void {
  s.begin();
  s.taper(-6.5, -4 + y, 3.5, 6.5 + y, 0.6, 0.4, C.ivy[1], 2);
  s.taper(3, -9 + y, 1.5, -12.5 + y, 0.45, 0.3, C.ivy[1], 0.5);
  s.shadeEdges(C.ivy[1], C.ivy[2], C.ivy[0]);
  for (const [x, ly] of LEAVES) {
    s.block(x - 0.5, ly - 0.5 + y, C.ivy[3], 1.5);
    s.set(x - 0.5, ly - 0.5 + y, C.ivy[4]);
    s.set(x + 0.5, ly + 0.5 + y, C.ivy[2]);
  }
  s.commit();
}

export function drawGargoyleBody(s: SpriteCanvas, p: GargoylePose): void {
  torso(s, p.bob);
  ivy(s, p.bob);
  cracks(s, p);
  head(s, p);
  nearLimbs(s, p);
}
