import { hero } from "../../state";
import { cutForSharedAction, maySharedAct } from "../sharedCut";

/**
 * An ability on I may start now: when a shared action may cut in (free, a blow landed, the warp's blow struck) and, for
 * the floor abilities, with her feet on the floor. Passing the gate ends what she was doing.
 */
export function castGate(floor = true): boolean {
  if (!maySharedAct() || (floor && !hero.ground)) return false;
  cutForSharedAction();
  return true;
}
