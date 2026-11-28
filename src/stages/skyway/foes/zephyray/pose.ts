import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { RAY_VOLLEY } from "./constants";

export interface RayPose {
  flap: number;
  curl: number;
  tilt: number;
  charge: number;
  whip: number;
}

export function rayPose(e: Enemy, time: number): RayPose {
  if (e.state === "wind") {
    const u = clamp(e.st / (RAY_VOLLEY.windup * waveScale(game.wave).windup));
    return { flap: -0.6 * u, curl: u, tilt: -0.12 * u, charge: u, whip: Math.sin(time * 14) * u };
  }
  if (e.state === "shoot") return { flap: 1, curl: 0, tilt: 0.1, charge: 1, whip: 1 };
  if (e.state === "recover") return { flap: Math.sin(time * 3) * 0.3, curl: 0, tilt: 0.18, charge: 0, whip: 0 };
  return { flap: Math.sin(time * 2.4), curl: 0, tilt: Math.sin(time * 1.2) * 0.06, charge: 0, whip: 0 };
}
