import type { Box } from "../../../types/world";

/**
 * Rose Tempest: a storm of `thrusts` thrusts every `gap` seconds from `start`, each `storm` of the charge level's power
 * on the foes in `box`, then at `lungeAt` a lunge of up to `travel` px, its streak striking every foe on her line out
 * to `reach` px for `lunge` of the level's power. The whole move lasts `dur` and nothing touches her in it.
 */
export const TEMPEST = {
  thrusts: 10,
  start: 0.08,
  gap: 0.05,
  storm: 0.05,
  box: [-2, -40, 64, 2] as Box,
  lungeAt: 0.62,
  travel: 96,
  speed: 520,
  lunge: 0.45,
  reach: [120, 170, 230, 340] as const,
  dur: 0.9,
} as const;
