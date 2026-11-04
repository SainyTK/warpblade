import type { HeroState } from "../../types/hero";
import { frame } from "../hero";

/**
 * Animation frames Kael's pose takes to cross from wherever it was into a new clip, at even steps. Blows take two, up to their hit frame, so
 * the wind-up still reads before the hit frame; hits taken and warp arrivals cut at once, since the cut is the read.
 */
export const HANDOVER_FRAMES: Partial<Record<HeroState, number>> = {
  move: 2,
  jump: 2,
  dash: 2,
  hurt: 0,
  dead: 0,
  warpStrike: 0,
  fall: 2,
  hang: 2,
  cast: 2,
  throw: 2,
  throwWait: 2,
  charge: 2,
  ultimate: 2,
  idle: 3,
  walk: 3,
  run: 3,
};
/** a turn on the spot or mid-stride swings the body through the new facing over this many frames */
export const TURN_FRAMES = 2;

/**
 * Ground covered by one full stride (both feet), in pixels. The stride clip is sampled by distance, so the planted
 * foot keeps pace with the floor at any speed.
 */
export const STRIDE = { walk: 24, run: 44 } as const;

/** the jump clip may run ahead of the clock by at most this rate when a let-go of Up cuts the rise short */
export const JUMP_CATCH_UP = 2.5;

/**
 * The landing: a fall faster than `from` (pixels per second) ends in the knees taking the weight, scaled up to a full
 * crouch at `full`. Standing, the landing clip plays; in a stride, the hips dip by `dip` pixels and come back.
 */
export const LANDING = { from: 120, full: 380, dip: 2.5, dipFrames: 4, clipEnd: frame(7) } as const;

/** the catch on a crystal: the feet swing this many pixels under the hand, once every `period` seconds, dying away over `settle` */
export const HANG_SWING = { amplitude: 3, period: 0.7, settle: 0.45 } as const;

/**
 * A blow's clock runs at this share of speed until its first hit, so the wind-up holds a beat before the snap:
 * 0.065 s of clip to the strike take 0.1 s, about one animation frame more.
 */
export const WINDUP_RATE = 0.65;
