export const COST = { warp: 10 } as const;
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
  /** a J this soon after a dash is a dash attack */
  dashLink: 0.18,
} as const;

/** Stamina: every dash spends part of the bar, and it comes back after a short pause, slower while Kael attacks. */
export const STAMINA = {
  /** spent by one dash; the base bar holds two */
  dashCost: 50,
  /** seconds after a dash ends before stamina starts coming back */
  delay: 0.5,
  /** stamina per second while Kael is not attacking */
  regen: 45,
  /** stamina per second during attacks, casts, throws and the ultimate */
  regenBusy: 18,
  /** a perfect dodge gives back this much */
  perfectRefund: 25,
  /** seconds the bar flashes after a dash it could not pay for */
  emptyFlash: 0.35,
} as const;

/** how long the HUD flashes after a press is refused */
export const DENY_FLASH = 0.25;

export const WARP = {
  speed: 560,
  maxFlight: 0.6,
  reach: 180,
  anchorReach: 220,
  fallback: 110,
  /** seconds before Kael can warp again, far shorter than any spell's */
  cooldown: 2,
  /** warp strike damage as a multiple of attack damage, plus a bonus for distance travelled */
  power: 1.8,
  powerPerPixel: 0.014,
  maxDistanceBonus: 2.8,
} as const;

export const COMBO = {
  /** pause after a combo is finished before the next one can start */
  cooldown: 0.2,
  /** a move that hits nothing plays this much of its clip before anything can cancel it */
  whiff: 0.85,
  /** time after a move ends to press J and keep the combo going */
  link: 0.25,
  /** a queued move starts this long after the last blow of the current one */
  cancel: 0.09,
  /** a minion struck by the sword staggers this long, which outlasts the gap to the string's next blow */
  stagger: 0.45,
} as const;

/** A minion struck by a hero's blow staggers: its wind-up or attack is cut and it cannot act until it steadies.
 *  Mini bosses and bosses never stagger. */
export const STAGGER = {
  /** blows in a row a minion staggers for before it braces, and an elite */
  limit: 7,
  eliteLimit: 4,
  /** seconds a braced foe cannot be staggered */
  brace: 1.6,
  /** seconds without a stagger before the count of blows starts again */
  forget: 1,
  /** seconds after a stagger ends before the foe may attack */
  rest: 0.35,
  /** how fast a staggered foe slides to a stop */
  friction: 6,
  /** a struck foe is drawn knocked this many pixels away from the hero, easing back while its hit flash lasts */
  kick: 2,
} as const;

/** The hit counter: the hero's hits in a row, shown from `from` hits, lost after `window` seconds without one or when hurt */
export const HIT_COUNT = { from: 3, window: 2, tiers: [10, 25, 50] } as const;

export const DAMAGE = {
  crit: 1.75,
  back: 1.5,
  air: 2,
  /** the most extra damage a foe can take from marks and the like together: +100% */
  takenCap: 1,
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
  /** frontal blows in a row that open the guard: the first is blocked, the second breaks through */
  breakAfter: 2,
  /** a heavy blow breaks the guard and staggers the foe this long */
  breakStun: 0.7,
  /** Kael is pushed back this fast off a blocked blow */
  pushback: 90,
} as const;

/** Wisps slip away from a swing aimed at them while they drift. */
export const EVADE = { fromWave: 2, base: 0.2, perWave: 0.02, max: 0.6, reach: 50, speed: 230, cooldown: 2.4 } as const;

/** Dashing through an attack in the first moments of the dash: the world slows and Kael gets MP back (and STAMINA.perfectRefund). */
export const PERFECT = { window: 0.12, slow: 0.7, timeScale: 0.3, mp: 8 } as const;

/** after this many hits in the air a foe is no longer held up */
export const JUGGLE_LIMIT = 6;
/** Kael cannot be hurt again for this long after a hit */
export const HURT_INVULN = 0.8;

/** Blink Step costs this share of the warp's MP */
export const BLINK_COST = 0.5;

/** Ice Spikes' shatter cuts foes this close to the frozen one */
export const SHATTER_REACH = 42;
/** Fire Flask's ignition burns foes this close to the thrown foe */
export const IGNITION_RADIUS = 34;

/** chilled foes (a skill's cold) move at this share of their speed */
export const CHILL_PACE = 0.5;
/** a phantom's repeat of a blow lands this long after it */
export const ECHO_DELAY = 0.3;
/** a stomp drags airborne foes this close down with Kael */
export const GRAVITY_REACH = 60;
