/**
 * How the Flare's cone of flame is drawn: its life in seconds, how many tongues it splits into across its width, how
 * far the shortest tongue reaches as a share of the longest, how see-through it is at its root and its rim, the share
 * of its reach that burns pale, and its light.
 */
export const CONE_LOOK = {
  life: 0.22,
  tongues: 9,
  shortest: 0.55,
  rootAlpha: 0.85,
  rimAlpha: 0.3,
  hot: 0.3,
  /** thin bright streaks thrown down the cone: how many, and how fast they run out along it */
  streaks: 5,
  light: { strength: 0.3, glow: 0.14 },
} as const;

/**
 * The wave of flame the Great Wick's arm sends along the floor: its life in seconds, how tall its tongues stand at the
 * front, how far behind the front they still burn, how wide one tongue is, and how see-through it is.
 */
export const WAVE_LOOK = { life: 0.38, tall: 21, tail: 52, tongue: 2.5, alpha: 0.8 } as const;
