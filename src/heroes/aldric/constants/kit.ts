import { FEEL } from "../../../constants/combo";
import type { HitFeel } from "../../../types/move";

/**
 * Seconds after each blow of the ground string before the next may cut in. With the next blow's wind-up this gives
 * about 0.5 real seconds from one blow landing to the next and about 0.65 from Crest breaker to the next Oath cut.
 */
export const STRING_CANCEL = { oathCut: 0.13, shieldBash: 0.13, finisher: 0.16 } as const;
/** seconds after a blow of the air string before the next may cut in */
export const AIR_CANCEL = 0.07;

/** hit-stop, shake and sound of each blow, growing to Crest breaker */
export const STRING_FEEL = {
  oathCut: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.1 },
  shieldBash: { stop: 0.08, shake: [0.14, 1.8], pitch: 0.85 },
  crestBreaker: { stop: 0.15, shake: [0.26, 3.2], pitch: 0.65 },
  skyCut: FEEL.light,
  shieldFall: FEEL.firm,
} as const satisfies Record<string, HitFeel>;

/** the blows of the string and the air string, as multiples of attack damage */
export const BLOW_POWER = { oathCut: 1.2, shieldBash: 1, crestBreaker: 2.4, skyCut: 1, shieldFall: 1.2 } as const;
/** Shield bash staggers this long; Crest breaker knocks down this long */
export const BASH_STAGGER = 0.7;
export const CREST_STUN = 0.9;
/** Shield fall: the dive speed, the tuck before it, and the ring where he lands */
export const SHIELD_FALL = { dive: 330, tuck: 0.07, ring: 28, power: 1.3, stun: 0.5 } as const;

/** the guard: share let through, stamina a block costs, and the walk behind it as a share of his walk speed */
export const GUARD = { chip: 0, blockCost: 8, walk: 0.45 } as const;
/**
 * The Guard bash, J with the guard up: its power, stagger, push, the seconds before the next, the clip's length and its
 * hit; a Counterbash when it starts within `counterWindow` of a block, at `counterPower` and a sure crit.
 */
export const GUARD_BASH = {
  power: 0.9,
  stagger: 0.6,
  kx: 50,
  every: 0.4,
  dur: 0.36,
  hit: 0.1,
  counterWindow: 0.35,
  counterPower: 2,
} as const;
/** the Stun bash a parry answers with */
export const STUN_BASH = { power: 1.3, stun: 1.1, kx: 70 } as const;

/** Valor: the most, what each deed adds, and Radiance at full */
export const VALOR = {
  most: 100,
  block: 12,
  parry: 25,
  guardBash: 8,
  counter: 16,
  shieldBash: 6,
} as const;
/** Radiance: seconds it runs, extra damage on each of his own blows, and its wave's power, speed, reach and height */
export const RADIANCE = { time: 6, bonus: 0.35, wave: 0.5, speed: 240, reach: 64, half: 8 } as const;

/** Bulwark: seconds after a warp arrival in which the next blow is taken */
export const BULWARK = { time: 2.5 } as const;

/** Shieldcast: an ability cast in an open string after this many blows hits this much harder */
export const SHIELDCAST = { after: 2, power: 1.25 } as const;
