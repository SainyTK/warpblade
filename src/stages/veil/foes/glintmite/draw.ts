import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { VEIL } from "../colors";
import { MITE } from "./constants";

const canvas = detailCanvas(28, 24, 14, 19);
const S = VEIL.stone;
const K = VEIL.crystal;
const SHELL: readonly (readonly [number, number])[] = [
  [-6.5, -2],
  [-6, -5],
  [-3.5, -7.5],
  [1, -8],
  [4.5, -6.5],
  [6, -3.5],
  [5.5, -2],
];
const HIPS = [-3.5, 0, 3.5] as const;

interface MitePose {
  lift: number;
  tilt: number;
  tuck: number;
  heat: number;
  gait: number;
}

function poseOf(e: Enemy, time: number): MitePose {
  if (e.stun > 0 || e.air || e.stagger > 0)
    return { lift: 2, tilt: -1.5, tuck: -1, heat: 0, gait: Math.sin(time * 30) };
  if (e.state === "wind") {
    const k = clamp(e.st / MITE.wind);
    return { lift: -k * 1.5, tilt: -k, tuck: 0, heat: k, gait: Math.sin(time * 40) * 0.3 * k };
  }
  if (e.state === "hop") return { lift: 0, tilt: e.vy < 0 ? -1 : 1, tuck: 1, heat: 1, gait: 0 };
  if (e.state === "recover") return { lift: -0.5, tilt: 0, tuck: 0, heat: 0.3, gait: 0 };
  return { lift: 0, tilt: 0, tuck: 0, heat: 0, gait: Math.abs(e.vx) > 4 ? Math.sin(time * 22) : 0 };
}

function legs(s: SpriteCanvas, p: MitePose, far: boolean): void {
  const tone = far ? S[1] : S[3];
  s.begin();
  HIPS.forEach((hx, i) => {
    const swing = (i % 2 === (far ? 1 : 0) ? 1 : -1) * p.gait * 1.5;
    const x = hx + (far ? 1 : 0);
    const hipY = -2.5 + p.lift;
    if (p.tuck > 0) {
      s.stroke(x, hipY, x - 1.5, hipY + 1.5, 0.5, tone);
      return;
    }
    const footY = p.tuck < 0 ? -8 + swing : 0;
    const kneeY = p.tuck < 0 ? hipY - 4 : hipY - 2;
    s.stroke(x, hipY, x + 1.6 + swing * 0.5, kneeY, 0.55, tone);
    s.stroke(x + 1.6 + swing * 0.5, kneeY, x + 2.2 + swing, footY, 0.45, tone);
  });
  s.commit(!far);
}

function shell(s: SpriteCanvas, p: MitePose, time: number): void {
  s.begin();
  s.poly(SHELL, S[2]);
  s.shadeEdges(S[2], S[4], S[1], 2);
  s.hairline(-5, -4.5, 4.5, -4.5, S[1]);
  s.hairline(-1, -7.5, -1.5, -4.5, S[1]);
  s.hairline(2.5, -7, 3, -4.5, S[1]);
  const pulse = 0.5 + 0.5 * Math.sin(time * 3);
  const rune = VEIL.rune[p.heat > 0.5 ? 4 : pulse > 0.6 ? 3 : 2];
  s.hairline(-4.5, -3.5, -2, -3.5, rune);
  s.set(0.5, -3.5, rune);
  s.hairline(2, -3.5, 4, -3.5, rune);
  s.set(-3.5, -7, S[5]);
  s.commit();
  s.begin();
  s.dot(6.5, -3.5, 2.2, S[2]);
  s.shadeEdges(S[2], S[4], S[1]);
  s.set(7.5, -4.5, p.heat > 0.6 ? VEIL.eyeHot : VEIL.eye);
  s.set(6.5, -4.5, VEIL.eye);
  s.hairline(8, -2.5, 9.5, -1.5, S[4]);
  s.commit();
}

function crystals(s: SpriteCanvas, p: MitePose): void {
  const base = p.heat > 0.5 ? K[3] : K[2];
  s.begin();
  s.taper(-1.5, -7, -4.5, -14.5 - p.heat, 2, 0.4, base);
  s.taper(1.5, -7.5, 3, -12, 1.4, 0.3, base);
  s.taper(-4, -6, -7, -10, 1.1, 0.3, base);
  s.shadeEdges(base, K[4], K[1]);
  s.hairline(-2, -8, -4, -13.5, p.heat > 0.5 ? VEIL.eyeHot : K[3]);
  s.commit();
}

export function drawGlintmite(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = poseOf(e, time);
  s.clear();
  s.shift(0, p.tilt * 0.5);
  legs(s, p, true);
  s.shift(0, p.lift);
  crystals(s, p);
  shell(s, p, time);
  s.shift(0, 0);
  legs(s, p, false);
  s.outline(VEIL.outline);
  return s;
}
