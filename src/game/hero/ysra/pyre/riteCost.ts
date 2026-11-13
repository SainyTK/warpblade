import { RITES } from "../../../../constants/ysra/rites";
import type { RiteDef } from "../../../../types/ysra/pyre";
import { skillLevel, skillValues } from "../../../skills/query";

/** Flare and Cinder Lash are in her base kit; the other rites come with their skills */
export const knowsRite = (r: RiteDef): boolean => !r.skill || skillLevel(r.skill) > 0;

/** Heat a rite costs now: its skill's level sets it, and Kindling cuts it; Overheat's is the least it needs */
export function riteCost(r: RiteDef): number {
  const own = r.skill ? (skillValues(r.skill).cost ?? skillValues(r.skill).least ?? r.cost) : r.cost;
  return own * (skillValues("y_kindling").cost ?? 1);
}

/** a rite by its id */
export const riteById = (id: string): RiteDef => RITES.find((r) => r.id === id) ?? RITES[0];
