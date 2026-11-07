import type { SkillLevel } from "../../../../types/skill";

/** a skill's numbers, read by its code through `skillValues` */
export type Values = Readonly<Record<string, number>>;
/** one level up: its card line and the numbers it changes */
export type Step = readonly [text: string, change: Values];

/** the eight rows of a skill, each the whole state at its level: every step's numbers laid over the row before */
export function grow(start: Values, steps: readonly Step[]): SkillLevel[] {
  let now = start;
  return steps.map(([text, change]) => {
    now = { ...now, ...change };
    return { text, values: now };
  });
}

/** an evolution's row: the level 8 numbers with the evolution's laid over them */
export function evolved(levels: readonly SkillLevel[], text: string, change: Values): SkillLevel {
  return { text, values: { ...levels[levels.length - 1].values, ...change } };
}
