import type { StanceMemory } from "../../../../types/ysra/stance";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";

/** the stance's state when nothing is skidding, primed or shouldered */
const fresh = () => ({
  landed: false,
  face: 1,
  faceBefore: 1,
  turned: Number.POSITIVE_INFINITY,
  counter: 0,
  walked: 0,
  carried: [],
});

/** the one owner of what Ysra's stance part remembers */
export const stance: StanceMemory = { ...fresh(), shouldered: new Map() };

/** a fresh run: nothing skidding, primed or shouldered */
export function resetStance(): void {
  Object.assign(stance, fresh());
  stance.shouldered.clear();
}
rememberPerSeat(objectMemory(stance));
