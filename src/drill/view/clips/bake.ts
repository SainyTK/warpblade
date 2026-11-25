import { ACTION_CLIPS, STATE_CLIPS } from "../../../constants/clips";
import { WARP } from "../../../constants/combat";
import { ANIM_FPS, BODY } from "../../../constants/hero";
import type {
  DrillClips,
  DrillMotion,
  DrillPoses,
  DrillProfile,
  DrillStrike,
  DrillStrikeId,
  DrillTier,
  PoseClip,
} from "../../../types/drill";
import type { Pose, PoseKey } from "../../../types/pose";
import { ease, smooth, TAU } from "../../../utils/math";
import { blendPose } from "../../../utils/poseBlend";
import { DEFENSE, SPELL_RELEASE_RECOVERY } from "../../constants";
import { drillPoses } from "../poses";
import { airBlend, airFrames, BRAKING_TIME, LANDING_SETTLE, LANDING_TIME, landRecovery, parryRecovery } from "./curves";

const BREATH_RATE = 4.6;
const RUN_FRAMES = 16;

const MOVING_KEYS: readonly PoseKey[] = [
  "hx",
  "hy",
  "cb",
  "nx",
  "ny",
  "fx",
  "fy",
  "bx",
  "by",
  "ffx",
  "ffy",
  "bfx",
  "bfy",
];
const SNAP_SPAN = 0.5;
const SNAP_STEPS = 16;
const SNAP_SHARE = 0.6;

const range = (count: number): number[] => Array.from({ length: count }, (_, index) => index);
const still = (pose: Pose): PoseClip => ({ frames: [pose], snaps: [] });
const lasting = (seconds: number): number => Math.ceil(seconds * ANIM_FPS - 1e-6) + 1;

const turn = (a: number, b: number): number => Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)));

function poseDistance(a: Pose, b: Pose): number {
  return Math.max(
    ...MOVING_KEYS.map((key) => Math.abs(a[key] - b[key])),
    turn(a.sa, b.sa) * BODY.bladeLength,
    turn(a.oa, b.oa) * BODY.bladeLength,
  );
}

function jumps(at: (age: number) => Pose, frame: number): boolean {
  const ages = range(SNAP_STEPS + 1).map((step) => (frame - 1 + step / SNAP_STEPS) / ANIM_FPS);
  const poses = ages.map(at);
  const span = poseDistance(poses[0] as Pose, poses[SNAP_STEPS] as Pose);
  const largest = Math.max(
    ...range(SNAP_STEPS).map((step) => poseDistance(poses[step] as Pose, poses[step + 1] as Pose)),
  );
  return span > SNAP_SPAN && largest > span * SNAP_SHARE;
}

function timed(seconds: number, at: (age: number) => Pose): PoseClip {
  const frames = range(lasting(seconds)).map((frame) => at(frame / ANIM_FPS));
  return { frames, snaps: range(frames.length).filter((frame) => frame > 0 && jumps(at, frame)) };
}

function spread(count: number, at: (progress: number) => Pose): PoseClip {
  return { frames: range(count).map((frame) => at(frame / count)), snaps: [] };
}

function strikeClip(id: DrillStrikeId, { hit, duration, poses }: DrillStrike, stance: Pose): PoseClip {
  if (!poses) {
    throw new Error(`Strike ${id} has neither poses nor a motion clip`);
  }
  const { ready, load, cut, finish, settle } = poses;
  const release = hit * 0.62;
  const rest = id === "air" ? ready : stance;
  return timed(duration, (age) => {
    if (age < release) {
      return blendPose(ready, load, smooth(0, release, age));
    }
    if (age < hit) {
      return blendPose(load, cut, smooth(release, hit, age));
    }
    const recovery = (age - hit) / (duration - hit);
    if (recovery < 0.1) {
      return cut;
    }
    if (recovery < settle) {
      return blendPose(cut, finish, smooth(0.1, 0.37, recovery));
    }
    return blendPose(finish, rest, ease.outCubic(smooth(settle, 1, recovery)));
  });
}

