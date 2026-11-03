import { DENY_FLASH } from "../../constants/combat";
import { sfx } from "../../services/audio";
import type { DenyReason } from "../../types/hero";
import { hero } from "../state";

/** a refused press: a dull tick, and the HUD flashes what was missing */
export function deny(reason: DenyReason): void {
  hero.denied[reason] = DENY_FLASH;
  sfx.denied();
}

/** count down the HUD flashes of refused presses */
export function tickDenied(dt: number): void {
  const d = hero.denied;
  d.cast = Math.max(0, d.cast - dt);
  d.warp = Math.max(0, d.warp - dt);
  d.mp = Math.max(0, d.mp - dt);
  d.ult = Math.max(0, d.ult - dt);
}
