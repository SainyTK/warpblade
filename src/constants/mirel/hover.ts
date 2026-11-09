/** W held past the top of her jump: she hangs in the air */
export const HOVER = {
  gravity: 0.12,
  /** the fastest she sinks, pixels a second */
  fall: 18,
  /** her drift with A or D held */
  drift: 60,
  /** seconds per airtime, and stamina a second */
  time: 1.5,
  stamina: 18,
} as const;
