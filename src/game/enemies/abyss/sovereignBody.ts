import type { Rig } from "../night/rig";
import type { Pt } from "./paint";
import type { SovereignPose } from "./sovereignPose";

/** where the hips sit when it stands upright, the pivot its upper body leans around */
export const HIP_Y = -22;
/** the shoulder joints of the near and far arm, standing upright */
export const SHOULDER = { front: [9.5, -34] as Pt, rear: [-9, -34] as Pt };
/** the hip joints of the near and far leg, standing upright */
export const HIP = { front: [4, HIP_Y] as Pt, rear: [-4, HIP_Y] as Pt };
/** how far a blow must have gathered before its eyes and void light burn white */
const HOT = 0.6;
/** how fast it breathes, in radians a second */
const BREATH = 2.1;
/** limb lengths: upper arm, forearm, thigh and shin */
export const LIMB = { upper: 10.5, fore: 10, thigh: 10.5, shin: 10.5 } as const;

/** One drawing of the Sovereign: its rig, its pose, its time with the seed added, and its upper body transform. */
export interface SovereignBody {
  g: Rig;
  pose: SovereignPose;
  time: number;
  enraged: boolean;
  /** a blow has gathered or it is enraged: its eyes, gems and slits of void light burn white */
  hot: boolean;
  /** the side of its own x the black sun lights, 1 ahead or -1 behind, for highlights placed by hand */
  lit: 1 | -1;
  /** an upright point of the upper body, leaned, dropped, shifted and sunk as the pose says */
  at(x: number, y: number): Pt;
  /** a point that stands on its own, such as a foot or the grip, sunk with the body */
  sunk(p: Pt): Pt;
}

/** the body for one drawing: the upper body leans around the hips, then drops, shifts and sinks with the pose */
export function sovereignBody(g: Rig, pose: SovereignPose, time: number, enraged: boolean, lit: 1 | -1): SovereignBody {
  const c = Math.cos(pose.lean);
  const s = Math.sin(pose.lean);
  // its chest rises and falls one image pixel with each slow breath
  const breath = Math.sin(time * BREATH) > 0.3 ? -0.5 : 0;
  return {
    g,
    pose,
    time,
    enraged,
    hot: enraged || pose.heat > HOT,
    lit,
    at: (x, y) => {
      const dy = y - HIP_Y;
      return [x * c - dy * s + pose.shift, HIP_Y + x * s + dy * c + pose.drop + pose.sink + breath];
    },
    sunk: (p) => [p[0], p[1] + pose.sink],
  };
}

/**
 * The middle joint of a two part limb from a to b, such as an elbow or a knee: side 1 turns the first part clockwise
 * on screen from the line a to b, -1 counterclockwise. A target out of reach straightens the limb toward it.
 */
export function joint(a: Pt, b: Pt, first: number, second: number, side: number): Pt {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(first - second) + 0.1), first + second - 0.01);
  const toward = Math.atan2(dy, dx);
  const bend = Math.acos((first * first + d * d - second * second) / (2 * first * d));
  return [a[0] + Math.cos(toward + side * bend) * first, a[1] + Math.sin(toward + side * bend) * first];
}
