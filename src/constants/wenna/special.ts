/** U: Great Wick, a giant Wick that rises from a pool of wax, swings once across the reach and melts into new Wicks */
export const GREAT_WICK = {
  /** anticipation: the pole planted and the pool spreading */
  windup: 0.3,
  /** seconds it takes to rise */
  rise: 0.3,
  /** when its arm swings, after the press */
  swing: 0.6,
  /** seconds it takes to melt into Wicks */
  melt: 0.4,
  height: 48,
  kx: 160,
  ky: -120,
  /** Wicks it melts into at each charge level, how far past her cap they may go, and how long they live */
  wicks: [1, 2, 3, 4],
  pastCap: 2,
  wickLife: 8,
  /** the pose holds this long, then she is free while it swings */
  hold: 0.35,
} as const;
