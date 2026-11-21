import type { SkillLevel } from "../../../../types/skill";

export interface DrillStep {
  text: string;
  drill: Readonly<Record<string, number>>;
}

export const drillValues = (drill: Readonly<Record<string, number>>): Record<string, number> =>
  Object.fromEntries(Object.entries(drill).map(([key, value]) => [`drill.${key}`, value]));

export function onDrill(native: readonly SkillLevel[], steps: readonly DrillStep[]): SkillLevel[] {
  let carried: Record<string, number> = {};
  return native.map((row, i) => {
    carried = { ...carried, ...drillValues(steps[i].drill) };
    return { ...row, text: steps[i].text, values: { ...row.values, ...carried } };
  });
}
