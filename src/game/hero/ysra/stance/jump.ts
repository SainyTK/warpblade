import { GROUND } from "../../../../constants/stage";
import { YSRA_JUMP_RISE } from "../../../../constants/ysra/stance";
import { isHeld } from "../../../input";
import { hero } from "../../../state";
import { dust } from "../../../world";
import { isFree, setState } from "../../actions";
import { blowsDone, endMove } from "../../combo";
import { lift } from "../../lift";

/** Up: one heavy jump, lower than Kael's, out of a free state or a blow's follow-through; Down held drops through a ledge.
 *  There is no jump in the air, whatever she has learned. */
export function pressJump(): boolean {
  const h = hero;
  if (blowsDone()) endMove();
  if (!isFree() || !h.ground) return false;
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  lift(YSRA_JUMP_RISE, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 6);
  return true;
}
