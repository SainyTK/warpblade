import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, ease } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { MITE_TIMES } from "./moves";

export interface MitePose {
  squash: number;
  tilt: number;
  stride: number;
  tuck: number;
  shiver: number;
  gape: number;
  flail: boolean;
  fierce: boolean;
}

export function mitePose(e: Enemy, time: number): MitePose {
  const rest: MitePose = {
    squash: 0,
    tilt: 0,
    stride: 0,
    tuck: 0,
    shiver: 0,
    gape: 0,
    flail: false,
    fierce: false,
  };
  if (e.stagger > 0 || e.stun > 0 || e.air) return { ...rest, tilt: -0.5, squash: -0.15, flail: true, gape: 1 };
  if (e.state === "walk") {
    const moving = Math.abs(e.vx) > 4;
    return { ...rest, stride: moving ? time * 22 : 0, squash: moving ? Math.abs(Math.sin(time * 22)) * 0.06 : 0 };
  }
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / (MITE_TIMES.crouch * waveScale(game.wave).windup)));
    return { ...rest, squash: 0.28 * k, tilt: 0.12 * k, shiver: Math.sin(time * 70) * 0.4 * k, gape: k, fierce: true };
  }
  if (e.state === "lunge") {
    const u = clamp(e.st / MITE_TIMES.hop);
    return { ...rest, squash: -0.2 * (1 - u), tilt: 0.35 - u * 0.6, tuck: 1, gape: 1, fierce: true };
  }
  const k = clamp(e.st / MITE_TIMES.recover);
  return { ...rest, squash: 0.2 * (1 - k), stride: 0 };
}
