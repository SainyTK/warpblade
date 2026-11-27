import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { hurting } from "../strike";
import { DIGGER, raiseTime, SWING } from "./moves";

type Pt = readonly [number, number];

export interface DiggerPose {
  grip: Pt;
  blade: Pt;
  lean: number;
  step: number;
  heat: number;
  guard: boolean;
  limp: boolean;
}

const HOLD = { grip: [5, -13], blade: [7.5, -21] } as const;
const RAISED = { grip: [-1, -24], blade: [-8, -30] } as const;
const SWUNG = { grip: [9, -12], blade: [17, -7] } as const;
const DUG = { grip: [5, -11], blade: [12, -1] } as const;
const FLUNG = { grip: [6, -18], blade: [13, -22] } as const;

const mixPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

export function diggerPose(e: Enemy, time: number): DiggerPose {
  const limp = hurting(e);
  const step = Math.sin(time * 3.4);
  if (limp) return { grip: [3, -10], blade: [6, -3], lean: -2, step: 0, heat: 0, guard: false, limp };
  if (e.state === "wind") {
    const u = ease.outCubic(clamp(e.st / raiseTime(e)));
    const to = e.n === SWING ? RAISED : DUG;
    return {
      grip: mixPt(HOLD.grip, to.grip, u),
      blade: mixPt(HOLD.blade, to.blade, u),
      lean: e.n === SWING ? -1.5 * u : 1.5 * u,
      step: 0,
      heat: u,
      guard: false,
      limp,
    };
  }
  if (e.state === "swipe") {
    const u = ease.outCubic(clamp(e.st / DIGGER.swing));
    return {
      grip: mixPt(RAISED.grip, SWUNG.grip, u),
      blade: mixPt(RAISED.blade, SWUNG.blade, u),
      lean: 2,
      step: 0,
      heat: 1,
      guard: false,
      limp,
    };
  }
  if (e.state === "volley") {
    const u = ease.outCubic(clamp(e.st / DIGGER.fling));
    return {
      grip: mixPt(DUG.grip, FLUNG.grip, u),
      blade: mixPt(DUG.blade, FLUNG.blade, u),
      lean: 1,
      step: 0,
      heat: 1,
      guard: false,
      limp,
    };
  }
  if (e.state === "recover")
    return { grip: [6, -11], blade: [13, -4], lean: 1.4, step: 0, heat: 0, guard: false, limp };
  return {
    grip: HOLD.grip,
    blade: [HOLD.blade[0] + step * 0.3, HOLD.blade[1]],
    lean: 0,
    step,
    heat: 0,
    guard: true,
    limp,
  };
}
