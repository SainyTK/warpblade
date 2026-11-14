import { isFree, settle } from "../../../game/hero/actions";
import { pressAttack } from "../../../game/hero/combo";
import { jump } from "../../../game/hero/jump";
import { use } from "../../../game/input";
import { hero } from "../../../game/state";
import { BEATS } from "../constants/timing";

/** a double tap starts a run */
function doubleTap(dir: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}

/** J in the air out of Moonrise once its wave is out: the rise ends and the falling draw starts at once */
function fallFromRise(): boolean {
  if (hero.state !== "rise" || hero.st < BEATS.rise.hit || hero.ground) return false;
  settle();
  return pressAttack();
}

/** Saya's own presses: jump, a double tap to run, and J for the string, the falling draw, or the draw out of Moonrise */
export function readActions(_dir: number, tap: number): void {
  use("up", jump);
  if (tap) doubleTap(tap);
  use("attack", fallFromRise);
  use("attack", pressAttack);
}
