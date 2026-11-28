import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { MITE } from "./constants";

export interface MitePose {
  squash: number;
  rise: number;
  tilt: number;
  legs: readonly number[];
  glare: boolean;
  spines: number;
}

export function mitePose(e: Enemy, time: number): MitePose {
  if (e.stagger > 0) return { squash: 0.15, rise: 0, tilt: -1, legs: [1, -1, 1, -1], glare: false, spines: 0.6 };
  if (e.state === "wind") {
    const u = clamp(e.st / MITE.wind);
    const quiver = Math.sin(time * 60) * 0.3 * u;
    return { squash: 0.3 * u, rise: quiver, tilt: 0, legs: [-1, 1, -1, 1], glare: u > 0.4, spines: 1 + u * 0.5 };
  }
  if (e.state === "leap") {
    return { squash: -0.25, rise: 0, tilt: e.vy < 0 ? -1 : 1, legs: [2, 2, -2, -2], glare: true, spines: 1.3 };
  }
  if (e.state === "recover") return { squash: 0.2, rise: 0, tilt: 0, legs: [0, 0, 0, 0], glare: false, spines: 0.9 };
  const gait = Math.floor(time * 10) % 2;
  const bob = gait ? -0.5 : 0;
  return { squash: 0, rise: bob, tilt: 0, legs: gait ? [1, -1, 1, -1] : [-1, 1, -1, 1], glare: false, spines: 1 };
}
