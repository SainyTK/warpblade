import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BREATH } from "./constants";

export interface WyrmPose {
  wave: number;
  speed: number;
  jaw: number;
  charge: number;
  open: boolean;
  aim: number;
}

export function wyrmPose(e: Enemy): WyrmPose {
  const aim = e.face > 0 ? e.ax : Math.PI - e.ax;
  if (e.state === "wind") {
    const u = clamp(e.st / (BREATH.windup * waveScale(game.wave).windup));
    return { wave: 1.2 - u * 0.6, speed: 6, jaw: u * 0.6, charge: u, open: false, aim: clamp(aim, -0.9, 0.9) * u };
  }
  if (e.state === "beam") return { wave: 0.5, speed: 10, jaw: 1, charge: 1, open: false, aim: clamp(aim, -0.9, 0.9) };
  if (e.state === "recover") return { wave: 2, speed: 1.4, jaw: 0.3, charge: 0, open: true, aim: 0.25 };
  return { wave: 2.6, speed: 3, jaw: 0, charge: 0, open: false, aim: 0 };
}
