import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BOOKMITE } from "./moves";

export interface BookmitePose {
  open: number;
  lift: number;
  tilt: number;
  stride: number;
  tuck: number;
}

export function bookmitePose(e: Enemy, time: number): BookmitePose {
  if (e.stagger > 0 || e.stun > 0) return { open: 0.15, lift: 0, tilt: 0.25, stride: 0, tuck: 1 };
  if (e.state === "wind") {
    const k = clamp(e.st / (BOOKMITE.wind * waveScale(game.wave).windup));
    return { open: 0.35 * k + Math.sin(time * 50) * 0.05 * k, lift: 1, tilt: -0.35 * k, stride: 0, tuck: 0.6 * k };
  }
  if (e.state === "lunge")
    return { open: e.vy < 0 ? 1 : 0.25, lift: 1, tilt: e.vy < 0 ? -0.2 : 0.25, stride: 0, tuck: 1 };
  if (e.state === "recover") return { open: 0, lift: 0, tilt: 0, stride: 0, tuck: 0.5 };
  const moving = Math.abs(e.vx) > 4;
  return {
    open: 0,
    lift: moving ? Math.abs(Math.sin(time * 16)) * 0.6 : 0,
    tilt: 0,
    stride: moving ? time * 16 : 0,
    tuck: 0,
  };
}
