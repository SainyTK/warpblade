/**
 * Wounds: every cut of Zafir's own opens one on the foe it lands on, and each bleeds on its own. The bleed counts with
 * his attacks on the end of run screen.
 */
export const WOUND = {
  /** wounds one cut opens, and a Keen cut */
  cut: 1,
  keen: 2,
  /** the most a foe carries */
  most: 5,
  /** each wound bleeds this multiple of attack damage per tick */
  per: 0.1,
  every: 1,
  /** seconds the wounds stay open after the last one */
  life: 3,
} as const;
/** the stack id his wounds bleed under */
export const WOUND_SOURCE = "attacks";
