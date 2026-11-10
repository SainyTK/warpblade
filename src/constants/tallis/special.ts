/** U: Gloaming, the scene goes dark and he appears behind foe after foe with a slash each */
export const GLOAMING = {
  /** the crouch with the knives crossed, while the scene darkens */
  windup: 0.3,
  /** seconds on each foe, and how far behind it he appears */
  each: 0.09,
  behind: 12,
  /** foes struck by charge level, nearest first */
  counts: [1, 2, 4, 8],
  /** each stab: the level's power times this share of attack damage plus ability power */
  share: 0.25,
  /** how much the scene darkens, and the seconds the light takes to come back */
  dark: 0.45,
  light: 0.25,
  /** the shake on the return */
  shake: 4,
} as const;
