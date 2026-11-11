import { HERO_MOVE } from "../../../constants/combat";
import { GROUND } from "../../../constants/stage";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { takeOff } from "../takeoff";
import { airLeap, openLeaps } from "./leap";
import { inRecovery } from "./string";

/** Up: one jump of the shared height from the floor, also out of a blow's recovery; Down held drops through a ledge */
export function pressJump(): boolean {
  const h = hero;
  if (!isFree() && !inRecovery()) return false;
  if (!h.ground) return airLeap();
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  takeOff(() => {
    lift(HERO_MOVE.jumpRise, true);
    h.jumps = 1;
    openLeaps();
    setState("jump");
    dust(h.x, h.y, 3);
    emitSkillEvent({ type: "jump", air: false });
  });
  return true;
}
