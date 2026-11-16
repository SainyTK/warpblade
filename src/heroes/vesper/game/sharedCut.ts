import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { hero } from "../../../game/state";

/** a shared action may cut a woven ability once it has left her hands; the stitch runs out and brings her back first */
export function vesperMayAct(): boolean {
  switch (hero.state) {
    case "weave":
      return hero.hitDone;
    case "stitch":
      return false;
    default:
      return isFree() || blowsDone();
  }
}

/** through a woven ability and the stitch a shared press waits for the moment it may cut them or the stitch settles */
export const vesperHoldsPresses = (): boolean => hero.state === "weave" || hero.state === "stitch";
