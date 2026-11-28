import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { BELL } from "./constants";

export interface BellPose {
  tilt: number;
  clapper: number;
  glow: number;
  open: number;
  jolt: number;
}

export function bellPose(e: Enemy, time: number): BellPose {
  const jolt = e.flash > 0 ? -1 : 0;
  if (e.state === "wind") {
    const u = clamp(e.st / BELL.tollWind);
    return {
      tilt: Math.sin(time * (6 + u * 10)) * (0.12 + u * 0.22),
      clapper: Math.sin(time * 9) * 0.6,
      glow: u,
      open: u,
      jolt,
    };
  }
  if (e.state === "volley") return { tilt: 0, clapper: Math.sin(time * 40) * 0.5, glow: 1, open: 1, jolt };
  if (e.state === "summon") {
    const u = clamp(e.st / BELL.hymnWind);
    return { tilt: Math.sin(time * 5) * 0.08, clapper: Math.sin(time * 5 + 1) * 0.4, glow: u * 0.7, open: 0.3, jolt };
  }
  if (e.state === "beam") return { tilt: Math.sin(time * 5) * 0.05, clapper: 0, glow: 0.6, open: 0.2, jolt };
  if (e.state === "recover") return { tilt: 0, clapper: 0, glow: 0, open: 0, jolt };
  return { tilt: Math.sin(time * 1.7) * 0.06, clapper: Math.sin(time * 1.7 - 0.6) * 0.25, glow: 0.15, open: 0, jolt };
}
