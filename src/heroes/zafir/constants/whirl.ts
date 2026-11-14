/**
 * Whirl (WH): Zafir's meter. It fills while his own blows keep landing and drains once they stop, and at its two
 * thresholds a ring of sand and wind turns round him and cuts the foes it touches.
 */
export const WHIRL = {
  most: 100,
  /** each of his own hits that lands */
  perHit: 7,
  /** a Keen blow adds this on top */
  keen: 10,
  /** seconds after his last hit before it drains, and how fast it drains then */
  hold: 1.1,
  decay: 32,
} as const;

/** one turn of the sand ring: from this much Whirl, reaching this far round him at waist height, cutting each foe it
 *  touches this often for this multiple of attack damage, and opening this many wounds */
export interface RingTier {
  from: number;
  reach: number;
  every: number;
  power: number;
  wounds: number;
}
export const RING_TIERS: readonly RingTier[] = [
  { from: 40, reach: 26, every: 0.45, power: 0.25, wounds: 0 },
  { from: 80, reach: 34, every: 0.4, power: 0.38, wounds: 1 },
];
/** the ring's look: grains in it at each tier, how fast it turns, and how flat it lies */
export const RING_LOOK = { grains: [10, 16], spin: 5, flat: 0.32, height: 16 } as const;
