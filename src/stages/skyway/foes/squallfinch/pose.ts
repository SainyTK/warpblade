import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { FINCH_SWOOP } from "./moves";

export interface FinchPose {
  flap: number;
  spread: number;
  tilt: number;
  charge: number;
}

export function finchPose(e: Enemy, time: number): FinchPose {
  if (e.state === "wind") {
    const charge = clamp(e.st / (FINCH_SWOOP.windup * waveScale(game.wave).windup));
    return { flap: -1 + Math.sin(time * 50) * 0.1, spread: 1, tilt: -0.35 * charge, charge };
  }
  if (e.state === "dive") return { flap: 0, spread: 0, tilt: Math.atan2(e.vy, Math.abs(e.vx) || 1), charge: 1 };
  if (e.state === "recover") return { flap: Math.sin(time * 22), spread: 1, tilt: -0.3, charge: 0 };
  return { flap: Math.sin(time * 16), spread: 1, tilt: Math.sin(time * 2.1) * 0.08, charge: 0 };
}
