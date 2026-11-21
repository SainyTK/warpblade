import type { SkillLevel } from "../../../../types/skill";

export interface DrillStep {
  text: string;
  drill?: Readonly<Record<string, number>>;
}

export const drillValues = (drill: Readonly<Record<string, number>>): Record<string, number> =>
  Object.fromEntries(Object.entries(drill).map(([key, value]) => [`drill.${key}`, value]));

export function drillRows(native: readonly SkillLevel[], steps: readonly DrillStep[]): SkillLevel[] {
  let drill: Record<string, number> = {};
  return native.map((row, i) => {
    drill = { ...drill, ...steps[i]?.drill };
    return { ...row, text: steps[i]?.text ?? row.text, values: { ...row.values, ...drillValues(drill) } };
  });
}
