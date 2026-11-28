import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { HUSHWARDEN } from "./moves";

type Pt = readonly [number, number];

export interface HushwardenPose {
  hand: Pt;
  book: Pt;
  tilt: number;
  raise: number;
  lean: number;
  glare: boolean;
  eye: number;
  slack: number;
}

export const SWING_HAND: Pt = [4, -40];

const swingAt = (a: number): Pt => [
  SWING_HAND[0] + Math.cos(a) * HUSHWARDEN.arc.radius,
  SWING_HAND[1] + Math.sin(a) * HUSHWARDEN.arc.radius,
];

export function hushwardenPose(e: Enemy, time: number): HushwardenPose {
  const windup = waveScale(game.wave).windup;
  if (e.state === "wind") {
    const k = clamp(e.st / (HUSHWARDEN.sweepWind * windup));
    const a = -Math.PI / 2 - 0.4 - time * (6 + k * 8);
    const r = 10 + k * 3;
    return {
      hand: [2, -50],
      book: [Math.cos(a) * r, -60 + Math.sin(a) * r * 0.45],
      tilt: a,
      raise: 0,
      lean: -1.5 * k,
      glare: true,
      eye: k,
      slack: 0,
    };
  }
  if (e.state === "swipe") {
    const k = clamp(e.st / HUSHWARDEN.sweep);
    const { from, to } = HUSHWARDEN.arc;
    const a = from + (to - from) * Math.min(1, k * 1.6);
    return {
      hand: SWING_HAND,
      book: swingAt(a),
      tilt: a + Math.PI / 2,
      raise: 0,
      lean: 3,
      glare: true,
      eye: 1,
      slack: 0,
    };
  }
  if (e.state === "recover" && e.ay === HUSHWARDEN.sweepRecover) {
    const k = clamp((e.st - (e.ay - 0.45)) / 0.45);
    const drag: Pt = [HUSHWARDEN.reach - 8 - k * 30, -5 - k * 14];
    return {
      hand: [10, -28],
      book: drag,
      tilt: 0.1,
      raise: 0,
      lean: 2.5 * (1 - k),
      glare: false,
      eye: 0,
      slack: 1 - k,
    };
  }
  if (e.state === "summon") {
    const k = clamp(e.st / (HUSHWARDEN.summonCast * windup * 0.4));
    return { hand: [8, -24], book: [10, -14], tilt: 0.2, raise: k, lean: -0.5, glare: true, eye: 0.4, slack: 0 };
  }
  const bob = Math.sin(time * 2.4) * 0.5;
  return { hand: [8, -27 + bob], book: [12, -26 + bob], tilt: 0, raise: 0, lean: 0, glare: false, eye: 0, slack: 0 };
}
