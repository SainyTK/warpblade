import type { CueWord, DamageTag } from "../types/game";

/** Damage numbers over the foes: how they merge, stack and stay readable when many hits land at once. */
export const DAMAGE_NUMBERS = {
  /** hits on the same foe within this many seconds of a number popping add into it */
  merge: 0.3,
  /** at most this many numbers show at once; the oldest quiet one, then the oldest plain one, then the oldest gives way */
  cap: 28,
  /** a new number moves up past numbers this recent until it overlaps none, in steps, at most this many times */
  stackFresh: 0.4,
  stackStep: 5,
  stackTries: 8,
  /** seconds a number lives, plain and big */
  life: 0.7,
  bigLife: 0.9,
  /** rise speed, plain and big */
  rise: -45,
  bigRise: -60,
  /** numbers of a skill's own hits rise slower, so the hero's own hits read first */
  quietRise: -32,
  /** from this value on a number is drawn in thousands, as 123K */
  thousandsFrom: 100_000,
} as const;

/** the word drawn over each kind of number; plain and burn hits carry none */
export const NUMBER_WORDS: Readonly<Record<DamageTag | CueWord, string>> = {
  normal: "",
  crit: "CRIT",
  back: "BACK",
  air: "AIR",
  burn: "",
  block: "BLOCK",
  break: "BREAK",
  shatter: "SHATTER",
  evade: "EVADE",
  perfect: "PERFECT",
  parry: "PARRY",
  broken: "GUARD BROKEN",
};
/** how far above a number its word sits */
export const WORD_LIFT = 7;
