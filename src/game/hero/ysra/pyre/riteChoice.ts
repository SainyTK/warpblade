import { RITES } from "../../../../constants/ysra/rites";
import type { RiteDef } from "../../../../types/ysra/pyre";
import { skillLevel, skillValues } from "../../../skills/query";
import { createRotation } from "../../../skills/rotation";

const riteById = (id: string): RiteDef | undefined => RITES.find((r) => r.id === id);

/** Flare and Cinder Lash are in her base kit; the other rites come with their skills */
export const knowsRite = (r: RiteDef): boolean => !r.skill || skillLevel(r.skill) > 0;

/** the rites on I, turned by O */
const rotation = createRotation(
  RITES.map((r) => r.id),
  (id) => {
    const rite = riteById(id);
    return !!rite && knowsRite(rite);
  },
);

/** the selected rite, moved onto a known one when it is not */
export function selectedRite(): RiteDef | null {
  const id = rotation.selected();
  return id ? (riteById(id) ?? null) : null;
}

/** move the selection to the next known rite; true when it moved */
export const selectNextRite = (): boolean => rotation.next();

/** Heat a rite costs now: its skill's level sets it, and Kindling cuts it; Overheat's is the least it needs */
export function riteCost(r: RiteDef): number {
  const own = r.skill ? (skillValues(r.skill).cost ?? skillValues(r.skill).least ?? r.cost) : r.cost;
  return own * (skillValues("y_kindling").cost ?? 1);
}

export const resetRiteChoice = (): void => rotation.reset();
