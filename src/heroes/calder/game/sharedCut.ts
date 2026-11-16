import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { travelEnded } from "../../../game/hero/travelEnd";
import { hero } from "../../../game/state";
import { shotFired } from "./abilities";
import { calder } from "./state";

/** a shared action may cut a shot once its rounds are out, Scatter Blast's hop included, and the reload once the rounds
 *  are in; Cylinder Break holds */
export function calderMayAct(): boolean {
  switch (hero.state) {
    case "shot":
      return shotFired();
    case "reload":
      return hero.hitDone;
    default:
      return isFree() || blowsDone();
  }
}

/** through a shot and the reload a shared press waits for the moment it may cut them */
export const calderHoldsPresses = (): boolean => hero.state === "shot" || hero.state === "reload";

/** a shared action starts: a recoil hop it cuts ends there as a travel move, as if it had landed */
export function calderCutForAction(): void {
  if (!calder.hopping) return;
  calder.hopping = false;
  travelEnded();
}
