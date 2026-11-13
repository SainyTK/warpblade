import { MUZZLE } from "../../../../constants/sable/bolt";
import { GRAPPLE_LOOK } from "../../../../constants/sable/look";
import { hero } from "../../../state";
import { drawGrappleCord } from "./grapple";

/** seconds the cord takes to pay out taut behind the grapple bolt */
const PAY_OUT = 0.15;

/** while the grapple bolt flies, the cord from her crossbow to its tail */
export function drawCord(): void {
  const bolt = hero.sword;
  if (hero.state !== "throwWait" || !bolt) return;
  const x0 = hero.x + hero.face * MUZZLE.level.x;
  const y0 = hero.y + MUZZLE.level.y;
  const d = Math.hypot(bolt.x - x0, bolt.y - y0);
  if (d <= GRAPPLE_LOOK.length) return;
  const k = (d - GRAPPLE_LOOK.length) / d;
  drawGrappleCord(x0, y0, x0 + (bolt.x - x0) * k, y0 + (bolt.y - y0) * k, Math.min(1, hero.st / PAY_OUT));
}
