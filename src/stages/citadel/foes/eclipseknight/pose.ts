import type { Pt } from "../../../../game/enemies/abyss/paint";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { KNIGHT, KNIGHT_MOVE } from "./constants";

export interface KnightPose {
  bob: number;
  lean: number;
  nearFoot: Pt;
  farFoot: Pt;
  grip: Pt;
  blade: number;
  bladeHot: number;
  shield: Pt;
  shieldOut: number;
  visor: number;
}

const REST: KnightPose = {
  bob: 0,
  lean: 0,
  nearFoot: [3, 0],
  farFoot: [-4, 0],
  grip: [-6, -24],
  blade: -2.3,
  bladeHot: 0,
  shield: [9, -18],
  shieldOut: 0,
  visor: 0.3,
};

function marching(time: number): Partial<KnightPose> {
  const step = Math.sin(time * 5);
  return {
    bob: Math.abs(step) > 0.7 ? -0.5 : 0,
    nearFoot: [3 + step * 3, step > 0.4 ? -1 : 0],
    farFoot: [-4 - step * 3, step < -0.4 ? -1 : 0],
  };
}

function winding(e: Enemy): Partial<KnightPose> {
  const u = clamp(e.st / (e.ay === KNIGHT_MOVE.bash ? KNIGHT.bashWind : KNIGHT.cleaveWind));
  if (e.ay === KNIGHT_MOVE.bash)
    return {
      bob: 1.5 * u,
      lean: 2 * u,
      nearFoot: [6, 0],
      farFoot: [-7, 0],
      shield: [10, -16],
      shieldOut: u * 0.5,
      visor: 0.5 + u * 0.5,
    };
  return {
    lean: -2 * u,
    nearFoot: [5, 0],
    farFoot: [-6, 0],
    grip: [-2 - u * 2, -34 - u * 4],
    blade: -1.9 + u * 0.3,
    bladeHot: u,
    shield: [7, -16],
    visor: 0.5 + u * 0.5,
  };
}

export function knightPose(e: Enemy, time: number): KnightPose {
  if (e.state === "wind") return { ...REST, ...winding(e) };
  if (e.state === "swipe")
    return {
      ...REST,
      lean: 3,
      nearFoot: [7, 0],
      farFoot: [-7, 0],
      grip: [10, -18],
      blade: 0.25,
      bladeHot: 1,
      shield: [3, -16],
      visor: 1,
    };
  if (e.state === "charge")
    return { ...REST, lean: 3, bob: 1, nearFoot: [8, 0], farFoot: [-8, -1], shield: [13, -17], shieldOut: 1, visor: 1 };
  if (e.state === "recover") {
    const bash = e.ay === KNIGHT_MOVE.bash;
    return bash
      ? { ...REST, lean: 1, bob: 1, shield: [10, -14], visor: 0.1 }
      : {
          ...REST,
          lean: 2,
          bob: 1.5,
          nearFoot: [6, 0],
          farFoot: [-6, 0],
          grip: [10, -10],
          blade: 0.95,
          shield: [2, -13],
          visor: 0.1,
        };
  }
  return { ...REST, ...marching(time) };
}
