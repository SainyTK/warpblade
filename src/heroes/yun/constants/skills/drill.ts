import type { SkillLevel } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";

export interface DrillStep {
  text: string;
  drill: Readonly<Record<string, number>>;
}

export const drillValues = (drill: Readonly<Record<string, number>>): Record<string, number> =>
  Object.fromEntries(Object.entries(drill).map(([key, value]) => [`drill.${key}`, value]));

export function onDrill(native: readonly SkillLevel[], steps: readonly DrillStep[]): SkillLevel[] {
  let drill: Record<string, number> = {};
  return native.map((row, i) => {
    drill = { ...drill, ...steps[i].drill };
    return { ...row, text: steps[i].text, values: { ...row.values, ...drillValues(drill) } };
  });
}

export const drillEvolved = (
  top: SkillLevel,
  native: SkillLevel,
  text: string,
  drill: Readonly<Record<string, number>>,
): SkillLevel => evolvedRow(top, text, { ...native.values, ...drillValues(drill) });
