import { WARP } from "../../constants/combat";
import { hero } from "../state";
import { isFree } from "./actions";
import { blowsDone, endCombo } from "./combo";
import { kit } from "./kits";

/**
 * Whether a shared action (warp, guard, dodge, ability, ultimate) may start now, cutting what the hero is doing: the
 * warp's arrival blow once it has struck, else the kit's own rule, or by default when the hero is free or the current
 * blow of the shared string has landed.
 */
export function maySharedAct(): boolean {
  if (hero.state === "warpStrike") return hero.st >= WARP.cut;
  const own = kit().mayAct;
  return own ? own() : isFree() || blowsDone();
}

/** a shared action starts: the shared string ends and the kit ends its own state */
export function cutForSharedAction(): void {
  hero.move = null;
  endCombo(false);
  kit().cutForAction?.();
}
