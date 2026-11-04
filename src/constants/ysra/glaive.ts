import type { HitFeel, MoveId } from "../../types/move";

/** Ysra's string is one blow longer than Kael's at every level: three blows at level 1 */
export const GLAIVE_STRING_BONUS = 1;

/** the plain ground string in order; past its end it keeps trading the sweep and the cleave, and the last blow a
 *  string allows is always the impale */
export const GLAIVE_STRING: readonly MoveId[] = ["hipThrust", "reverseSweep", "overheadCleave", "twirl"];
export const GLAIVE_STRING_LOOP: readonly MoveId[] = ["reverseSweep", "overheadCleave"];

/** Long Haft: every glaive blow reaches this many pixels further per rank, and the glaive is drawn that much longer */
export const HAFT_REACH = { skill: "l_haft", perRank: 3 } as const;

/**
 * Heft: J held on the first blow of a string turns the hip thrust into a held draw. Seconds are of charge time,
 * which Deep Heft runs faster per rank.
 */
export const HEFT = {
  /** J still held this long into the hip thrust, before its blow lands, becomes a heft */
  after: 0.14,
  /** released before this much charge: a quick poke */
  poke: 0.2,
  /** a full wind */
  full: 0.6,
  /** Deep Heft: the wind runs this much faster per rank */
  skill: "l_heft",
  ratePerRank: 0.3,
} as const;

/** the held lunge: how far it travels at full charge, how long the travel takes, and how much of it is untouchable */
export const LUNGE = {
  travel: 60,
  /** Deep Heft: this many pixels further per rank at full charge */
  travelPerRank: 10,
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
  /** Skewer: the carried foe rides this far ahead of her feet, and the slam's power, stun and shake */
  carry: 26,
  slam: { power: 1.5, stun: 1.2 },
  /** Rail Lance: the second pass runs back along the line this long after the lunge stops */
  railDelay: 0.08,
  railPower: 0.6,
} as const;

/** Impale: the last blow of a full string pins every foe it struck: they cannot act and take more damage */
export const PIN = { time: 1.5, taken: 1.5 } as const;

/** Skyhook out of a jump: J with Up held this soon after leaving the floor turns the jump into the rising hook */
export const SKYHOOK_GRACE = 0.14;

/** air sweeps before she lands: one, and one more with High Reaper */
export const AIR_SWEEPS = { base: 1, reaper: 1 } as const;
/** High Reaper: air sweeps throw the foe up at this speed and lift her this many pixels with it */
export const REAPER = { launch: -170, lift: 22 } as const;

/** contact feel of the glaive, from the quick poke to the impale; heavier and lower than Kael's */
export const GLAIVE_FEEL = {
  poke: { stop: 0.06, shake: [0.1, 1.2], pitch: 1.05 },
  thrust: { stop: 0.09, shake: [0.14, 1.8], pitch: 0.9 },
  sweep: { stop: 0.1, shake: [0.16, 2], pitch: 0.82 },
  cleave: { stop: 0.15, shake: [0.26, 3.2], pitch: 0.62 },
  twirl: { stop: 0.07, shake: [0.1, 1.4], pitch: 1 },
  impale: { stop: 0.2, shake: [0.32, 3.8], pitch: 0.55 },
  lunge: { stop: 0.11, shake: [0.2, 2.6], pitch: 0.75 },
  counter: { stop: 0.24, shake: [0.36, 4.2], pitch: 0.5 },
} as const satisfies Record<string, HitFeel>;

/** Skyhook: she rises this many pixels after the foe as the hook lands */
export const SKYHOOK_RISE = 30;

/** Warpath's running impale: she keeps this speed for this long into it, then digs in */
export const WARPATH_RUN = { speed: 170, time: 0.26, brake: 0.85 } as const;
