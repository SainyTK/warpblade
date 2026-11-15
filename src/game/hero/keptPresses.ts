import { KEPT_DURING_MOVE, SHARED_CUT_PRESSES } from "../../constants/input";
import type { InputAction } from "../../types/input";
import { hero } from "../state";
import { kit } from "./kits";

/** the presses that wait past the buffer right now: a jump through a whole move, and the shared actions while the kit's
 *  own state will let them cut it soon */
export function keptPresses(): readonly InputAction[] {
  if (hero.state === "move") return KEPT_DURING_MOVE;
  if (kit().holdsSharedPresses?.()) return SHARED_CUT_PRESSES;
  return [];
}
