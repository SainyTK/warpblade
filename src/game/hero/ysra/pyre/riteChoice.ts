import { HEARTHFIRE } from "../../../../constants/ysra/heat";
import { RITES } from "../../../../constants/ysra/rites";
import type { RiteDef } from "../../../../types/ysra/pyre";
import { hasPerk } from "../../../progress";
import { createRotation } from "../../../skills/rotation";

const riteById = (id: string): RiteDef | undefined => RITES.find((r) => r.id === id);

/** Flare is in her base kit; the other rites come with their skills */
export const knowsRite = (r: RiteDef): boolean => r.id === "flare" || hasPerk(r.perk);

/** the rites on I, turned by O */
const rotation = createRotation(
  RITES.map((r) => r.id),
  (id) => {
    const rite = riteById(id);
    return !!rite && knowsRite(rite);
  },
);

/** the selected rite, moved onto a learned one when it is not; null before any is learned */
export function selectedRite(): RiteDef | null {
  const id = rotation.selected();
  return id ? (riteById(id) ?? null) : null;
}

/** move the selection to the next learned rite; true when it moved */
export const selectNextRite = (): boolean => rotation.next();

/** Heat a rite spends now: Hearthfire cuts it */
export const riteCost = (r: RiteDef): number => r.cost * (hasPerk("hearthfire") ? HEARTHFIRE.cost : 1);

export const resetRiteChoice = (): void => rotation.reset();
