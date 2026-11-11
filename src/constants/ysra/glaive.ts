import type { HitFeel } from "../../types/move";

/**
 * Heft: J held on the first blow of a string turns the hip thrust into a held draw. Seconds are of charge time,
 * which Deep Heft runs faster.
 */
export const HEFT = {
  /** J still held this long into the hip thrust, before its blow lands, becomes a heft */
  after: 0.14,
  /** released before this much charge: a quick poke */
  poke: 0.2,
  /** a full wind */
  full: 0.6,
} as const;

/** the held lunge: how far it travels at full charge, how long the travel takes, and how much of it is untouchable */
export const LUNGE = {
  travel: 60,
  /** a lunge released at the shortest heft still travels this part of a full one */
  least: 0.3,
  /** seconds into the clip the feet leave, and how long the travel lasts */
  start: 0.04,
  time: 0.2,
  guard: 0.15,
  /** damage at the least and the full charge, as a multiple of attack damage */
  power: [1.3, 3] as const,
  /** the blade reaches this far ahead of her feet while she travels, at this height band */
  tip: 38,
  box: [-6, -28, -4] as const,
  /** Skewer: the carried foe rides this far ahead of her feet, and the slam's stun */
  carry: 26,
  slam: { stun: 1.2 },
  /** the rail runs along the line this long after the lunge stops, and back after three times as long */
  railDelay: 0.08,
} as const;

/** air sweeps lift a foe at this speed once she may sweep twice, and lift her this many pixels with it */
export const REAPER = { launch: -170, lift: 22 } as const;

/** contact feel of the glaive, from the quick poke to the impale; heavier and lower than Kael's */
export const GLAIVE_FEEL = {
  poke: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.05 },
  thrust: { stop: 0.09, shake: [0.14, 1.8], pitch: 0.9 },
  sweep: { stop: 0.1, shake: [0.16, 2], pitch: 0.82 },
  rise: { stop: 0.12, shake: [0.2, 2.6], pitch: 0.72 },
  windmill: { stop: 0.07, shake: [0.1, 1.4], pitch: 1 },
  impale: { stop: 0.2, shake: [0.32, 3.8], pitch: 0.55 },
  lunge: { stop: 0.11, shake: [0.2, 2.6], pitch: 0.75 },
  counter: { stop: 0.24, shake: [0.36, 4.2], pitch: 0.5 },
} as const satisfies Record<string, HitFeel>;

/** Warpath's running impale: she keeps this speed for this long into it, then digs in */
export const WARPATH_RUN = { speed: 170, time: 0.26, brake: 0.85 } as const;

/**
 * The ground string's rhythm. A queued blow cuts in this long after the hip thrust or the middle blow lands, once its
 * hold and the start of its follow-through have shown; the middle blow hands over sooner, since the impale's wind-up is
 * the longest. Every blow before the impale staggers a minion past the next blow of the string. Game seconds.
 */
export const GLAIVE_STRING = { cancel: { hip: 0.16, sweep: 0.14 }, stagger: 0.65 } as const;
