import type { HitFeel } from "../../../types/move";
import type { Box } from "../../../types/world";

/** the thin line every thrust strikes along, from the feet facing right: 46 px ahead, 30 px tall round chest height */
export const THRUST_BOX: Box = [-2, -36, 46, -6];
/** the rising thrust's line, a little taller as the point climbs */
export const RISING_BOX: Box = [-2, -44, 42, -6];
/** the long lunge's line before Points reach it farther */
export const LUNGE_BOX: Box = [0, -32, 62, -4];

/** power of each blow of the string, as multiples of attack damage */
export const STRING_POWER = {
  leadThrust: 0.72,
  secondThrust: 0.72,
  risingThrust: 0.8,
  flickFirst: 0.42,
  flickSecond: 0.48,
  longLunge: 2,
} as const;

/**
 * Seconds after each blow before the next may cut in: short, so the string runs at about 0.27 real seconds a blow on the
 * beat. The lunge closes the combo once its follow-through starts.
 */
export const STRING_CANCEL = {
  thrust: 0.075,
  flick: 0.07,
  lunge: 0.12,
} as const;

/** the lunge carries Cerise forward from frame 2 to frame 5 at this speed, and pins every foe it strikes this long */
export const LUNGE = { speed: 120, pin: 0.7, stun: 0.55 } as const;

/** hit-stop, shake and sound of each blow: light taps, the lunge by far the heaviest */
export const STRING_FEEL = {
  thrust: { stop: 0.045, shake: [0.06, 0.8], pitch: 1.35 },
  rising: { stop: 0.055, shake: [0.08, 1.1], pitch: 1.2 },
  flick: { stop: 0.035, shake: [0.05, 0.7], pitch: 1.5 },
  lunge: { stop: 0.13, shake: [0.22, 2.6], pitch: 0.8 },
} as const satisfies Record<string, HitFeel>;

/** the diving thrust: the slant it drops on, its power, its line and how long it pins */
export const DIVE = { vx: 120, vy: 360, power: 1.5, pin: 0.6, box: [-2, -18, 24, 8] as Box } as const;
/** the air thrust Swallow Dive adds before the dive */
export const AIR_THRUST = { power: 1.1, box: [-2, -26, 40, -6] as Box } as const;
/** seconds after an air blow before the next may cut in */
export const AIR_CANCEL = 0.06;
