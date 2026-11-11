import { WALK_LOAD } from "../../../constants/hulda/motion";
import { clamp } from "../../../utils/math";
import { isHeld } from "../../input";
import { hero } from "../../state";
import { inFreeState } from "../actions";
import { hulda } from "./memory";

/** count how long she has been pushed while free; letting go, or any action, starts the load over */
export function tickPush(dt: number): void {
  const pushed = isHeld("left") !== isHeld("right");
  hulda.push = pushed && inFreeState() ? hulda.push + dt : 0;
}

/** on the floor her walk loads first, then comes up to speed; in the air she steers as any hero */
export function huldaWalkSpeed(speed: number): number {
  if (!hero.ground) return speed;
  return speed * clamp((hulda.push - WALK_LOAD.load) / WALK_LOAD.ramp);
}
