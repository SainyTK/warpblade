/** Grit: her second bar, four iron plates that each turn one blow into half damage and no flinch */
export const GRIT = {
  max: 100,
  plate: 25,
  start: 25,
  /** Grit earned from each source */
  fist: 4,
  grab: 10,
  knee: 5,
  throw: 15,
  bellow: 10,
  taunt: 12,
  /** a blow she takes without spending a plate */
  hurt: 10,
  /** after this many quiet seconds, Grit drains at this rate */
  quietAfter: 4,
  drain: 4,
  /** a plate halves a blow; Iron Plates cuts it to this share */
  plated: 0.5,
  ironPlated: 0.4,
  /**
   * seconds she is safe after a plate or her armour takes a blow, and the hit-stop of the break; as long as a hurt's,
   * since a moth sheds its pollen in pairs and a shorter window lets the second puff through
   */
  safe: 0.8,
  stop: 0.05,
  /** Second Wind: each broken plate heals this share of max HP */
  secondWind: 0.03,
  /** seconds the plate-break flinch plays over her action */
  flinch: 4 / 30,
} as const;
