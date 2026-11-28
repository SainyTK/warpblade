import type { Pt } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { BEHEMOTH, BEHEMOTH_MOVE } from "./constants";

export interface BehemothPose {
  lift: number;
  rear: number;
  head: Pt;
  frontNear: Pt;
  frontFar: Pt;
  hindNear: Pt;
  hindFar: Pt;
  open: number;
  hot: number;
}

const BASE: BehemothPose = {
  lift: 0,
  rear: 0,
  head: [26, -18],
  frontNear: [14, 0],
  frontFar: [9, 0],
  hindNear: [-15, 0],
  hindFar: [-20, 0],
  open: 0,
  hot: 0,
};

function walking(time: number, speed: number): Partial<BehemothPose> {
  const gait = Math.floor(time * speed) % 4;
  const step = [3, 1, -3, -1][gait];
  const up = gait % 2 ? -1.5 : 0;
  return {
    lift: gait % 2 ? -0.5 : 0,
    frontNear: [14 + step, up],
    frontFar: [9 - step, 0],
    hindNear: [-15 - step, 0],
    hindFar: [-20 + step, up],
  };
}

export function behemothPose(e: Enemy, time: number): BehemothPose {
  if (e.state === "wind" && e.ay === BEHEMOTH_MOVE.slam) {
    const u = clamp(e.st / BEHEMOTH.slamWind);
    return { ...BASE, rear: u, head: [24, -28 - u * 6], frontNear: [16, -10 * u], frontFar: [12, -8 * u], hot: u };
  }
  if (e.state === "wind") {
    const u = clamp(e.st / BEHEMOTH.chargeWind);
    const paw = Math.floor(time * 8) % 2 ? -2 : 0;
    return { ...BASE, lift: 2, head: [28, -11], frontNear: [16, paw], hindNear: [-17, 0], hot: u };
  }
  if (e.state === "swipe")
    return { ...BASE, lift: 2, rear: -0.2, head: [28, -10], frontNear: [20, 0], frontFar: [16, 0], hot: 1 };
  if (e.state === "charge") return { ...BASE, ...walking(time, 16), lift: 1, head: [29, -10], hot: 1 };
  if (e.state === "recover") {
    const u = clamp(e.st / 0.25);
    return { ...BASE, lift: 3, head: [27, -9], open: u, hot: 0 };
  }
  return { ...BASE, ...walking(time, 4) };
}
