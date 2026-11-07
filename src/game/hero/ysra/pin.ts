import { ENEMIES } from "../../../constants/enemies";
import type { Enemy } from "../../../types/enemy";
import { ignite } from "../../enemies/burn";
import { markFoe } from "../../enemies/skillStatus";
import { skillValues } from "../../skills/query";
import { game } from "../../state";
import { struckThisSwing } from "../../world";
import { createPinMark } from "./pinMark";

/** a pin: seconds it holds, the damage the pinned foe takes more, seconds it burns */
export interface Pin {
  time: number;
  taken: number;
  burn: number;
}

/** pin a foe to the floor: held still, unable to act while it is a small one, taking more damage from every source */
export function pinFoe(e: Enemy, pin: Pin): void {
  if (e.hp <= 0) return;
  const fresh = e.pinned <= 0;
  e.pinned = Math.max(e.pinned, pin.time);
  e.vx = 0;
  if (ENEMIES[e.type].launchable) e.stun = Math.max(e.stun, pin.time);
  if (pin.taken > 0) markFoe(e, "pin", pin.time, pin.taken);
  if (pin.burn > 0) ignite(e, pin.burn);
  if (fresh) game.fx.push(createPinMark(e));
}

/** Impale's pin as its level sets it, or none when it is not held */
export function impalePin(): Pin | null {
  const v = skillValues("y_impale");
  if (!v.pin) return null;
  return { time: v.pin, taken: v.taken, burn: v.ignite };
}

/** Impale: every foe the blow just struck is pinned */
export function pinStruck(): void {
  const pin = impalePin();
  if (!pin) return;
  for (const e of game.enemies) if (struckThisSwing(e)) pinFoe(e, pin);
}
