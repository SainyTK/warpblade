import { MAX_LEVEL, PICK_SCHEDULE, SKILL_SLOT_LEVELS } from "../constants/growth";

export const skillSlots = (level: number): number => SKILL_SLOT_LEVELS.filter((at) => level >= at).length;

export function picksAtLevel(level: number): number {
  if (level <= 1 || level > MAX_LEVEL) return 0;
  const regular = level <= PICK_SCHEDULE.everyLevelTo || level % PICK_SCHEDULE.thenEvery === 0 ? 1 : 0;
  const milestone = (PICK_SCHEDULE.milestones as readonly number[]).includes(level) ? 1 : 0;
  return regular + milestone;
}

export function picksBetween(from: number, to: number): number {
  let picks = 0;
  for (let level = from + 1; level <= to; level++) picks += picksAtLevel(level);
  return picks;
}
