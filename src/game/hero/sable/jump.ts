import { SABLE_JUMP_RISE } from "../../../constants/sable/moves";
import { GROUND } from "../../../constants/stage";
import { isHeld } from "../../input";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { sable } from "./memory";

/** she may jump now: free, or out of a shot's recovery */
const canJump = (): boolean => isFree() || (hero.state === "shoot" && sable.fired);

/** Up: one light jump (higher with Featherdraw, and once more in the air at its level 7); Down held drops through a
 *  ledge */
export function pressJump(): boolean {
  const h = hero;
  if (!canJump()) return false;
  const v = skillValues("s_featherdraw");
  const rise = SABLE_JUMP_RISE * (v.rise ?? 1);
  if (!h.ground) {
    if (sable.airJumps + 1 >= (v.jumps ?? 1)) return false;
    sable.airJumps++;
    sable.airShots = 0;
    h.vy = 0;
    lift(rise * 0.8, true);
    setState("jump");
    emitSkillEvent({ type: "jump", air: true });
    return true;
  }
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  lift(rise, true);
  h.jumps = 1;
  sable.string = 0;
  setState("jump");
  dust(h.x, h.y, 5);
  emitSkillEvent({ type: "jump", air: false });
  return true;
}

/** a double tap toward a side: she runs while the side is held */
export function doubleTapRun(dir: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}
