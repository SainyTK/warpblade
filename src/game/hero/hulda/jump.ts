import { GROUND } from "../../../constants/stage";
import { sfx } from "../../../services/audio";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { takeOff } from "../takeoff";
import { hopRise, jumpRise, mayHop } from "./anvilDrop";
import { hulda } from "./memory";

/** Anvil Drop's hop: one lower jump in the air, from her own jump */
function hop(): boolean {
  if (!mayHop()) return false;
  hulda.hopped = true;
  hero.vy = 0;
  lift(hopRise(), true);
  setState("jump");
  sfx.doubleJump();
  emitSkillEvent({ type: "jump", air: true });
  return true;
}

/** Up: she sinks into her knees for a low, heavy jump from the floor; Down held drops through a ledge. In the air,
 *  only Anvil Drop's hop. */
export function pressJump(): boolean {
  const h = hero;
  if (!isFree()) return false;
  if (!h.ground) return hop();
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  takeOff(() => {
    lift(jumpRise(), true);
    h.jumps = 1;
    hulda.leapt = true;
    setState("jump");
    dust(h.x, h.y, 6);
    emitSkillEvent({ type: "jump", air: false });
  });
  return true;
}
