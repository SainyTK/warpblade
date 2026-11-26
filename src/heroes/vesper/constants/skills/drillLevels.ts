import type { SkillLevel } from "../../../../types/skill";
import type { Stats } from "../../../../types/stats";
import { levelRows } from "../../../../utils/skillRows";

export interface NativeStep {
  values?: Readonly<Record<string, number>>;
  stats?: Partial<Stats>;
}

export interface DrillStep {
  text: string;
  drill: Readonly<Record<string, number>>;
}

export const drillValues = (drill: Readonly<Record<string, number>>): Record<string, number> =>
  Object.fromEntries(Object.entries(drill).map(([key, value]) => [`drill.${key}`, value]));

export const drillLevels = (native: readonly NativeStep[], drill: readonly DrillStep[]): SkillLevel[] =>
  levelRows(
    drill.map((step, i) => ({
      text: step.text,
      values: { ...native[i]?.values, ...drillValues(step.drill) },
      stats: native[i]?.stats,
    })),
  );
