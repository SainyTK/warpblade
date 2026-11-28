import type { Pt } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { SQUIRE } from "./constants";

export interface SquirePose {
  bob: number;
  lean: number;
  nearFoot: Pt;
  farFoot: Pt;
  hand: Pt;
  tip: Pt;
  shield: Pt;
  shieldTilt: number;
  visor: number;
}

const REST: SquirePose = {
  bob: 0,
  lean: 0,
  nearFoot: [2.5, 0],
  farFoot: [-3, 0],
  hand: [-2, -14],
  tip: [18, -17],
  shield: [7, -16],
  shieldTilt: 0,
  visor: 0.4,
};

function marching(time: number): Partial<SquirePose> {
  const step = Math.sin(time * 7);
  return {
    bob: Math.abs(step) > 0.6 ? -0.5 : 0,
    nearFoot: [2.5 + step * 2.5, step > 0.3 ? -0.8 : 0],
    farFoot: [-3 - step * 2.5, step < -0.3 ? -0.8 : 0],
    tip: [18, -17 + Math.sin(time * 3.5) * 0.5],
  };
}

export function squirePose(e: Enemy, time: number): SquirePose {
  if (e.state === "wind") {
    const u = clamp(e.st / SQUIRE.wind);
    return {
      ...REST,
      lean: -1.5 * u,
      nearFoot: [5, 0],
      farFoot: [-5, 0],
      hand: [-6 - u * 3, -15],
      tip: [12 - u * 5, -17 - u],
      shield: [3, -13],
      shieldTilt: 0.6,
      visor: 0.5 + u * 0.5,
    };
  }
  if (e.state === "lunge")
    return {
      ...REST,
      lean: 2.5,
      nearFoot: [7, 0],
      farFoot: [-6, 0],
      hand: [6, -16],
      tip: [34, -16],
      shield: [2, -13],
      shieldTilt: 0.8,
      visor: 1,
    };
  if (e.state === "recover")
    return { ...REST, lean: 1, hand: [3, -14], tip: [24, -13], shield: [4, -13], shieldTilt: 0.5 };
  return { ...REST, ...marching(time) };
}
