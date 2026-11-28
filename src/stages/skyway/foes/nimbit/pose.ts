import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { NIMBIT_HOP } from "./moves";

export interface NimbitPose {
  squash: number;
  lift: number;
  step: number;
  storm: number;
  spark: boolean;
  dazed: boolean;
}

export function nimbitPose(e: Enemy, time: number): NimbitPose {
  if (e.state === "wind") {
    const u = clamp(e.st / (NIMBIT_HOP.windup * waveScale(game.wave).windup));
    return { squash: 1.6 * u, lift: 0, step: 0, storm: u, spark: Math.sin(e.st * (20 + u * 40)) > 0, dazed: false };
  }
  if (e.state === "hop") return { squash: -1.4, lift: 1, step: 0, storm: 1, spark: true, dazed: false };
  if (e.state === "recover") return { squash: 0.8, lift: 0, step: 0, storm: 0.3, spark: false, dazed: true };
  const walking = Math.abs(e.vx) > 4;
  const step = walking ? Math.sin(time * 12) : 0;
  return {
    squash: walking ? Math.abs(step) * 0.5 : Math.sin(time * 3) * 0.3,
    lift: 0,
    step,
    storm: 0,
    spark: false,
    dazed: false,
  };
}
