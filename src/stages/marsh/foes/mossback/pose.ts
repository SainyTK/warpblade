import type { Enemy } from "../../../../types/enemy";
import { clamp, ease } from "../../../../utils/math";
import { SNAP } from "./constants";
import { airborne, crouching, crouchTime, drawingBack, drawTime, landing, neckReach, snapping } from "./moves";

export interface SnapperPose {
  sink: number;
  neck: number;
  headY: number;
  mouth: number;
  step: number;
  splay: number;
  tuck: number;
  hidden: boolean;
  glow: number;
  rattle: number;
}

const pose: SnapperPose = {
  sink: 0,
  neck: 0,
  headY: 0,
  mouth: 0,
  step: 0,
  splay: 0,
  tuck: 0,
  hidden: false,
  glow: 0,
  rattle: 0,
};

function reset(): void {
  Object.assign(pose, {
    sink: 0,
    neck: 0,
    headY: 0,
    mouth: 0,
    step: 0,
    splay: 0,
    tuck: 0,
    hidden: false,
    glow: 0,
    rattle: 0,
  });
}

export function snapperPose(e: Enemy, t: number): SnapperPose {
  const time = t + e.seed;
  reset();
  if (e.stun > 0 || e.air || e.stagger > 0) {
    pose.hidden = true;
    pose.tuck = 1;
    return pose;
  }
  if (drawingBack(e)) {
    const k = clamp(e.st / drawTime());
    pose.neck = neckReach(e);
    pose.headY = 1.2 * k;
    pose.mouth = ease.outCubic(k);
    pose.sink = k * 0.8;
    pose.glow = k;
    return pose;
  }
  if (snapping(e)) {
    pose.neck = neckReach(e);
    pose.mouth = e.st < SNAP.out ? 1 : clamp(1 - (e.st - SNAP.out) / 0.08);
    pose.headY = -0.5;
    return pose;
  }
  if (crouching(e)) {
    const k = ease.outCubic(clamp(e.st / crouchTime()));
    pose.sink = k * 3;
    pose.splay = k;
    pose.neck = -2 * k;
    pose.glow = k;
    pose.headY = k;
    pose.rattle = k > 0.4 ? Math.sin(time * 70) * 0.4 : 0;
    return pose;
  }
  if (airborne(e)) {
    pose.tuck = 0.6;
    pose.neck = 2;
    pose.headY = -1;
    pose.mouth = 0.4;
    pose.glow = 1;
    return pose;
  }
  if (landing(e)) {
    const k = clamp(e.st / SNAP.land);
    pose.sink = 3 * (1 - k);
    pose.splay = 1 - k;
    pose.glow = 1 - k;
    return pose;
  }
  if (e.state === "recover") {
    pose.headY = 0.6;
    pose.neck = -1;
    return pose;
  }
  pose.step = Math.sin(time * 4.2);
  pose.sink = Math.abs(Math.cos(time * 4.2)) * 0.5;
  pose.neck = Math.sin(time * 1.3) * 0.7;
  return pose;
}
