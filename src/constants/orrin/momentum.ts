/** Momentum, his second bar: filled by speed in the air, a multiplier on every hit he deals */
export const MOMENTUM = {
  most: 100,
  /** a second while in the air faster than `fastFrom` pixels a second */
  flying: 40,
  fastFrom: 140,
  tip: 5,
  slip: 20,
  /** a second, once he has stood on the floor this long without a tip hit */
  drain: 12,
  grace: 1.5,
  hurt: 30,
  /** every hit is multiplied by 1 + bonus x Momentum / most */
  bonus: 0.4,
  /** from this much Momentum his blows reach further */
  reachFrom: 50,
} as const;
