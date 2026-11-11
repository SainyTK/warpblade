import { MIREL_SETTLE } from "../../../constants/clips/mirel/settle";
import { MIREL_JUMP_RISE } from "../../../constants/mirel/motion";
import { GROUND } from "../../../constants/stage";
import { isHeld } from "../../input";
import { objectMemory, rememberPerSeat } from "../../seatMemory";
import { emitSkillEvent } from "../../skills/events";
import { hero } from "../../state";
import { dust } from "../../world";
import { isFree, setState } from "../actions";
import { lift } from "../lift";
import { inRecovery } from "./string";

/** seconds of the push-off still to run before she leaves the floor; 0 when none is under way */
const takeoff = { left: 0 };
rememberPerSeat(objectMemory(takeoff, true));

/** she leaves the floor */
function leap(): void {
  const h = hero;
  takeoff.left = 0;
  lift(MIREL_JUMP_RISE, true);
  h.jumps = 1;
  setState("jump");
  dust(h.x, h.y, 4);
  emitSkillEvent({ type: "jump", air: false });
}

/**
 * Up: one jump from the floor; Down held drops through a ledge. No jump in the air: holding Up there hovers. Standing or
 * walking she sinks into a short push-off first; out of a blow's recovery or a cast she leaps at once.
 */
export function pressJump(): boolean {
  const h = hero;
  if ((!isFree() && !inRecovery() && h.state !== "stillCast") || !h.ground) return false;
  if (isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
    return true;
  }
  if (h.state !== "idle" && h.state !== "walk") {
    leap();
    return true;
  }
  if (takeoff.left <= 0) takeoff.left = MIREL_SETTLE.takeoff.dur;
  return true;
}

/** the push-off runs out into the leap; anything else she starts, or a fall, ends it */
export function tickTakeoff(dt: number): void {
  if (takeoff.left <= 0) return;
  const h = hero;
  if (!h.ground || (h.state !== "idle" && h.state !== "walk")) {
    takeoff.left = 0;
    return;
  }
  takeoff.left -= dt;
  if (takeoff.left <= 0) leap();
}

/** seconds into the push-off under way, or -1 when there is none */
export const takeoffTime = (): number => (takeoff.left > 0 ? MIREL_SETTLE.takeoff.dur - takeoff.left : -1);

/** a fresh run: no push-off under way */
export function clearTakeoff(): void {
  takeoff.left = 0;
}
