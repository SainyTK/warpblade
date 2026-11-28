import type { Enemy } from "../../../../types/enemy";
import { clamp, ease, lerp } from "../../../../utils/math";
import { BASILISK, BASILISK_MOVE } from "./constants";
import { coilTime, gazeTime, rearTime } from "./timing";

export interface BasiliskPose {
  shiftX: number;
  crouch: number;
  stride: number;
  breath: number;
  headX: number;
  headY: number;
  jaw: number;
  crest: number;
  charge: number;
  coil: number;
  rattle: number;
  lash: number;
}

const pose: BasiliskPose = {
  shiftX: 0,
  crouch: 0,
  stride: 0,
  breath: 0,
  headX: 0,
  headY: 0,
  jaw: 0,
  crest: 0,
  charge: 0,
  coil: 0,
  rattle: 0,
  lash: 0,
};

function windPose(e: Enemy, time: number): void {
  if (e.n === BASILISK_MOVE.gaze) {
    const k = clamp(e.st / gazeTime());
    pose.crest = 0.4 + 0.6 * ease.outCubic(clamp(k * 2));
    pose.charge = k;
    pose.jaw = 0.25 * k;
    pose.headY = -1.5 * k;
    pose.crouch = 1 * k;
    return;
  }
  if (e.n === BASILISK_MOVE.lash) {
    const k = ease.outCubic(clamp(e.st / coilTime()));
    pose.coil = k;
    pose.rattle = Math.sin(time * 70) * k;
    pose.crouch = 1.5 * k;
    pose.crest = 0.6;
    return;
  }
  const k = ease.outCubic(clamp(e.st / rearTime()));
  pose.shiftX = -3 * k;
  pose.headX = -2 * k;
  pose.headY = -4 * k;
  pose.jaw = 0.9 * k;
  pose.crest = 0.4 + 0.5 * k;
}

function recoverPose(e: Enemy, time: number): void {
  const pant = Math.abs(Math.sin(time * 9));
  if (e.n === BASILISK_MOVE.gaze) {
    const k = 1 - clamp((e.st - BASILISK.gazeRest * 0.7) / (BASILISK.gazeRest * 0.3));
    pose.crest = lerp(0.4, -0.6, k);
    pose.jaw = 0.35 * pant * k;
    pose.crouch = 2 * k;
    pose.headY = 2 * k;
    pose.breath = pant * k;
    return;
  }
  if (e.n === BASILISK_MOVE.bite) {
    const k = 1 - clamp((e.st - BASILISK.biteRest * 0.75) / (BASILISK.biteRest * 0.25));
    pose.headY = 6 * k;
    pose.headX = 3 * k;
    pose.jaw = 0.3 * k + 0.1 * pant * k;
    pose.crest = lerp(0.4, -0.4, k);
    pose.crouch = 2 * k;
    pose.breath = pant * k;
    return;
  }
  const k = 1 - clamp(e.st / BASILISK.lashRest);
  pose.crouch = 1.5 * k;
  pose.lash = -0.5 * k;
  pose.crest = 0.4;
}

export function basiliskPose(e: Enemy, time: number): BasiliskPose {
  Object.assign(pose, {
    shiftX: 0,
    crouch: 0,
    stride: 0,
    breath: 0,
    headX: 0,
    headY: 0,
    jaw: 0,
    crest: 0.4,
    charge: 0,
    coil: 0,
    rattle: 0,
    lash: 0,
  });
  if (e.state === "wind") windPose(e, time);
  else if (e.state === "beam") {
    pose.crest = 1;
    pose.charge = 1;
    pose.jaw = 0.7;
    pose.headX = -1 + Math.sin(time * 80) * 0.4;
    pose.crouch = 1;
  } else if (e.state === "swipe") {
    const k = clamp(e.st / BASILISK.lash);
    pose.lash = Math.sin(k * Math.PI);
    pose.coil = 1 - ease.outCubic(clamp(k * 3));
    pose.crouch = 2;
    pose.crest = 0.8;
  } else if (e.state === "lunge") {
    const k = clamp(e.st / BASILISK.bite);
    pose.shiftX = lerp(-3, 4, ease.outCubic(k));
    pose.headX = lerp(-2, 4, k);
    pose.headY = lerp(-4, 3, k);
    pose.jaw = k < 0.6 ? 1 : 1 - (k - 0.6) / 0.4;
    pose.crest = 0.9;
  } else if (e.state === "recover") recoverPose(e, time);
  else {
    const walking = Math.abs(e.vx) > 2;
    pose.stride = walking ? Math.sin(time * 5) : 0;
    pose.breath = 0.5 + 0.5 * Math.sin(time * 2.2);
    pose.headY = walking ? Math.abs(pose.stride) * 0.6 : 0;
  }
  return pose;
}
