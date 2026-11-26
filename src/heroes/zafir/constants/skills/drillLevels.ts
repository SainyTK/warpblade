import type { SkillLevel } from "../../../../types/skill";
import { levelRows } from "../../../../utils/skillRows";

export type Numbers = Readonly<Record<string, number>>;

export interface DrillStep {
  text: string;
  drill?: Numbers;
}

export const drillValues = (drill: Numbers): Record<string, number> =>
  Object.fromEntries(Object.entries(drill).map(([key, value]) => [`drill.${key}`, value]));

export const drillLevels = (native: readonly Numbers[], drill: readonly DrillStep[]): SkillLevel[] =>
  levelRows(drill.map((step, i) => ({ text: step.text, values: { ...native[i], ...drillValues(step.drill ?? {}) } })));
