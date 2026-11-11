import { frame } from "../hero";

/**
 * L on the floor: the hook bites the floor behind him and yanks him back. He throws the hook for `load` seconds
 * before the yank, travels for `time`, and skids to a stop over `settle`, which a blow, a jump, the hook or another
 * Backline may cut short.
 */
export const BACKLINE = {
  cost: 16,
  distance: 48,
  /** the floor point sits this far behind where he started */
  bite: 50,
  load: frame(3),
  time: 0.2,
  settle: frame(6),
  cooldown: 0.35,
} as const;
