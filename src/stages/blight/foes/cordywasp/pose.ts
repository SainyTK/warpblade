import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, ease } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { WASP_TIMES } from "./moves";

export interface WaspPose {
  curl: number;
  swell: number;
  wingUp: boolean;
  hot: boolean;
  spent: boolean;
}

export function waspPose(e: Enemy, time: number): WaspPose {
  const windup = waveScale(game.wave).windup;
  const wingUp = Math.floor(time * 28) % 2 === 0;
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / (WASP_TIMES.swell * windup)));
    return { curl: 0.1, swell: k, wingUp, hot: k > 0.6, spent: false };
  }
  if (e.state === "shoot") return { curl: 0, swell: 0, wingUp, hot: false, spent: true };
  if (e.state === "charge") {
    const k = ease.outCubic(clamp(e.st / (WASP_TIMES.rear * windup)));
    return { curl: k, swell: 0, wingUp, hot: true, spent: false };
  }
  if (e.state === "dive")
    return { curl: 1, swell: 0, wingUp: Math.floor(time * 40) % 2 === 0, hot: true, spent: false };
  if (e.state === "recover") return { curl: 0.3, swell: 0, wingUp, hot: false, spent: e.st < 0.4 };
  return { curl: 0, swell: 0, wingUp, hot: false, spent: false };
}
