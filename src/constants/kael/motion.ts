import type { HeroState } from "../../types/hero";
import { frame } from "../hero";

/**
 * Animation frames Kael's pose takes to cross from wherever it was into a new clip, at even steps. A blow crosses into
 * its wind-up over two, so the wind-up then holds for the frames left before the strike; hits taken and warp arrivals
 * cut at once, since the cut is the read.
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
 * A walk, run or dash that stops on the spot settles onto the knees like a light landing, this deep on the landing
 * clip's scale of 0 to 1, so the travel ends in a recovery.
 */
export const STOP_DEPTH: Readonly<Record<string, number>> = { walk: 0.3, run: 0.55, dash: 0.75 };

/**
 * Travel from a stand starts with a load: the hips drop `dip` pixels and the chest leans `lean` pixels into it on the
 * first frame, easing out over `frames`. A dash loads deeper.
 */
export const TRAVEL_LOAD: Readonly<Record<string, { dip: number; lean: number; frames: number }>> = {
  walk: { dip: 1, lean: 1.5, frames: 4 },
  run: { dip: 1.5, lean: 2.5, frames: 4 },
  dash: { dip: 2.5, lean: 3, frames: 3 },
};

/** a jump pushes off from bent knees: the hips start `dip` pixels low and the hands `swing` pixels low, rising out over `frames` */
export const TAKEOFF = { dip: 3, swing: 3, frames: 3 } as const;
