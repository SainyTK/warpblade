import { ORRIN_JUMP_RISE } from "../../../constants/orrin/motion";
import { GROUND } from "../../../constants/stage";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { inRecovery } from "./string";

/** Up: one light jump from the floor; Down held drops through a ledge. No jump in the air: the hook is his air move. */
export function pressJump(): boolean {
  const h = hero;
  if ((!isFree() && !inRecovery()) || !h.ground) return false;
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  lift(ORRIN_JUMP_RISE, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 4);
  emitSkillEvent({ type: "jump", air: false });
  return true;
}
