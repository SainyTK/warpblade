import { HEARTHFIRE } from "../../../../constants/ysra/heat";
import { RITES } from "../../../../constants/ysra/rites";
import type { RiteDef } from "../../../../types/ysra/pyre";
import { hasPerk } from "../../../progress";

/** the selected rite, an index into RITES */
let selected = 0;

export const knowsRite = (r: RiteDef): boolean => hasPerk(r.perk);
/** the selected rite, moved onto a learned one when it is not; null before any is learned */
export function selectedRite(): RiteDef | null {
  if (!knowsRite(RITES[selected])) selectNextRite();
  return knowsRite(RITES[selected]) ? RITES[selected] : null;
}
export const isSelected = (r: RiteDef): boolean => selectedRite() === r;

/** move the selection to the next learned rite; true when it moved */
export function selectNextRite(): boolean {
  for (let step = 1; step <= RITES.length; step++) {
    const i = (selected + step) % RITES.length;
    if (!knowsRite(RITES[i])) continue;
    const moved = i !== selected;
    selected = i;
    return moved;
  }
  return false;
}

/** Heat a rite spends now: Hearthfire cuts it */
export const riteCost = (r: RiteDef): number => r.cost * (hasPerk("hearthfire") ? HEARTHFIRE.cost : 1);

export function resetRiteChoice(): void {
  selected = 0;
}
