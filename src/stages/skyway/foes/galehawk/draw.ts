import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { SKY_FOES as C } from "../colors";
import { featherWing, type WingStyle } from "../wing";
import { HAWK_DIVE } from "./update";

const canvas = detailCanvas(50, 40, 25, 20);
const WING: WingStyle = { span: 17, chord: 7, fingers: 5, feathers: C.copper, tip: C.volt[3], tipHot: C.volt[4] };
const RAISED = -Math.PI / 2 - 0.4;
const LOWERED = Math.PI / 2 + 0.35;
const FOLDED = Math.PI - 0.22;

interface HawkPose {
  flap: number;
  spread: number;
  tilt: number;
  charge: number;
  reach: number;
}

function poseOf(e: Enemy, time: number): HawkPose {
  if (e.state === "wind") {
    const charge = clamp(e.st / (HAWK_DIVE.windup * waveScale(game.wave).windup));
    return { flap: -1 + Math.sin(time * 40) * 0.06, spread: 0.95, tilt: -0.3 * charge, charge, reach: charge };
  }
  if (e.state === "dive") {
    const tilt = Math.atan2(e.vy, Math.abs(e.vx) || 1);
    return { flap: 0, spread: 0, tilt, charge: 1, reach: 1 };
  }
  if (e.state === "recover") return { flap: Math.sin(time * 17), spread: 1, tilt: -0.32, charge: 0, reach: 0.4 };
  const beat = Math.sin(time * 9);
  return { flap: beat, spread: 1, tilt: Math.sin(time * 1.7) * 0.06, charge: 0, reach: 0 };
}

function wingAngle(p: HawkPose): number {
  if (p.spread < 0.2) return FOLDED;
  return lerp(RAISED, LOWERED, (p.flap + 1) / 2);
}

function tail(s: SpriteCanvas, at: (x: number, y: number) => readonly [number, number]): void {
  s.begin();
  s.poly([at(-5, -1.4), at(-12.5, -3.2), at(-14.2, -0.6), at(-13.4, 2.2), at(-5, 1.4)], C.copper[2]);
  s.shadeEdges(C.copper[2], C.copper[3], C.copper[1]);
  for (const u of [-9, -11.5]) {
    const [x0, y0] = at(u, -2.2);
    const [x1, y1] = at(u - 0.6, 1.6);
    s.hairline(x0, y0, x1, y1, C.cream[1]);
  }
  for (const v of [-2.6, -0.6, 1.4]) {
    const [x, y] = at(-13.6, v);
    s.set(x, y, C.cream[3]);
  }
  s.commit();
}

function talons(s: SpriteCanvas, at: (x: number, y: number) => readonly [number, number], reach: number): void {
  const [hx, hy] = at(1.5, 2.2);
  const [fx, fy] = at(lerp(-0.5, 6, reach), lerp(4.6, 5.4, reach));
  s.begin();
  s.stroke(hx, hy, fx, fy, 0.75, C.talon);
  s.shadeEdges(C.talon, C.beak[3], C.talonDeep);
  for (const k of [-1, 0, 1]) {
    s.set(fx + 0.5 + k * 0.5, fy + 0.8, C.talonDeep);
  }
  s.commit();
}

function body(s: SpriteCanvas, at: (x: number, y: number) => readonly [number, number]): void {
  const [x0, y0] = at(-6, 0);
  const [x1, y1] = at(5, -0.6);
  s.begin();
  s.taper(x0, y0, x1, y1, 3.1, 2.7, C.copper[3], 0.6);
  s.shadeEdges(C.copper[3], C.copper[4], C.copper[1], 2);
  s.commit();
  s.begin();
  const [bx, by] = at(1.4, 1.3);
  s.dot(bx, by, 2.1, C.cream[2]);
  s.shadeEdges(C.cream[2], C.cream[3], C.cream[1]);
  for (const [u, v] of [
    [0, 1.6],
    [2, 1],
    [1.2, 2.4],
    [-0.8, 0.8],
  ] as const) {
    const [x, y] = at(u, v);
    s.set(x, y, C.copper[2]);
  }
  s.commit();
}

function head(s: SpriteCanvas, at: (x: number, y: number) => readonly [number, number], fierce: boolean): void {
  s.begin();
  const [c0, c1] = at(5.2, -3.2);
  const [t0, t1] = at(2.6, -6);
  const [d0, d1] = at(5.8, -3.6);
  const [u0, u1] = at(3.8, -7.2);
  s.taper(c0, c1, t0, t1, 0.8, 0.3, C.copper[3], 0.4);
  s.taper(d0, d1, u0, u1, 0.8, 0.3, C.copper[3], 0.6);
  s.shadeEdges(C.copper[3], C.copper[4], C.copper[2]);
  s.set(t0, t1, C.volt[3]);
  s.set(u0, u1, fierce ? C.volt[4] : C.volt[3]);
  s.commit();
  s.begin();
  const [hx, hy] = at(7, -1.6);
  s.dot(hx, hy, 2.6, C.copper[3]);
  s.shadeEdges(C.copper[3], C.copper[4], C.copper[1]);
  const [m0, m1] = at(6, -1.2);
  const [m2, m3] = at(8.8, -0.8);
  s.hairline(m0, m1, m2, m3, C.copper[0]);
  const [cx, cy] = at(7.2, 0);
  s.set(cx, cy, C.cream[3]);
  s.commit();
  s.begin();
  s.poly([at(8.8, -2.6), at(11.6, -1.8), at(11, 0.3), at(9.8, -0.2), at(8.8, -0.6)], C.beak[2]);
  s.shadeEdges(C.beak[2], C.beak[3], C.beak[1]);
  const [tx, ty] = at(11, 0);
  s.set(tx, ty, C.talonDeep);
  s.commit();
  s.begin();
  const [ex, ey] = at(8, -2.2);
  s.block(ex - 0.5, ey - 0.5, fierce ? C.volt[3] : C.hawkEye);
  s.set(ex, ey - 0.5, fierce ? WHITE : C.hawkEye);
  s.set(ex - 0.5, ey - 0.5, WHITE);
  s.commit();
}

export function drawGalehawk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const cos = Math.cos(p.tilt);
  const sin = Math.sin(p.tilt);
  const at = (x: number, y: number) => [x * cos - y * sin, x * sin + y * cos] as const;
  const angle = wingAngle(p) + p.tilt;
  const [rx, ry] = at(0.5, -1.6);
  s.clear();
  featherWing(s, { x: rx - 1, y: ry - 0.6, angle: angle - 0.25, spread: p.spread, dim: 0.62, charge: p.charge }, WING);
  tail(s, at);
  talons(s, at, p.reach);
  body(s, at);
  head(s, at, p.charge > 0.3);
  featherWing(s, { x: rx, y: ry, angle, spread: p.spread, dim: 1, charge: p.charge }, WING);
  s.outline(C.outline);
  return s;
}
