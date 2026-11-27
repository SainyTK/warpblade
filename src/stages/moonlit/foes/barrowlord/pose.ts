import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { hurting } from "../strike";

export const LORD = {
  pace: 14,
  near: 20,
  slamReach: 40,
  chargeFrom: 60,
  sense: 150,
  raise: 1,
  brace: 0.7,
  slam: 0.22,
  chargeSpeed: 170,
  chargeMost: 0.9,
  past: 20,
  stuck: 1.4,
  winded: 1.1,
  armour: 0.7,
  opened: 1.5,
} as const;
export const LORD_HITS = { slam: 28, hands: 18, charge: 22, touch: 10 } as const;
export const SLAM = 0;
export const CHARGE = 1;

export const windTime = (e: Enemy): number => (e.n === SLAM ? LORD.raise : LORD.brace) * waveScale(game.wave).windup;
export const exposed = (e: Enemy): boolean => e.state === "recover";

type Pt = readonly [number, number];

export interface LordPose {
  grip: Pt;
  tip: Pt;
  lean: number;
  crouch: number;
  step: number;
  heat: number;
  open: boolean;
  limp: boolean;
}

const REST = { grip: [7, -15], tip: [21, 1] } as const;
const RAISED = { grip: [-1, -37], tip: [-17, -50] } as const;
const SLAMMED = { grip: [11, -13], tip: [33, -1] } as const;
const HELD_BACK = { grip: [-3, -16], tip: [-21, -9] } as const;

const mixPt = (a: Pt, b: Pt, u: number): Pt => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

export function lordPose(e: Enemy, time: number): LordPose {
  const limp = hurting(e);
  const base = { lean: 0, crouch: 0, step: 0, heat: 0, open: false, limp };
  if (e.state === "wind") {
    const u = ease.outCubic(clamp(e.st / windTime(e)));
    const to = e.n === SLAM ? RAISED : HELD_BACK;
    return {
      ...base,
      grip: mixPt(REST.grip, to.grip, u),
      tip: mixPt(REST.tip, to.tip, u),
      lean: e.n === SLAM ? -1.5 * u : 2.5 * u,
      crouch: e.n === SLAM ? 0 : 2 * u,
      heat: u,
    };
  }
  if (e.state === "swipe") {
    const u = ease.outCubic(clamp(e.st / LORD.slam));
    return {
      ...base,
      grip: mixPt(RAISED.grip, SLAMMED.grip, u),
      tip: mixPt(RAISED.tip, SLAMMED.tip, u),
      lean: 3,
      crouch: 2,
      heat: 1,
    };
  }
  if (e.state === "charge")
    return {
      ...base,
      grip: HELD_BACK.grip,
      tip: HELD_BACK.tip,
      lean: 4,
      crouch: 2,
      step: Math.sin(time * 16),
      heat: 1,
    };
  if (e.state === "recover") {
    if (e.n === SLAM) return { ...base, grip: [10, -11], tip: [32, 1], lean: 3, crouch: 3, open: true };
    return { ...base, grip: [6, -12], tip: [24, 1], lean: 1.5, crouch: 2.5, open: true };
  }
  const step = Math.sin(time * 2.6);
  return { ...base, grip: [REST.grip[0], REST.grip[1] + Math.abs(step) * 0.5], tip: REST.tip, step };
}
