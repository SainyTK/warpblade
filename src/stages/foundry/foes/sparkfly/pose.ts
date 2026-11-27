import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { FLY_TIMES } from "./moves";

export interface FlyPose {
  wing: number;
  heat: number;
  pitch: number;
}

export function flyPose(e: Enemy, time: number): FlyPose {
  if (e.stagger > 0) return { wing: -0.9, heat: 0, pitch: 0.5 };
  if (e.state === "wind") {
    const u = clamp(e.st / FLY_TIMES.wind);
    return { wing: Math.sin(time * 70) > 0 ? 1 : -0.4, heat: u, pitch: -0.3 * u };
  }
  if (e.state === "dive") return { wing: 0.15, heat: 1, pitch: clamp(e.vy / 170, -1, 1) * 0.6 };
  if (e.state === "recover") return { wing: Math.sin(time * 30), heat: 0.3, pitch: -0.15 };
  return { wing: Math.sin(time * 38), heat: 0.15 + 0.15 * Math.sin(time * 3), pitch: 0 };
}
