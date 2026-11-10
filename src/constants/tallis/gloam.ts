/** Gloam, the GL bar under stamina: it refills while no foe near faces him and from his blows from behind */
export const GLOAM = {
  max: 100,
  /** a run starts here */
  start: 50,
  /** a second while he is Unseen: out of the Veil, and no minion or mini boss within `seenReach` faces him */
  refill: 5,
  seenReach: 140,
  /** each knife blow from behind, and more when it fells the foe */
  backBlow: 6,
  backKill: 12,
  /** seconds the bar blinks after a press it could not pay for */
  flash: 0.35,
} as const;
