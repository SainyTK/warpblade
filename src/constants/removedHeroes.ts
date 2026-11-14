/**
 * The heroes that left the roster in patch 0.11.0, with the coins each cost to unlock in 0.10.0. A save that had
 * bought one gets that price back once, when it is first read without them (`parseMeta`). This table is the only place
 * the game still names them.
 */
export const REMOVED_HERO_PRICES: Readonly<Record<string, number>> = {
  sable: 300,
  hulda: 400,
  orrin: 550,
  mirel: 750,
  wenna: 1000,
  tallis: 1350,
  jory: 1800,
  brannoc: 2450,
};
