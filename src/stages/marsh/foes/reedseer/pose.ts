import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { castTime, raiseTime } from "./cast";
import { SEER_TIMES } from "./constants";

type Pt = [number, number];

export interface SeerPose {
  foot: Pt;
  hand: Pt;
  tip: Pt;
  lean: number;
  bob: number;
  flare: number;
  charge: number;
  tail: number;
  step: number;
}

const pose: SeerPose = {
  foot: [0, 0],
  hand: [0, 0],
  tip: [0, 0],
  lean: 0,
  bob: 0,
  flare: 0,
  charge: 0,
  tail: 0,
  step: 0,
};

interface StaffHold {
  foot: Pt;
  hand: Pt;
  tip: Pt;
}

const REST: StaffHold = { foot: [9, 0], hand: [8, -21], tip: [9, -42] };
const RAISED: StaffHold = { foot: [6, -16], hand: [6, -31], tip: [9, -52] };
const PLANTED: StaffHold = { foot: [15, 0], hand: [10, -20], tip: [14, -40] };

function staff(from: StaffHold, to: StaffHold, k: number): void {
  pose.foot = [lerp(from.foot[0], to.foot[0], k), lerp(from.foot[1], to.foot[1], k)];
  pose.hand = [lerp(from.hand[0], to.hand[0], k), lerp(from.hand[1], to.hand[1], k)];
  pose.tip = [lerp(from.tip[0], to.tip[0], k), lerp(from.tip[1], to.tip[1], k)];
}

export function seerPose(e: Enemy, t: number): SeerPose {
  const time = t + e.seed;
  Object.assign(pose, { lean: 0, bob: 0, flare: 0, charge: 0, tail: 0, step: 0 });
  staff(REST, REST, 0);
  if (e.stun > 0 || e.air) {
    staff(REST, PLANTED, 0.5);
    pose.lean = -3;
    pose.tail = 1;
    return pose;
  }
  if (e.state === "summon" || e.state === "wind") {
    const k = clamp(e.st / (e.state === "summon" ? raiseTime() : castTime()));
    staff(REST, RAISED, ease.outCubic(clamp(k * 2.5)));
    pose.charge = k;
    pose.flare = k;
    pose.lean = -1.5 * k;
    pose.bob = Math.sin(time * 20) * 0.3 * k;
    return pose;
  }
  if (e.state === "shoot") {
    const k = ease.outCubic(clamp(e.st / 0.12));
    staff(RAISED, PLANTED, k);
    pose.charge = 1 - clamp(e.st / SEER_TIMES.release);
    pose.flare = 1;
    pose.lean = 2 * k;
    return pose;
  }
  if (e.state === "hop") {
    staff(REST, PLANTED, 0.3);
    pose.lean = -3;
    pose.tail = 1;
    pose.bob = -1;
    return pose;
  }
  if (e.state === "recover") {
    staff(PLANTED, REST, clamp(e.st / SEER_TIMES.recover));
    pose.lean = 1;
    return pose;
  }
  const moving = Math.abs(e.vx) > 4;
  pose.step = moving ? Math.sin(time * 7) : 0;
  pose.bob = moving ? Math.abs(pose.step) * -0.6 : Math.sin(time * 2) * 0.3;
  pose.tail = Math.sin(time * 2.4) * 0.3;
  pose.flare = 0.15 + Math.sin(time * 3) * 0.1;
  return pose;
}
