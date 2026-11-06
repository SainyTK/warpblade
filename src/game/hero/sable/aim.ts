import { AIM_ANGLE, MUZZLE } from "../../../constants/sable/bolt";
import type { SableAim } from "../../../types/sable";
import { isHeld } from "../../input";
import { hero } from "../../state";

/** the aim the held keys ask for: Up angles the shot up, Down kneels on the floor or slants it down in the air */
export function heldAim(): SableAim {
  if (isHeld("up")) return "up";
  if (isHeld("down")) return "low";
  return "level";
}

/** where a bolt leaves the crossbow and at what angle, for an aim, in world pixels and radians */
export function muzzle(aim: SableAim): { x: number; y: number; angle: number } {
  const air = aim === "low" && !hero.ground;
  const m = air ? MUZZLE.air : MUZZLE[aim];
  const a = air ? AIM_ANGLE.air : AIM_ANGLE[aim];
  const angle = hero.face > 0 ? a : Math.PI - a;
  return { x: hero.x + hero.face * m.x, y: hero.y + m.y, angle };
}
