/**
 * Crimson Fall: how far the crescent reaches at each charge level, its share of the level's power, how high it hits,
 * how long foes lie down, how high she leaps, the seconds between its skill's crescents and between its aftershocks,
 * how far past its reach its skill drags foes in from (a multiple of the reach), and how hard
 */
export const FALL = {
  reach: [70, 110, 160, 340],
  share: 0.8,
  height: 70,
  stun: 1,
  lift: 34,
  next: 0.28,
  quakeEvery: 0.3,
  pull: 1.6,
  drag: 160,
} as const;
