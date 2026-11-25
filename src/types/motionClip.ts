import type { Pose } from "./pose";

export type DrillStrikeId = "first" | "second" | "third" | "air";

export interface PoseClip {
  frames: readonly Pose[];
  snaps: readonly number[];
}

export interface DrillClips {
  idle: PoseClip;
  run: PoseClip;
  brake: PoseClip;
  jump: PoseClip;
  dashJump: PoseClip;
  land: PoseClip;
  dash: PoseClip;
  airDash: PoseClip;
  kick: PoseClip;
  wall: PoseClip;
  guard: PoseClip;
  airGuard: PoseClip;
  stagger: PoseClip;
  parry: PoseClip;
  spell: PoseClip;
  warpThrow: PoseClip;
  warpFlight: PoseClip;
  warpArrival: PoseClip;
  strikes: Readonly<Record<DrillStrikeId, PoseClip>>;
  tiers: readonly [PoseClip, PoseClip, PoseClip, PoseClip];
}
