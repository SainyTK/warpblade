import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { cg } from "../../../utils/color";
import { clamp, ease, lerp } from "../../../utils/math";
import { KNIGHT_COLORS as C } from "./knightColors";
import { arriveTime, flickering, flickerTime, KNIGHT, raiseTime } from "./knightMoves";

const canvas = detailCanvas(76, 56, 38, 48);
const BLADE = 17;
const TORSO: readonly (readonly [number, number])[] = [
  [-5, -12],
  [-6, -19],
  [-3.5, -24],
  [3.5, -24],
  [6, -19.5],
  [5, -12],
];
const TABARD: readonly (readonly [number, number])[] = [
  [-4, -13],
  [4.5, -13],
  [5, -5],
  [2, -3.5],
  [-1, -5.5],
  [-4.5, -4],
];

interface KnightPose {
  hx: number;
  hy: number;
  angle: number;
  stride: number;
  lean: number;
  smear: number;
  smearFrom: number;
}

const pose: KnightPose = { hx: 0, hy: 0, angle: 0, stride: 0, lean: 0, smear: 0, smearFrom: 0 };
const UP = -Math.PI / 2;
const BACK = -Math.PI * 0.86;
const DOWN = 0.4;

function poseOf(e: Enemy, time: number): KnightPose {
  pose.smear = 0;
  pose.lean = 0;
  pose.stride = 0;
  if (e.stun > 0 || e.air) {
    Object.assign(pose, { hx: 6, hy: -9, angle: 0.9, lean: -1 });
    return pose;
  }
  if (e.state === "walk" || flickering(e)) {
    const step = e.state === "walk" ? Math.sin(time * 5) : 0;
    Object.assign(pose, { hx: 7, hy: -13 + Math.abs(step) * 0.4, angle: UP + 0.12, stride: step * 2 });
    return pose;
  }
  if (e.state === "wind" || e.state === "charge") {
    const k = ease.outCubic(clamp(e.st / (e.state === "charge" ? arriveTime() : raiseTime())));
    Object.assign(pose, {
      hx: lerp(7, -1, k),
      hy: lerp(-13, -23, k),
      angle: lerp(UP + 0.12, BACK, k),
      lean: -k * 1.2,
      stride: 1.5,
    });
    return pose;
  }
  if (e.state === "swipe") {
    const k = ease.outCubic(clamp(e.st / KNIGHT.cut));
    Object.assign(pose, {
      hx: lerp(-1, 9, k),
      hy: lerp(-23, -12, k),
      angle: lerp(BACK, DOWN, k),
      lean: lerp(-1.2, 2, k),
      stride: 3,
      smear: 1,
      smearFrom: BACK,
    });
    return pose;
  }
  const k = clamp(e.st / KNIGHT.recover);
  Object.assign(pose, {
    hx: lerp(9, 8, k),
    hy: lerp(-12, -12, k),
    angle: lerp(DOWN + 0.3, UP + 0.4, k * k),
    lean: 1.5 * (1 - k),
    stride: 3 * (1 - k),
  });
  return pose;
}

function legs(s: SpriteCanvas, p: KnightPose): void {
  s.begin();
  s.taper(-2, -11, -4 - p.stride, -1, 2.6, 2, C.steelDark);
  s.block(-6.5 - p.stride, -2, C.steelDark, 5, 2);
  s.shadeEdges(C.steelDark, C.steel, C.steelDeep);
  s.commit();
  s.begin();
  s.taper(2, -11, 3 + p.stride, -1, 2.7, 2.1, C.steel);
  s.block(1.5 + p.stride, -2, C.steel, 5.5, 2);
  s.shadeEdges(C.steel, C.steelLight, C.steelDark);
  s.set(2 + p.stride * 0.6, -7, C.steelRim);
  s.set(2.5 + p.stride * 0.6, -7, C.steelGlint);
  s.commit();
}

