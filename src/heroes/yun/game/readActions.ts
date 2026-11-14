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

/** Yun's own presses: jump, a double tap to run and J tapped for the string; the shared moveset reads the rest */
export function readActions(_dir: number, tap: number): void {
  use("up", jump);
  if (tap) doubleTap(tap);
  use("attack", pressAttack);
}
