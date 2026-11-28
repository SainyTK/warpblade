import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { FLIT } from "./constants";

export interface FlitPose {
  wing: number;
  pitch: number;
  tuck: number;
  glare: boolean;
}

export function flitPose(e: Enemy, time: number): FlitPose {
  if (e.stagger > 0) return { wing: 0.9, pitch: -0.3, tuck: 0, glare: false };
  if (e.state === "wind") {
    const u = clamp(e.st / FLIT.wind);
    return { wing: -0.9 - u * 0.3, pitch: -0.2, tuck: 0.2, glare: u > 0.3 };
  }
  if (e.state === "dive") return { wing: -0.2, pitch: 0.5, tuck: 1, glare: true };
  const flap = Math.sin(time * (e.state === "recover" ? 22 : 16));
  return { wing: flap, pitch: 0, tuck: 0, glare: false };
}
