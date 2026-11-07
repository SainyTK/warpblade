/** Wrecking Haymaker's shapes: how fast minions fly up, how far the knock-down beside the struck foe reaches and how
 *  long it stuns, how fast the crack runs, and when the evolved spike lands its second impact. Damage lives in the
 *  skill's rows (src/constants/characters/hulda/skills/haymaker.ts). */
export const HAYMAKER_SKILL = {
  launch: -260,
  knockReach: 30,
  knockStun: 0.6,
  crackSpeed: 320,
  /** foes whose middle is within this height of the floor stand on the crack */
  crackHeight: 30,
  spikeDelay: 0.16,
} as const;
