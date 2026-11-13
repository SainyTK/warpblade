import { frame } from "../hero";

/** K: Sable's guard, the crossbow stock raised across her: it lets a lot through, and its parry is Point-Blank */
export const SABLE_GUARD = {
  /** share of a blocked blow she still takes, and the stamina one block costs */
  chip: 0.4,
  blockCost: 14,
} as const;

/**
 * Point-Blank, her parry: she kicks the attacker away hard and her quiver fills at once with its first bolts primed.
 * The kick's clip starts at its hit frame, so the boot is out on the parry's hit-stop.
 */
export const POINT_BLANK = {
  /** the box ahead of her the boot reaches, pixels from her feet */
  box: [0, -24, 26, -2] as const,
  /** damage as a multiple of attack damage, and the throw */
  power: 1.6,
  kx: 380,
  ky: -90,
  stun: 0.8,
  /** bolts primed at the base bonus */
  primed: 4,
  /** the kick clip's hit frame, where the parry's pose picks it up */
  hit: frame(4),
} as const;

/** Heavy Boot's stock bash on a block: the box ahead and its throw */
export const STOCK_BASH = { box: [0, -26, 20, -8] as const, kx: 160, ky: -40, stun: 0.3 } as const;
