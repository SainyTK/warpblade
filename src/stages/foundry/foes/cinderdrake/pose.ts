import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { DRAKE_TIMES } from "./moves";

export interface DrakePose {
  flap: number;
  sweep: number;
  neck: number;
  jaw: number;
  heat: number;
  tail: number;
}

export function drakePose(e: Enemy, time: number): DrakePose {
  const tail = Math.sin(time * 3) * 2;
  if (e.state === "wind") {
    const u = clamp(e.st / DRAKE_TIMES.breathe);
    return { flap: Math.sin(time * 5) * 0.4 - 0.2, sweep: 0, neck: -2.5 * u, jaw: u * 0.7, heat: u, tail };
  }
  if (e.state === "volley") return { flap: Math.sin(time * 5) * 0.3, sweep: 0, neck: 1, jaw: 1, heat: 1, tail };
  if (e.state === "charge") {
    const u = clamp(e.st / DRAKE_TIMES.rise);
    return {
      flap: -0.6 - u * 0.4 + Math.sin(time * 30) * 0.05,
      sweep: 0,
      neck: -1,
      jaw: 0.3,
      heat: 0.5 + u * 0.4,
      tail: tail * 0.3,
    };
  }
  if (e.state === "dive") return { flap: -0.15, sweep: 0.7, neck: 2, jaw: 0.8, heat: 0.8, tail: -2 };
  if (e.state === "recover")
    return {
      flap: Math.sin(time * 12) * 0.5 + 0.2,
      sweep: 0.1,
      neck: 2.5,
      jaw: 0.3 + 0.2 * Math.sin(time * 8),
      heat: 0,
      tail: tail * 0.5,
    };
  return { flap: Math.sin(time * 6) * 0.7, sweep: 0, neck: 0, jaw: 0, heat: 0.15, tail };
}
