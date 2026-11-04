import type { YsraPart } from "../part";

/** I: call the selected rite with Heat. Placeholder: does nothing. */
export function pressRite(): boolean {
  return true;
}
/** O: select the next learned rite. Placeholder. */
export function cycleRite(): boolean {
  return false;
}
/** Heat, 0 to HEAT.max */
export function heat(): number {
  return 0;
}

export const PYRE_PART: YsraPart = {};
