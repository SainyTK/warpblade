/** K: she raises the lantern before her; it blocks cheaply but lets much through, and its parry is Flare Back */
export const LANTERN_GUARD = {
  /** share of a blocked blow she still takes, and the stamina a block costs */
  chip: 0.4,
  blockCost: 8,
} as const;

/** Flare Back: the lantern's shutter thrown open at a parry, blinding the foes ahead and lighting a Wick at her feet */
export const FLARE_BACK = {
  /** seconds a minion or an elite stays blind; a mini boss or the Warden shakes it off sooner */
  blind: 1.6,
  bigBlind: 0.5,
  /** the flash reaches this far ahead and this far above and below her chest */
  reach: 90,
  rise: 36,
  /** ability power of the flash on each foe it reaches */
  power: 0.8,
  kx: 90,
  /** the flash's cone as drawn */
  half: 0.6,
} as const;
