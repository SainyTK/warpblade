import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { ROOTCALLER } from "./constants";
import { callTime, raiseTime } from "./moves";

export type Pt = readonly [number, number];

export interface RootcallerPose {
  foot: Pt;
  tip: Pt;
  hand: Pt;
  backHand: Pt;
  lean: number;
  bob: number;
  stride: number;
  heat: number;
  ward: number;
  quiver: number;
}

interface Grip {
  foot: Pt;
  tip: Pt;
  hand: Pt;
  backHand: Pt;
}

const WALK: Grip = { foot: [11, 0], tip: [11, -40], hand: [10, -20], backHand: [-6, -15] };
const RAISED: Grip = { foot: [7, -14], tip: [9, -52], hand: [8, -34], backHand: [3, -30] };
const PLANTED: Grip = { foot: [13, 2], tip: [8, -34], hand: [9, -21], backHand: [6, -19] };
const CALLING: Grip = { foot: [-6, -38], tip: [14, -44], hand: [8, -38], backHand: [-3, -36] };

const pose: RootcallerPose = {
  foot: [0, 0],
  tip: [0, 0],
  hand: [0, 0],
  backHand: [0, 0],
  lean: 0,
  bob: 0,
  stride: 0,
  heat: 0,
  ward: 0,
  quiver: 0,
};

const mixPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

function grip(from: Grip, to: Grip, k: number): void {
  pose.foot = mixPt(from.foot, to.foot, k);
  pose.tip = mixPt(from.tip, to.tip, k);
  pose.hand = mixPt(from.hand, to.hand, k);
  pose.backHand = mixPt(from.backHand, to.backHand, k);
}

export function rootcallerPose(e: Enemy, time: number): RootcallerPose {
  Object.assign(pose, { lean: 0, bob: 0, stride: 0, heat: 0, ward: 0, quiver: 0 });
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / raiseTime()));
    grip(WALK, RAISED, k);
    pose.lean = -1.5 * k;
    pose.heat = clamp(e.st / raiseTime());
    pose.quiver = k > 0.8 ? Math.sin(time * 60) * 0.3 : 0;
    return pose;
  }
  if (e.state === "shoot") {
    const k = ease.outCubic(clamp(e.st / 0.08));
    grip(RAISED, PLANTED, k);
    pose.lean = lerp(-1.5, 2.5, k);
    pose.bob = k;
    pose.heat = 1 - clamp(e.st / (ROOTCALLER.mark + ROOTCALLER.stand)) * 0.6;
    return pose;
  }
  if (e.state === "summon") {
    const k = ease.outCubic(clamp(e.st / (callTime() * 0.35)));
    grip(WALK, CALLING, k);
    pose.lean = -1 * k;
    pose.heat = clamp(e.st / callTime());
    pose.ward = clamp(e.st / 0.25);
    pose.quiver = Math.sin(time * 40) * 0.25 * k;
    return pose;
  }
  if (e.state === "recover" && e.n === 1) {
    const k = ease.outCubic(clamp(e.st / ROOTCALLER.callRest));
    grip(CALLING, WALK, k);
    pose.ward = 1 - clamp(e.st / 0.2);
    return pose;
  }
  if (e.state === "recover") {
    const pulling = clamp((e.st - ROOTCALLER.stuck) / ROOTCALLER.pull);
    grip(PLANTED, WALK, ease.outCubic(pulling));
    pose.lean = lerp(2.5, 0, pulling);
    pose.bob = lerp(1, 0, pulling) + (pulling > 0 ? 0 : Math.floor(time * 3) % 2) * 0.5;
    return pose;
  }
  grip(WALK, WALK, 0);
  const walking = Math.abs(e.vx) > 2;
  const swing = walking ? Math.sin(time * 4) : 0;
  pose.stride = swing * 2;
  pose.bob = walking ? Math.abs(swing) * 0.5 : Math.sin(time * 1.6) * 0.25;
  pose.foot = [WALK.foot[0] + swing * 2, WALK.foot[1] - Math.max(0, swing) * 1.5];
  pose.tip = [WALK.tip[0] + swing * 1.2, WALK.tip[1] - Math.max(0, swing) * 1.5];
  pose.heat = 0.25 + 0.15 * Math.sin(time * 2.4);
  return pose;
}
