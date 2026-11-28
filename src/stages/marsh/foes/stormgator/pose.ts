import type { Enemy } from "../../../../types/enemy";
import { clamp, ease } from "../../../../utils/math";
import { GATOR_TIMES } from "./constants";
import { bellowWindup, progressOf, rushWindup, slamWindup } from "./timing";

export interface GatorPose {
  time: number;
  step: number;
  crouch: number;
  rear: number;
  pitch: number;
  jaw: number;
  tail: number;
  sway: number;
  scutes: number;
  throat: number;
  lean: number;
  hot: boolean;
}

const pose: GatorPose = {
  time: 0,
  step: 0,
  crouch: 0,
  rear: 0,
  pitch: 0,
  jaw: 0,
  tail: 0,
  sway: 0,
  scutes: 0,
  throat: 0,
  lean: 0,
  hot: false,
};

const SLAM_DROP = 0.08;

function settle(time: number): void {
  Object.assign(pose, {
    time,
    step: 0,
    crouch: 0,
    rear: 0,
    pitch: 0.04,
    jaw: 0.05,
    tail: 0,
    sway: Math.sin(time * 1.8) * 0.06,
    scutes: Math.sin(time * 2.3) > 0.6 ? 0.35 : 0.1,
    throat: 0,
    lean: 0,
    hot: false,
  });
}

function attack(e: Enemy): void {
  if (e.state === "charge") {
    const u = progressOf(e, rushWindup());
    Object.assign(pose, { crouch: u * 2, pitch: 0.04 + 0.14 * u, jaw: 0.15 * u, scutes: u, lean: -1.5 * u, hot: true });
    pose.tail = Math.sin(pose.time * 30) * 0.05 * u;
    return;
  }
  if (e.state === "lunge") {
    Object.assign(pose, { crouch: 1.6, pitch: 0.14, jaw: 0.75, scutes: 1, lean: 2, hot: true });
    pose.step = Math.sin(pose.time * 16);
    return;
  }
  if (e.state === "wind") {
    const u = ease.outCubic(progressOf(e, slamWindup()));
    Object.assign(pose, { tail: u, crouch: 0.8 * u, pitch: 0.1 * u, jaw: 0.2 * u, scutes: u, hot: true });
    pose.sway = Math.sin(pose.time * 24) * 0.04 * u;
    return;
  }
  if (e.state === "swipe") {
    const k = clamp(e.st / SLAM_DROP);
    const fade = clamp(e.st / GATOR_TIMES.slam);
    Object.assign(pose, { tail: 1 - k * 1.15, crouch: 1.2 * (1 - fade), pitch: 0.1, scutes: 1 - fade, jaw: 0.3 });
    return;
  }
  if (e.state === "summon") {
    const u = ease.outCubic(progressOf(e, bellowWindup()));
    Object.assign(pose, { rear: u * 4, pitch: -0.55 * u, jaw: 0.25 * u, throat: u, scutes: u * 0.7, hot: true });
    pose.throat += Math.sin(pose.time * 30) * 0.08 * u;
    return;
  }
  if (e.state === "shoot") {
    const k = clamp(e.st / GATOR_TIMES.bellow);
    Object.assign(pose, { rear: 4 * (1 - k), pitch: -0.6 * (1 - k), jaw: 1 - k * 0.8, throat: 0.6 * (1 - k) });
    pose.scutes = 0.8 * (1 - k);
    return;
  }
  if (e.state === "recover") {
    const k = clamp(e.st / GATOR_TIMES.rest);
    Object.assign(pose, { crouch: 0.8 * (1 - k), jaw: 0.25 * (1 - k), scutes: 0.3 * (1 - k) });
  }
}

export function gatorPose(e: Enemy, t: number): GatorPose {
  const time = t + e.seed;
  settle(time);
  if (e.stun > 0 || e.air) {
    Object.assign(pose, { pitch: 0.2, jaw: 0.45, tail: -0.1, scutes: 0 });
    return pose;
  }
  if (e.state === "walk") {
    pose.step = Math.abs(e.vx) > 2 ? Math.sin(time * 4) : 0;
    pose.pitch = 0.04 + Math.sin(time * 4) * 0.025;
    return pose;
  }
  attack(e);
  return pose;
}
