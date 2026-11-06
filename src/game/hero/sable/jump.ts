import { SABLE_JUMP_RISE } from "../../../constants/sable/moves";
import { GROUND } from "../../../constants/stage";
import { isHeld } from "../../input";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";

/** Up: one light jump out of a free state; Down held drops through a ledge. No jump in the air. */
export function pressJump(): boolean {
  const h = hero;
  if (!isFree() || !h.ground) return false;
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  lift(SABLE_JUMP_RISE, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 5);
  return true;
}

/** a double tap toward a side: she runs while the side is held */
export function doubleTapRun(dir: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}
