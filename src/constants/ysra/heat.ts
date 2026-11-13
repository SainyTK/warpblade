/** Heat: Ysra's second bar, built by glaive blows that land and spent on rites */
export const HEAT = {
  max: 100,
  /** per foe struck by a string blow, a sweep or an air sweep */
  perFoe: 6,
  /** per foe struck by a warp's rail, a vault crash, a dive impact or a counter */
  perFoeHeavy: 12,
  /** strike sources that pay the heavy rate, matched as parts of the source name */
  heavySources: ["rail", "vault", "dive", "counter"],
  /** Kindling: below this share of max HP, gains double and she takes less damage */
  lowBelow: 1 / 3,
  /** seconds without a landed blow before Heat starts to drain, and how fast it drains */
  drainDelay: 2.5,
  drainPerSecond: 8,
} as const;
