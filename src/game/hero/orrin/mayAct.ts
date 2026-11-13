import { hero } from "../../state";
import { isFree } from "../actions";
import { orrin } from "./memory";
import { inRecovery } from "./recovery";
import { dropChain } from "./swing";
import { endWhirl } from "./whirlwall";

/**
 * The shared actions (warp, guard, dodge, ability, ultimate) may cut in: when he is free, in a flight, in a blow's
 * recovery, while Whirlwall spins, and once Anchor Pin's hook has struck. A swing, a hook in flight, a ledge pull and
 * the special run to their end.
 */
export function mayOrrinAct(): boolean {
  if (isFree()) return true;
  switch (hero.state) {
    case "fly":
    case "whirl":
      return true;
    case "lash":
      return inRecovery();
    case "pin":
      return hero.hitDone;
    default:
      return false;
  }
}

/** a shared action starts: the string's waiting press is dropped, a spinning Whirlwall falls, a held chain lets go */
export function cutOrrin(): void {
  orrin.queued = false;
  orrin.plumb = false;
  endWhirl();
  if (orrin.latch || orrin.flight) dropChain();
}