function body(s: SpriteCanvas, p: KnightPose, hot: boolean, time: number): void {
  s.shift(p.lean, 0);
  s.begin();
  s.poly(TABARD, C.cloth);
  s.shadeEdges(C.cloth, C.clothLight, C.clothDark, 2);
  s.hairline(0.5, -12, 1, -4.5, C.clothDark);
  s.commit();
  s.begin();
  s.poly(TORSO, C.steel);
  s.shadeEdges(C.steel, C.steelLight, C.steelDark, 2);
  s.hairline(-4, -16, 5, -16, C.steelDark);
  s.hairline(0.5, -23, 0.5, -16.5, C.steelDark);
  s.set(-3, -22.5, C.steelRim);
  s.set(-2.5, -22.5, C.steelGlint);
  s.block(-1, -21, hot ? C.crystalHot : C.crystal, 2, 2);
  s.set(-0.5, -20.5, C.crystalHot);
  s.commit();
  s.begin();
  s.dot(-3.5, -22, 3.4, C.steelLight);
  s.shadeEdges(C.steelLight, C.steelRim, C.steel);
  s.commit();
  s.begin();
  s.taper(-4.5, -24, -9, -31, 1.6, 0.3, C.crystal);
  s.taper(-2.5, -24.5, -4, -32.5, 1.3, 0.3, C.crystal);
  s.taper(-6, -22, -10.5, -25, 1.1, 0.3, C.crystal);
  s.shadeEdges(C.crystal, C.crystalLight, C.crystalDark);
  s.set(-8, -30, C.crystalHot);
  s.commit();
  s.begin();
  s.dot(1.5, -27, 3.6, C.steel);
  s.shadeEdges(C.steel, C.steelLight, C.steelDark, 2);
  const glare = hot || Math.sin(time * 3) > 0.7;
  s.hairline(2.5, -27.5, 5, -27.5, glare ? C.visorHot : C.visor);
  s.hairline(2.5, -27, 4.5, -27, C.visor);
  s.set(0, -29.5, C.steelGlint);
  s.commit();
  s.begin();
  s.taper(0, -30, -4, -37, 1.4, 0.3, C.crystal, 0.8);
  s.taper(1.5, -30.5, 0.5, -35.5, 1, 0.3, C.crystal);
  s.shadeEdges(C.crystal, C.crystalLight, C.crystalDark);
  s.commit();
  s.shift(0, 0);
}

function blade(s: SpriteCanvas, p: KnightPose, hot: boolean): void {
  const ca = Math.cos(p.angle);
  const sa = Math.sin(p.angle);
  const tx = p.hx + ca * BLADE;
  const ty = p.hy + sa * BLADE;
  if (p.smear > 0) {
    s.begin();
    for (let a = p.smearFrom; a < p.angle; a += 0.08) {
      const r0 = BLADE * 0.55;
      for (let r = r0; r <= BLADE + 1; r += 0.5)
        s.set(p.hx + Math.cos(a) * r, p.hy + Math.sin(a) * r, r > BLADE - 1.5 ? C.crystalHot : C.crystalLight);
    }
    s.commit(false);
  }
  s.begin();
  s.taper(2 + p.lean, -21, p.hx, p.hy, 1.9, 1.5, C.steel);
  s.dot(p.hx, p.hy, 1.6, C.steelLight);
  s.shadeEdges(C.steel, C.steelLight, C.steelDark);
  s.commit();
  s.begin();
  s.taper(p.hx + ca * 2, p.hy + sa * 2, tx, ty, 1.7, 0.35, hot ? C.crystalLight : C.crystal);
  s.shadeEdges(hot ? C.crystalLight : C.crystal, C.crystalHot, C.crystalDark);
  s.hairline(
    p.hx + ca * 3,
    p.hy + sa * 3,
    p.hx + ca * (BLADE - 2),
    p.hy + sa * (BLADE - 2),
    hot ? C.crystalHot : C.crystalLight,
  );
  s.hairline(p.hx - sa * 2.6, p.hy + ca * 2.6, p.hx + sa * 2.6, p.hy - ca * 2.6, C.steelRim);
  s.commit();
}

function phaseOut(s: SpriteCanvas, k: number, time: number): void {
  const { d, w, box } = s;
  const band = Math.floor(time * 24) % 3;
  const gone = 0.25 + k * 0.6;
  for (let y = box.y0; y <= box.y1; y++) {
    const cut = ((y + band) % 3) / 3 < gone && (y >> 1) % 2 === band % 2;
    for (let x = box.x0; x <= box.x1; x++) {
      const i = y * w + x;
      if (!d[i]) continue;
      if (cut) {
        d[i] = 0;
        continue;
      }
      const g = cg(d[i]);
      d[i] = g > 200 ? C.crystalHot : g > 120 ? C.crystalLight : g > 60 ? C.crystal : C.crystalDark;
    }
  }
}

export function drawRiftknight(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  const hot = e.state === "wind" || e.state === "charge" || e.state === "swipe";
  s.clear();
  legs(s, p);
  body(s, p, hot, time);
  blade(s, p, hot);
  s.outline(C.outline);
  if (flickering(e)) {
    const k = clamp(e.st / flickerTime());
    if (Math.floor(time * 18) % 2 === 0 || k > 0.6) phaseOut(s, k, time);
  }
  return s;
}
