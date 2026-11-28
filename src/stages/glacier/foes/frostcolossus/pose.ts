import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import type { Pt } from "../shapes";
import { COLOSSUS } from "./constants";
import { isExposed } from "./recovery";

export interface ColossusPose {
  lift: number;
  hunch: number;
  nearFist: Pt;
  farFist: Pt;
  nearFoot: number;
  farFoot: number;
  core: number;
  open: number;
  glare: boolean;
  jolt: number;
}

export function colossusPose(e: Enemy, time: number): ColossusPose {
  const jolt = e.flash > 0 ? -1 : 0;
  const base = { lift: 0, hunch: 0, nearFoot: 0, farFoot: 0, core: 0.25, open: 0, glare: false, jolt };
  if (e.state === "wind") {
    const u = clamp(e.st / COLOSSUS.slamWind);
    const shiver = Math.sin(time * 40) * 0.4 * u;
    return {
      ...base,
      lift: -u * 2,
      hunch: -u * 2,
      nearFist: [8 - u * 6 + shiver, -16 - u * 34],
      farFist: [-6 - u * 2, -16 - u * 32],
      core: 0.3 + u * 0.7,
      glare: u > 0.3,
    };
  }
  if (e.state === "swipe")
    return { ...base, lift: 2, hunch: 4, nearFist: [22, -5], farFist: [-20, -5], core: 1, open: 0.4, glare: true };
  if (e.state === "summon") {
    const u = clamp(e.st / COLOSSUS.callWind);
    return {
      ...base,
      lift: -u,
      nearFist: [10 + u * 2, -18 - u * 30],
      farFist: [-12, -12],
      core: 0.3 + u * 0.6,
      glare: u > 0.4,
    };
  }
  if (e.state === "recover" && isExposed(e)) {
    const breathe = Math.sin(time * 6) * 0.5;
    return { ...base, lift: 2, hunch: 3, nearFist: [20, -5], farFist: [-18, -5], core: 0.85 + breathe * 0.15, open: 1 };
  }
  if (e.state === "recover") return { ...base, lift: 1, hunch: 1, nearFist: [14, -10], farFist: [-12, -10], core: 0.4 };
  const gait = Math.floor(time * 2.4) % 4;
  const sway = [0, -1, 0, 1][gait];
  return {
    ...base,
    lift: gait % 2 ? -0.5 : 0,
    nearFist: [16 + sway, -6],
    farFist: [-14 - sway, -6],
    nearFoot: sway * 2,
    farFoot: -sway * 2,
  };
}
