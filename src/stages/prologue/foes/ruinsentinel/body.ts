import type { SpriteCanvas } from "../../../../engine/sprite";
import { glowEye } from "../../../../game/enemies/day/paint";
import { mix, WHITE } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { SENTINEL_COLORS as C } from "./colors";
import type { SentinelPose } from "./pose";

const R = C.stone;
type Pt = readonly [number, number];
const CRACK: readonly Pt[] = [
  [-2, -26],
  [-0.5, -23.5],
  [-1.5, -21],
  [0.5, -18.5],
  [0, -16],
];

function leg(s: SpriteCanvas, x: number, top: number, near: boolean): void {
  const base = near ? R[2] : R[1];
  s.begin();
  s.poly(
    [
      [x - 2, top],
      [x + 2, top],
      [x + 2.4, -2],
      [x - 2.2, -2],
    ],
    base,
  );
  s.poly(
    [
      [x - 2.6, -2.5],
      [x + 3.8, -2.5],
      [x + 4, 0],
      [x - 2.8, 0],
    ],
    base,
  );
  s.shadeEdges(base, near ? R[3] : R[2], near ? R[1] : R[0], 2);
  s.hairline(x - 2, top + 3.5, x + 2, top + 3, near ? R[1] : R[0]);
  s.commit();
}

function torso(s: SpriteCanvas, lean: number, drop: number): void {
  const l = lean;
  const d = drop;
  s.begin();
  s.poly(
    [
      [-6 + l * 0.5, -10 + d],
      [6 + l * 0.5, -10 + d],
      [5 + l * 0.6, -15 + d],
      [-5 + l * 0.6, -15 + d],
    ],
    R[1],
  );
  s.shadeEdges(R[1], R[2], R[0]);
  for (const x of [-3, 0, 3]) s.hairline(x + l * 0.5, -14 + d, x * 1.15 + l * 0.5, -10.5 + d, R[0]);
  s.commit();
  s.begin();
  s.poly(
    [
      [-5 + l * 0.7, -14 + d],
      [5 + l * 0.7, -14 + d],
      [7 + l, -26 + d],
      [-7 + l, -26 + d],
    ],
    R[2],
  );
  s.shadeEdges(R[2], R[3], R[1], 2);
  for (let y = -25; y <= -15; y += 1.5)
    for (let x = -6; x <= 6; x += 1.5) {
      if (grain(x * 3, y * 3) < 0.84) continue;
      s.set(x + l * 0.8, y + d, R[1]);
    }
  s.hairline(-6 + l, -21 + d, 6 + l, -21 + d, R[1]);
  s.hairline(-5.5 + l, -17.5 + d, 5.5 + l, -17.5 + d, R[1]);
  s.hairline(2 + l, -21 + d, 2.5 + l, -17.5 + d, R[1]);
  s.hairline(-3 + l, -25.5 + d, -3 + l, -21 + d, R[1]);
  s.set(-5 + l, -25.5 + d, C.stoneGlint);
  s.commit();
}

function cracks(s: SpriteCanvas, lean: number, drop: number, heat: number): void {
  const hot = heat > 0.75 ? WHITE : mix(C.crack, C.crackHot, heat);
  s.begin();
  for (let i = 1; i < CRACK.length; i++) {
    const [ax, ay] = CRACK[i - 1];
    const [bx, by] = CRACK[i];
    s.hairline(ax + lean * 0.9, ay + drop, bx + lean * 0.9, by + drop, C.crack);
  }
  s.set(-0.5 + lean * 0.9, -23.5 + drop, hot);
  s.set(0.5 + lean * 0.9, -18.5 + drop, hot);
  if (heat > 0.5) s.set(-1.5 + lean * 0.9, -21 + drop, hot);
  s.commit(false);
}

function pauldrons(s: SpriteCanvas, lean: number, drop: number): void {
  s.begin();
  s.dot(-5.5 + lean, -25 + drop, 3.4, R[2]);
  s.dot(5.5 + lean, -25 + drop, 3.6, R[2]);
  s.shadeEdges(R[2], R[4], R[1], 2);
  s.commit();
  s.begin();
  for (let i = 0; i < 5; i++) s.dot(-8 + i * 2.2 + lean, -27.4 + drop + Math.sin(i * 1.7) * 0.5, 1.1, C.moss[1]);
  s.taper(-8.4 + lean, -26 + drop, -9.2 + lean, -20 + drop, 0.5, 0.25, C.moss[1], 0.6);
  s.shadeEdges(C.moss[1], C.moss[2], C.moss[0]);
  s.set(-8.4 + lean, -28.4 + drop, C.moss[4]);
  s.set(-4 + lean, -28.6 + drop, C.moss[4]);
  s.set(-6 + lean, -28.2 + drop, C.moss[3]);
  s.commit();
}

function helm(s: SpriteCanvas, lean: number, drop: number, heat: number): void {
  const hx = 1 + lean;
  const hy = -31 + drop;
  s.begin();
  s.poly(
    [
      [hx - 4, hy + 4],
      [hx + 4.5, hy + 4],
      [hx + 4.5, hy - 2],
      [hx + 2, hy - 4.5],
      [hx - 2.5, hy - 4.5],
      [hx - 4.2, hy - 2],
    ],
    R[2],
  );
  s.shadeEdges(R[2], R[4], R[1], 2);
  s.poly(
    [
      [hx - 1, hy - 4.5],
      [hx + 1, hy - 4.5],
      [hx + 0.5, hy - 7],
      [hx - 1.5, hy - 6],
    ],
    R[3],
  );
  s.commit();
  s.begin();
  s.block(hx + 0.5, hy - 0.5, C.stoneDeep, 4, 1.5);
  s.commit(false);
  s.begin();
  const fierce = heat > 0.5;
  glowEye(s, hx + 2.5, hy - 0.5, fierce ? C.crackHot : C.crack, fierce ? WHITE : C.eye);
  s.set(hx + 1.5, hy, C.crackDeep);
  s.set(hx - 3, hy - 3, C.stoneGlint);
  s.commit(false);
  s.begin();
  s.taper(hx - 4, hy - 1, hx - 4.6, hy + 4, 0.6, 0.3, C.moss[1]);
  s.shadeEdges(C.moss[1], C.moss[2], C.moss[0]);
  s.commit();
}

function arm(s: SpriteCanvas, from: Pt, to: Pt, near: boolean): void {
  const base = near ? R[2] : R[1];
  s.begin();
  s.stroke(from[0], from[1], to[0], to[1], 1.6, base);
  s.shadeEdges(base, near ? R[3] : R[2], R[0]);
  s.dot(to[0], to[1], 1.6, base);
  s.commit();
}

export function drawFarSide(s: SpriteCanvas, p: SentinelPose): void {
  leg(s, -2.5 - p.step, -11 + p.drop, false);
}

export function drawBody(s: SpriteCanvas, p: SentinelPose): void {
  leg(s, 2 + p.step, -11 + p.drop, true);
  torso(s, p.lean, p.drop);
  cracks(s, p.lean, p.drop, p.heat);
  arm(s, [-5 + p.lean, -24 + p.drop], [p.handX, p.handY], false);
  helm(s, p.lean, p.drop, p.heat);
  pauldrons(s, p.lean, p.drop);
}

export function drawShieldArm(s: SpriteCanvas, p: SentinelPose): void {
  arm(s, [5.5 + p.lean, -24 + p.drop], [p.shieldX + p.lean - 1, p.shieldY - 13], true);
}
