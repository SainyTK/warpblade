import type { Element } from "../types/spell";

export const COST = { warp: 10, cast: 18 } as const;
export const ELEMENTS: readonly Element[] = ["fire", "ice", "volt"];
/** MP per second, standing and hanging from a crystal */
export const MP_REGEN = { normal: 2, hanging: 14 } as const;
export const MP_PER_HIT = 2;

export const HERO_MOVE = {
  walkSpeed: 68,
  runSpeed: 125,
  groundAccel: 900,
  airAccel: 650,
  gravity: 900,
  maxFall: 420,
  /** pixels each jump rises with Up held all the way: from the floor, again in the air, and off a crystal */
  jumpRise: 62,
  doubleJumpRise: 50,
  hangJumpRise: 38,
  dashSpeed: 270,
  dashTime: 0.24,
  /** seconds to get one dash charge back */
  dashRecharge: 0.6,
  /** a J this soon after a dash is a dash attack */
  dashLink: 0.18,
} as const;

export const WARP = {
  speed: 560,
  maxFlight: 0.6,
  reach: 180,
  anchorReach: 220,
  fallback: 110,
  cooldown: 1,
  /** warp strike damage as a multiple of attack damage, plus a bonus for distance travelled */
  power: 2.2,
  powerPerPixel: 0.014,
  maxDistanceBonus: 2.8,
} as const;

export const COMBO = {
  /** pause after a combo is finished before the next one can start */
  cooldown: 0.5,
  /** a move that hits nothing plays this much of its clip before anything can cancel it */
  whiff: 0.85,
  /** time after a move ends to press J and keep the combo going */
  link: 0.25,
  /** a queued move starts this long after the last blow of the current one */
  cancel: 0.09,
  /** a husk struck by the sword stops walking this long, so it does not walk into Kael mid-combo */
  stagger: 0.35,
} as const;

export const DAMAGE = {
  crit: 1.75,
  back: 1.5,
  air: 2,
  /** damage taken with Iron Will */
  ironWill: 0.85,
} as const;

/** how hard a falling foe is pulled down, and how its juggle is kept up */
export const ENEMY_AIR = {
  gravity: 760,
  /** a hit on an airborne foe keeps it rising at least this fast */
  juggle: -110,
  /** a wisp recovers after this long in the air */
  wispRecover: 1.3,
  /** seconds on the floor after landing */
  landStun: 0.45,
  spike: 340,
  /** a spiked foe bounces off the floor this fast */
  bounce: -150,
} as const;
/** foes take this long to turn around once the hero is behind them */
export const TURN_DELAY = { minion: 0.45, mini: 0.7, boss: 0.9 } as const;

/** Husks (from wave 3) and brutes block sword blows from the front while they walk. */
export const GUARD = {
  fromWave: 3,
  /** share of the damage a blocked blow still does */
  chip: 0.1,
  /** blocked blows in a row before the foe strikes back at once */
  counterAfter: 2,
  /** how far into its wind-up a counter starts, so it comes out fast */
  counterWind: 0.4,
  /** a heavy blow breaks the guard and staggers the foe this long */
  breakStun: 0.7,
  /** Kael is pushed back this fast off a blocked blow */
  pushback: 90,
} as const;

/** Wisps slip away from a swing aimed at them while they drift. */
export const EVADE = { fromWave: 2, base: 0.2, perWave: 0.02, max: 0.6, reach: 50, speed: 230, cooldown: 2.4 } as const;

/** Dashing through an attack in the first moments of the dash: the world slows and Kael gets MP back. */
export const PERFECT = { window: 0.12, slow: 0.7, timeScale: 0.3, mp: 8 } as const;
export const RIPOSTE = { time: 1.5, power: 3 } as const;

/** after this many hits in the air a foe is no longer held up */
export const JUGGLE_LIMIT = 6;
/** Kael cannot be hurt again for this long after a hit */
export const HURT_INVULN = 0.8;

/** fusion tuning: damage as multiples of attack damage (ad) or ability power (ap) */
export const FUSION = {
  staticStrike: 1.5,
  staticMark: 2,
  shatterShards: 0.8,
  shatterReach: 42,
  ignition: 2.2,
  ignitionRadius: 34,
  echo: 0.5,
  echoDelay: 0.3,
  manaWave: 0.8,
  manaWaveCost: 3,
  manaWaveFrom: 0.75,
  gravityReach: 60,
} as const;
