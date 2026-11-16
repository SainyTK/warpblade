import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { hero } from "../../../game/state";
import { shotLanded } from "./abilities";
import { calder } from "./state";

/** a shared action may cut a shot once its rounds are out and its hop has landed, and the reload once the rounds are in;
 *  Cylinder Break holds */
export function calderMayAct(): boolean {
  switch (hero.state) {
    case "shot":
      return shotLanded();
    case "reload":
      return hero.hitDone;
    default:
      return isFree() || blowsDone();
  }
}

/** through a shot and the reload a shared press waits for the moment it may cut them */
export const calderHoldsPresses = (): boolean => hero.state === "shot" || hero.state === "reload";

/** a shared action starts: a cut shot leaves no recoil hop behind */
export function calderCutForAction(): void {
  calder.hopping = false;
}
