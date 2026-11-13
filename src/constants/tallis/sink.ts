/** I: Sink, a shadow pool that glides along the floor under ground foes and rises with Rising Cut */
export const SINK = {
  /** stamina to start, and a second while under */
  start: 20,
  drain: 40,
  /** seconds at most in the pool, and the least a held Sink lasts once I is let go */
  max: 1,
  least: 0.15,
  /** seconds a tapped Sink glides on its own the way he faces, far enough to pass under a foe ahead */
  dip: 0.35,
  /** seconds his body takes to pour down into the pool, and to pour back up as Rising Cut starts */
  pour: 0.1,
  rise: 0.15,
  /** seconds after a rise before the next Sink */
  wait: 0.7,
  /** glide speed, scaled by move speed */
  glide: 115,
  /** the pool's width on the floor */
  width: 18,
  /** a blow in this first moment of the Sink is a perfect dodge */
  perfect: 0.12,
  /** rising within this far behind a foe (on the side it does not face) opens an Ambush for `ambushWindow` */
  ambushBehind: 24,
  ambushWindow: 0.5,
  /** I in the air drops him straight down this fast */
  plummet: 360,
} as const;
