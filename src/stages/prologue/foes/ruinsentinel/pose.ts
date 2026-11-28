import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { SENTINEL } from "./constants";
import { raiseTime } from "./moves";

export interface SentinelPose {
  handX: number;
  handY: number;
  angle: number;
  shieldX: number;
  shieldY: number;
  lean: number;
  drop: number;
  step: number;
  heat: number;
  front: boolean;
}

interface Grip {
  handX: number;
  handY: number;
  angle: number;
}

const REST: Grip = { handX: -9, handY: -18, angle: -Math.PI / 2 };
const RAISED: Grip = { handX: -3, handY: -31, angle: -2.25 };
const STRUCK: Grip = { handX: 5, handY: -19, angle: Math.PI / 4 };

const pose: SentinelPose = {
  handX: 0,
  handY: 0,
  angle: 0,
  shieldX: 8,
  shieldY: -3,
  lean: 0,
  drop: 0,
  step: 0,
  heat: 0,
  front: false,
};

function hold(from: Grip, to: Grip, k: number): void {
  pose.handX = lerp(from.handX, to.handX, k);
  pose.handY = lerp(from.handY, to.handY, k);
  pose.angle = lerp(from.angle, to.angle, k);
}

export function sentinelPose(e: Enemy, time: number): SentinelPose {
  Object.assign(pose, { shieldX: 8, shieldY: -3, lean: 0, drop: 0, step: 0, front: true });
  if (e.state === "wind") {
    const k = ease.outCubic(clamp(e.st / raiseTime()));
    hold(REST, RAISED, k);
    pose.shieldX = 9;
    pose.shieldY = lerp(-3, 0, clamp(e.st / 0.1));
    pose.lean = -k;
    pose.drop = k;
    pose.heat = clamp(e.st / raiseTime());
    return pose;
  }
  if (e.state === "lunge") {
    const k = clamp(e.st / SENTINEL.fall) ** 2;
    hold(RAISED, STRUCK, k);
    const quiver = e.st > SENTINEL.fall && e.st < SENTINEL.fall + 0.25 ? Math.sin(time * 70) * 0.04 : 0;
    pose.angle += quiver;
    pose.shieldX = 9;
    pose.shieldY = 0;
    pose.lean = lerp(-1, 2, k);
    pose.drop = lerp(1, 2, k);
    pose.heat = e.st < SENTINEL.fall ? 1 : clamp(1 - (e.st - SENTINEL.fall) / 0.6) * 0.8;
    return pose;
  }
  if (e.state === "recover") {
    const k = ease.outCubic(clamp(e.st / SENTINEL.pull));
    hold(STRUCK, REST, k);
    pose.lean = lerp(2, 0, k);
    pose.drop = lerp(2, 0, k);
    pose.shieldY = lerp(0, -3, k);
    pose.heat = 0;
    return pose;
  }
  hold(REST, REST, 0);
  const walking = Math.abs(e.vx) > 2;
  const beat = Math.floor(time * 2.6) % 2;
  pose.step = walking ? (beat ? 1.5 : -1.5) : 0;
  pose.drop = walking && beat ? 0.5 : 0;
  pose.angle += Math.sin(time * 1.3) * 0.03;
  pose.heat = 0.25 + 0.15 * Math.sin(time * 2.2);
  pose.front = false;
  if (e.stagger > 0) pose.lean = -1.5;
  return pose;
}
