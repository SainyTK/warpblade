import { isFree } from "../../../game/hero/actions";
import { pressAttack } from "../../../game/hero/combo";
import { jump } from "../../../game/hero/jump";
import { use } from "../../../game/input";
import { hero } from "../../../game/state";
import { recallBlade } from "./crescent";

/** a double tap starts a run */
function doubleTap(dir: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}

/** Zafir's own presses: jump, a double tap to run, J tapped or held calling the thrown scimitar back into a catch cut
 *  while it flies, and otherwise J tapped for the spinning string. The shared moveset is read by updateHero. */
export function readActions(_dir: number, tap: number): void {
  use("up", jump);
  if (tap) doubleTap(tap);
  use("attack", recallBlade);
  use("warp", recallBlade);
  use("attack", pressAttack);
}
