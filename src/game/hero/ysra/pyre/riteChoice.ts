import { HEARTHFIRE } from "../../../../constants/ysra/heat";
import { RITES } from "../../../../constants/ysra/rites";
import type { RiteDef } from "../../../../types/ysra/pyre";
import { hasPerk } from "../../../progress";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";

/** the selected rite, an index into RITES */
const choice = { selected: 0 };
rememberPerSeat(objectMemory(choice));

export const knowsRite = (r: RiteDef): boolean => hasPerk(r.perk);
/** the selected rite, moved onto a learned one when it is not; null before any is learned */
export function selectedRite(): RiteDef | null {
  if (!knowsRite(RITES[choice.selected])) selectNextRite();
  return knowsRite(RITES[choice.selected]) ? RITES[choice.selected] : null;
}
export const isSelected = (r: RiteDef): boolean => selectedRite() === r;

/** move the selection to the next learned rite; true when it moved */
export function selectNextRite(): boolean {
  for (let step = 1; step <= RITES.length; step++) {
    const i = (choice.selected + step) % RITES.length;
    if (!knowsRite(RITES[i])) continue;
    const moved = i !== choice.selected;
    choice.selected = i;
    return moved;
  }
  return false;
}

/** Heat a rite spends now: Hearthfire cuts it */
export const riteCost = (r: RiteDef): number => r.cost * (hasPerk("hearthfire") ? HEARTHFIRE.cost : 1);

export function resetRiteChoice(): void {
  choice.selected = 0;
}
