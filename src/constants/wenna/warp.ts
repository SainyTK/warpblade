/** J held: her warp, a lit candle thrown at the foe that she trades places with; the throw's numbers are the shared `WARP` */
export const CANDLE_WARP = {
  /** with no foe ahead in reach, she throws at her farthest Wick ahead this near and trades places with it */
  wickReach: 160,
  /** the thrown candle stands up as a Wick where she stood, lit this many seconds */
  wickLife: 4,
  /** a Wick she trades places with arrives in a flare: ability power, reach and knockback */
  flare: 0.4,
  flareReach: 24,
  flareKnock: 60,
  /** her arrival: the lamp's flame thrown out ahead, its reach and half angle */
  cone: { far: 40, half: 0.5 },
  /** the arrival blow's box ahead of her and how hard it throws the foe */
  reach: 34,
  kx: 150,
  ky: -90,
} as const;

/** the candle in flight, in art pixels: its length, half its width and the flame's length, and how fast it tumbles */
export const THROWN_CANDLE = { length: 7, half: 1.25, flame: 4, spin: 14 } as const;
