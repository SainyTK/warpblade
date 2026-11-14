/**
 * Anvil Drop: the hop in the air rises this share of her jump; the landing throws minions up this fast; fliers within
 * the landing's reach times `flierReach` are shaken down `drag` pixels and reel `flierStun` seconds
 */
export const ANVIL = {
  hop: 0.5,
  launch: -220,
  flierReach: 1.5,
  drag: 40,
  flierStun: 0.8,
  stop: 0.04,
  shake: [0.14, 2] as const,
} as const;
