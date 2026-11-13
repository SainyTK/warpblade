import type { StaffBlowSpec } from "./string";
import { ECHO_FEEL } from "./string";

/**
 * J held: she flings her staff, swinging like a pendulum as it flies; time skips and she is there, striking, and the
 * blow strikes again as an echo the way her string's do.
 */
export const MIREL_WARP = {
  /**
   * The echo's share of the arrival blow before her echo rules halve it on most foes: a fifth of the blow on most foes,
   * two fifths on a foe in a field or stopped.
   */
  echo: 0.4,
  /** the flying staff: its length behind the ring, the ring's radius, its widest swing either way and swings a second */
  length: 18,
  ring: 3,
  swing: 0.8,
  rate: 2.5,
} as const;

/** the arrival's sweep as a staff blow, for its echo: an arc from above her down through the foe ahead */
export const ARRIVAL_BLOW: StaffBlowSpec = {
  dur: 0,
  hit: 0,
  shape: { kind: "arc", radius: 32, a0: 0.6, a1: -1.6 },
  power: 1,
  kx: 120,
  ky: -60,
  feel: ECHO_FEEL,
};
