import { GROUND } from "../../../constants/stage";
import { TALLIS_JUMP_RISE } from "../../../constants/tallis/motion";
import { sfx } from "../../../services/audio";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { tallis } from "./memory";
import { inRecovery } from "./string";
import { endVeil } from "./veil";

/** Night Leap: one more jump in the air while veiled or just after a rise; without its keeping level it ends the Veil */
function nightLeap(): boolean {
  const v = skillValues("t_nightLeap");
  if (!v.leaps || tallis.leaps <= 0 || (!tallis.veil && tallis.leapOpen <= 0)) return false;
  tallis.leaps--;
  tallis.afterLeap = true;
  if (tallis.veil && !v.keep) endVeil("leap");
  hero.vy = 0;
  lift(v.rise, true);
  setState("jump");
  sfx.doubleJump();
  emitSkillEvent({ type: "jump", air: true });
  return true;
}

/** Up: one jump of 58 px from the floor, also out of a blow's recovery; Down held drops through a ledge */
export function pressJump(): boolean {
  const h = hero;
  if (!isFree() && !inRecovery()) return false;
  if (!h.ground) return nightLeap();
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  lift(TALLIS_JUMP_RISE, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 3);
  emitSkillEvent({ type: "jump", air: false });
  return true;
}
