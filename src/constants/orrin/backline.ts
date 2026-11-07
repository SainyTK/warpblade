/** L on the floor: the hook bites the floor behind him and yanks him back */
export const BACKLINE = {
  cost: 16,
  distance: 48,
  /** the floor point sits this far behind where he started */
  bite: 50,
  time: 0.2,
  cooldown: 0.35,
} as const;
