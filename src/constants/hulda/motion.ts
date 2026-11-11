import { frame } from "../hero";

/** her one low, heavy jump; she has no double jump */
export const HULDA_JUMP_RISE = 44;

/** ground one full stride covers: shorter, heavier steps than Kael's, and she never runs */
export const HULDA_STRIDE = 20;

/** from a stand her walk loads for `load` seconds before her feet move, then comes up to speed over `ramp` */
export const WALK_LOAD = { load: frame(3), ramp: frame(4) } as const;

/**
 * Her landing: a fall faster than `from` (pixels per second) ends in the knees taking her weight, scaled up to the
 * full clip at `full`; in a stride the hips dip by `dip` pixels over `dipFrames` frames.
 */
export const HULDA_LANDING = { from: 100, full: 330, dip: 3, dipFrames: 5 } as const;
