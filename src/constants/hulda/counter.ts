/** Iron Counter: how far the roar reaches and how long it makes foes reel, how long the evolved grip holds a big foe
 *  before the suplex, and the counter's hit-stop and shake */
export const COUNTER = {
  roarReach: 50,
  roarStun: 0.8,
  hold: 1,
  stop: 0.12,
  shake: [0.25, 3] as const,
} as const;
