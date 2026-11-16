import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { hero } from "../../../game/state";
import { rushEnded } from "./abilities/rush";
import { aldric } from "./state";

/** a shared action may cut his own states once they have landed: Shield Rush once its travel is over, a call once the
 *  light has gone */
export function aldricMayAct(): boolean {
  switch (hero.state) {
    case "rush":
      return rushEnded();
    case "call":
      return hero.hitDone;
    default:
      return isFree() || blowsDone();
  }
}

/** through Shield Rush and a call a shared press waits for the moment it may cut them */
export const aldricHoldsPresses = (): boolean => hero.state === "rush" || hero.state === "call";

/** a shared action starts: the Guard bash is forgotten, and a cut rush does not slide on */
export function aldricCutForAction(): void {
  aldric.bashT = -1;
  if (hero.state === "rush" && hero.ground) hero.vx = 0;
}
