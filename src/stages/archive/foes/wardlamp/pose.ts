import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { WARDLAMP } from "./moves";

export interface WardlampPose {
  tilt: number;
  flame: number;
  gold: boolean;
  glare: boolean;
}

export function wardlampPose(e: Enemy, time: number): WardlampPose {
  const sway = Math.sin(time * 1.8) * 0.08 - e.vx * 0.004;
  if (e.state === "summon") {
    const k = clamp(e.st / WARDLAMP.wardCast);
    return { tilt: sway * 0.3, flame: 1 + k * 0.5 + Math.sin(time * 30) * 0.1, gold: true, glare: true };
  }
  if (e.state === "wind") {
    const k = clamp(e.st / (WARDLAMP.pour * waveScale(game.wave).windup));
    return { tilt: Math.sin(time * 14) * 0.12 * k + sway, flame: 1 + k * 0.7, gold: false, glare: true };
  }
  if (e.state === "shoot") return { tilt: Math.sin(time * 20) * 0.35, flame: 1.5, gold: false, glare: true };
  if (e.state === "recover") {
    const k = clamp(e.st / WARDLAMP.recover);
    return { tilt: sway * 2, flame: 0.35 + 0.65 * k * k, gold: false, glare: false };
  }
  return { tilt: sway, flame: 1 + Math.sin(time * 9) * 0.08, gold: false, glare: false };
}
