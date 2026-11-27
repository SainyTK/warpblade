import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { DRONE_TIMES } from "./moves";

export interface DronePose {
  tilt: number;
  heat: number;
  spin: number;
  fill: number;
  wobble: number;
}

export function dronePose(e: Enemy, time: number): DronePose {
  const spin = time * 40;
  if (e.state === "wind") {
    const scale = waveScale(game.wave).windup;
    const track = DRONE_TIMES.track * scale;
    const u = clamp((e.st - track) / (DRONE_TIMES.aim * scale));
    return {
      tilt: u * 0.55,
      heat: Math.max(0.3, u),
      spin: spin * 1.4,
      fill: 1,
      wobble: u > 0.7 ? Math.sin(time * 60) * 0.3 : 0,
    };
  }
  if (e.state === "shoot") {
    const u = clamp(e.st / DRONE_TIMES.pour);
    return { tilt: 0.55 + u * 0.4, heat: 1, spin: spin * 1.4, fill: 1 - u, wobble: 0 };
  }
  if (e.state === "recover") {
    const u = clamp(e.st / DRONE_TIMES.recover);
    return {
      tilt: 0.95 * (1 - u) * (1 - u),
      heat: 0,
      spin: spin * 0.5,
      fill: u > 0.8 ? (u - 0.8) * 5 : 0,
      wobble: Math.sin(time * 9) * (1 - u),
    };
  }
  return { tilt: Math.sin(time * 2) * 0.06, heat: 0.15, spin, fill: 1, wobble: 0 };
}
