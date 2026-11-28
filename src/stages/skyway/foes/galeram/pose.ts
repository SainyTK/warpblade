import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { RAM_CHARGE } from "./constants";

export interface RamPose {
  head: number;
  lean: number;
  gait: number;
  paw: number;
  storm: number;
  stretch: number;
  daze: number;
}

export function ramPose(e: Enemy, time: number): RamPose {
  if (e.state === "wind") {
    const u = clamp(e.st / (RAM_CHARGE.windup * waveScale(game.wave).windup));
    const paw = Math.max(0, Math.sin(e.st * 18)) * (u < 0.85 ? 1 : 0);
    return { head: u, lean: -1.5 * u, gait: 0, paw, storm: u, stretch: 0, daze: 0 };
  }
  if (e.state === "charge")
    return { head: 1, lean: 1.5, gait: Math.sin(time * 26), paw: 0, storm: 1, stretch: 1, daze: 0 };
  if (e.state === "recover") {
    const u = clamp(e.st / (e.n > 0 ? RAM_CHARGE.bonk : RAM_CHARGE.recover));
    return {
      head: lerp(0.5, 0, u),
      lean: 0,
      gait: 0,
      paw: 0,
      storm: 0,
      stretch: 0,
      daze: Math.sin(time * 14) * (1 - u),
    };
  }
  const walking = Math.abs(e.vx) > 4;
  return {
    head: Math.sin(time * 2) * 0.06,
    lean: 0,
    gait: walking ? Math.sin(time * 9) : 0,
    paw: 0,
    storm: 0,
    stretch: 0,
    daze: 0,
  };
}