function tierClip(tier: DrillTier, poses: DrillPoses): PoseClip {
  const { stance } = poses;
  return timed(tier.duration, (age) => {
    const raised = blendPose(stance, tier.windup ?? poses.skillWindup, smooth(0, tier.intro * 0.78, age));
    if (tier.look === "nova" && !tier.cut) {
      return blendPose(raised, stance, smooth(tier.intro + 0.18, tier.duration, age));
    }
    return age < tier.intro
      ? raised
      : blendPose(tier.cut ?? poses.skillCut, stance, smooth(tier.intro + 0.2, tier.duration, age));
  });
}

function airClip(from: Pose, fall: Pose, numbers: DrillMotion): PoseClip {
  const count = airFrames(numbers);
  return {
    frames: range(count).map((frame) => blendPose(from, fall, airBlend(frame / (count - 1), numbers))),
    snaps: [],
  };
}

type Bakers = { [K in keyof DrillClips]: () => DrillClips[K] };

export function drillClips(profile: DrillProfile, numbers: DrillMotion): DrillClips {
  const poses = drillPoses(profile);
  const { stance } = poses;
  const breathFrames = Math.round((TAU / BREATH_RATE) * ANIM_FPS);
  const breathAge = TAU / BREATH_RATE / breathFrames;
  const strike = (id: DrillStrikeId) => strikeClip(id, profile.strikes[id], stance);
  const bakers: Bakers = {
    idle: () => ({
      frames: range(breathFrames).map((frame) =>
        blendPose(stance, poses.breathe, (1 - Math.cos(frame * breathAge * BREATH_RATE)) * 0.5),
      ),
      snaps: [],
    }),
    run: () => spread(RUN_FRAMES, poses.run),
    brake: () => timed(BRAKING_TIME, (age) => blendPose(poses.brake, stance, smooth(0.025, BRAKING_TIME, age))),
    jump: () => airClip(poses.rise, poses.fall, numbers),
    dashJump: () => airClip(poses.leap, poses.fall, numbers),
    land: () =>
      timed(LANDING_TIME * numbers.landing, (age) =>
        blendPose(
          blendPose(poses.touchdown, poses.low, smooth(0, LANDING_SETTLE, age)),
          stance,
          landRecovery(age, numbers.landing),
        ),
      ),
    dash: () => still(poses.dash),
    airDash: () => still(poses.airDash),
    kick: () => still(poses.kick),
    wall: () => still(poses.wall),
    guard: () => still(poses.guard),
    airGuard: () => still(poses.airGuard),
    stagger: () => still(poses.stagger),
    parry: () =>
      timed(DEFENSE.parryPoseTime, (age) =>
        blendPose(
          blendPose(poses.parryContact, poses.parryReturn, smooth(0, 0.045, age)),
          poses.guard,
          parryRecovery(age),
        ),
      ),
    spell: () =>
      timed(SPELL_RELEASE_RECOVERY, (age) =>
        blendPose(poses.spell, stance, smooth(0.57, 1, age / SPELL_RELEASE_RECOVERY)),
      ),
    warpThrow: () => timed(ACTION_CLIPS.throw.hit, poses.warpThrow),
    warpFlight: () => timed(Math.min(WARP.maxFlight, STATE_CLIPS.throwWait.dur), poses.warpFlight),
    warpArrival: () => timed(ACTION_CLIPS.warpStrike.dur, poses.warpArrival),
    strikes: () => ({ first: strike("first"), second: strike("second"), third: strike("third"), air: strike("air") }),
    tiers: () => [
      tierClip(profile.tiers[0], poses),
      tierClip(profile.tiers[1], poses),
      tierClip(profile.tiers[2], poses),
      tierClip(profile.tiers[3], poses),
    ],
  };
  const given = profile.clips ?? {};
  const entries = Object.entries(bakers).map(([id, bake]) => [id, given[id as keyof DrillClips] ?? bake()]);
  return Object.fromEntries(entries) as DrillClips;
}
