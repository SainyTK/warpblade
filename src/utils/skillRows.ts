import type { SkillLevel } from "../types/skill";
import type { Stats } from "../types/stats";

/** what one level changes: its card line, the numbers that change, and the hero's stats at that level when it has any */
export interface LevelStep {
  text: string;
  values?: Readonly<Record<string, number>>;
  stats?: Partial<Stats>;
}

/**
 * The eight rows of a skill from what each level changes: every row carries the numbers of the rows before it, so a
 * row is the skill's whole state at that level, as `SkillLevel` asks. Stats carry over the same way.
 */
export function levelRows(steps: readonly LevelStep[]): SkillLevel[] {
  let values: Record<string, number> = {};
  let stats: Partial<Stats> | undefined;
  return steps.map((step) => {
    values = { ...values, ...step.values };
    stats = step.stats ?? stats;
    return { text: step.text, values, stats };
  });
}

/** the evolution's row: the level 8 row with its changes on top */
export function evolvedRow(top: SkillLevel, text: string, values: Readonly<Record<string, number>>): SkillLevel {
  return { text, values: { ...top.values, ...values }, stats: top.stats };
}
