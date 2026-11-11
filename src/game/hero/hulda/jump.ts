import { HULDA_JUMP_RISE, JUMP_LOAD } from "../../../constants/hulda/motion";
import { GROUND } from "../../../constants/stage";
import { isHeld } from "../../input";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";

/** Up: she sinks into her knees for a low, heavy jump from the floor; Down held drops through a ledge. No jump in the
 *  air. */
export function pressJump(): boolean {
  const h = hero;
  if (!isFree() || !h.ground) return false;
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  setState("jumpLoad");
  return true;
}

/** the knees load, then she leaves the floor in a burst of dust */
export function runJumpLoad(): void {
  const h = hero;
  if (h.st < JUMP_LOAD) return;
  lift(HULDA_JUMP_RISE, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 6);
}
