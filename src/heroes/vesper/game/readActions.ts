import { isFree } from "../../../game/hero/actions";
import { pressAttack } from "../../../game/hero/combo";
import { jump } from "../../../game/hero/jump";
import { use } from "../../../game/input";
import { hero } from "../../../game/state";

/** a double tap starts a run */
function doubleTap(dir: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}

/** Vesper's own presses: jump, a double tap to run, and J tapped for the string on the floor or in the air. The shared
 *  moveset (warp, guard, dodge, abilities, ultimate) is read by updateHero. */
export function readActions(_dir: number, tap: number): void {
  use("up", jump);
  if (tap) doubleTap(tap);
  use("attack", pressAttack);
}
