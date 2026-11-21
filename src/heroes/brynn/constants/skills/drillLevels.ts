import type { SkillLevel } from "../../../../types/skill";
import { type LevelStep, levelRows } from "../../../../utils/skillRows";

export interface DrillStep {
  text: string;
  drill: Readonly<Record<string, number>>;
}

export const drillValues = (drill: Readonly<Record<string, number>>): Record<string, number> =>
  Object.fromEntries(Object.entries(drill).map(([key, value]) => [`drill.${key}`, value]));

export const drillLevels = (native: readonly LevelStep[], drill: readonly DrillStep[]): SkillLevel[] =>
  levelRows(
    drill.map((step, i) => ({
      text: step.text,
      values: { ...native[i]?.values, ...drillValues(step.drill) },
      stats: native[i]?.stats,
    })),
  );
