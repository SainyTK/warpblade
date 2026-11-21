import type { DrillProfile, Fighter } from "../../types/drill";
import type { Pose } from "../../types/pose";
import { clamp, smooth } from "../../utils/math";
import { blendPose } from "../../utils/poseBlend";
import { BRAKING_TIME, LANDING_TIME, locomotionPose, type Motion, motionOf } from "./locomotion";
import { drillPoses } from "./poses";
import { RUN_PUSH_PHASE, RUN_STRIDE } from "./runPose";
import { spellReleasePose } from "./spellReleasePose";
import { swordPose } from "./swordPose";

export function createFighterMotion() {
  let motion: Motion = "idle";
  let age = 0;
  let stride = RUN_PUSH_PHASE;
  let landing = 0;
  let landForce = 0;
  let contactX = 0;
  let braking = 0;
  let wasGrounded = true;
  let previousX: number | undefined;
  let previousFace: Fighter["face"] | undefined;
  let previousSpeed = 0;
  let fallSpeed = 0;
  let from: Pose | undefined;

  return (profile: DrillProfile, h: Fighter, currentPose: Pose, dt: number) => {
    const landed = h.grounded && !wasGrounded;
    const speed = Math.abs(h.vx);
    if (!h.grounded) {
      landing = 0;
    } else if (landed) {
      landForce = clamp(fallSpeed / 240);
      contactX = h.x;
      landing = landForce > 0 ? LANDING_TIME : 0;
    } else {
      landing = Math.max(0, landing - dt);
    }
    fallSpeed = Math.max(0, h.vy);
    wasGrounded = h.grounded;
    const turned = previousFace !== undefined && previousFace !== h.face;
    if (!h.grounded || turned || speed > previousSpeed) {
      braking = 0;
    } else if (motion === "run" && speed < previousSpeed) {
      braking = BRAKING_TIME;
    } else {
      braking = Math.max(0, braking - dt);
    }
    const landingPose = speed > 38 ? Math.max(0, landing - 0.044) : landing;
    const next = motionOf(h, landingPose, braking > 0);
    const changed = next !== motion || (turned && next === "run");
    if (changed) {
      if (next === "run") {
        stride = RUN_PUSH_PHASE;
      }
      from = currentPose;
      age = 0;
      motion = next;
    }
    age += dt;
    if (motion === "run" && previousX !== undefined && !changed) {
      stride = (stride + Math.max(0, (h.x - previousX) * h.face) / RUN_STRIDE) % 1;
    }
    previousX = h.x;
    previousFace = h.face;
    previousSpeed = speed;
    const handover = motion === "parry" || motion === "land" ? 0 : motion === "idle" || motion === "run" ? 0.05 : 0.023;
    const target = h.swing
      ? swordPose(profile, h.swing)
      : h.spellRelease
        ? spellReleasePose(h, drillPoses(profile))
        : locomotionPose(profile, h, motion, age, stride, landForce);
    const footPlacement =
      motion === "land" ? clamp((contactX - h.x) * h.face, -5, 5) * (1 - smooth(0.04, 0.078, age)) : 0;
    const pose = footPlacement
      ? { ...target, ffx: target.ffx + footPlacement, bfx: target.bfx + footPlacement }
      : target;
    return {
      pose: age < handover ? blendPose(from ?? drillPoses(profile).stance, pose, smooth(0, handover, age)) : pose,
      landForce: landed ? landForce : 0,
      groundDashStart: changed && motion === "dash" && h.grounded,
    };
  };
}
