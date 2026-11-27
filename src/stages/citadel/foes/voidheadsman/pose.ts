import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { HEADSMAN } from "./constants";

export interface HeadsmanPose {
  bob: number;
  lean: number;
  stride: number;
  axe: number;
  grip: readonly [number, number];
  hot: number;
  fade: number;
  rise: number;
  eclipse: number;
}

const REST: HeadsmanPose = {
  bob: 0,
  lean: 0,
  stride: 0,
  axe: -2.0,
  grip: [-4, -30],
  hot: 0,
  fade: 0,
  rise: 0,
  eclipse: 0,
};

export function headsmanPose(e: Enemy, time: number): HeadsmanPose {
  switch (e.state) {
    case "wind": {
      const u = clamp(e.st / HEADSMAN.chopWind);
      return { ...REST, lean: -2.5 * u, axe: -2 + u * 0.15, grip: [-2 - u * 3, -44 - u * 4], hot: u, stride: 1 };
    }
    case "swipe":
      return { ...REST, lean: 4, axe: 0.75, grip: [14, -16], hot: 1, stride: 1.5, bob: 2 };
    case "blink":
      return { ...REST, fade: clamp(e.st / HEADSMAN.stepWind), hot: 0.6 };
    case "hop": {
      const u = clamp(e.st / HEADSMAN.sweepWind);
      return {
        ...REST,
        lean: -2,
        axe: Math.PI - 0.3,
        grip: [-12, -20],
        hot: u,
        stride: 1.2,
        bob: 1.5,
        rise: 1 - clamp(e.st / 0.15),
      };
    }
    case "lunge":
      return { ...REST, lean: 2.5, axe: 0.05, grip: [12, -20], hot: 1, stride: 1.4, bob: 2 };
    case "summon": {
      const u = clamp(e.st / HEADSMAN.callWind);
      return { ...REST, lean: -1, axe: -1.6, grip: [3, -46 - u * 2], hot: u, eclipse: u };
    }
    case "shoot":
      return { ...REST, axe: -1.6, grip: [3, -48], hot: 1, eclipse: 1 };
    case "recover":
      return { ...REST, lean: 3, axe: 0.95, grip: [10, -12], bob: 2.5, stride: 1.2 };
    default: {
      const step = Math.sin(time * 4.5);
      return { ...REST, stride: step, bob: Math.abs(step) > 0.7 ? -0.5 : 0 };
    }
  }
}
