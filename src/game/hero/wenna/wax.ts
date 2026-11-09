import { DENY_FLASH } from "../../../constants/combat";
import { WAX_BAR } from "../../../constants/wenna/wax";
import { sfx } from "../../../services/audio";
import { skillValues } from "../../skills/query";
import { wenna } from "./memory";

/** the most Wax she can carry: Deep Tallow adds to it */
export const waxMax = (): number => WAX_BAR.max + (skillValues("w_tallow").wax ?? 0);

/** the share of the WX bar full */
export const waxShare = (): number => Math.max(0, Math.min(1, wenna.wax / waxMax()));

export const hasWax = (amount: number): boolean => wenna.wax >= amount - 1e-6;

export function spendWax(amount: number): void {
  wenna.wax = Math.max(0, wenna.wax - amount);
}

export function gainWax(amount: number): void {
  wenna.wax = Math.min(waxMax(), wenna.wax + amount);
}

/** the trickle that keeps her from ever being stuck; Deep Tallow raises it */
export function trickleWax(dt: number): void {
  wenna.waxFlash = Math.max(0, wenna.waxFlash - dt);
  gainWax(WAX_BAR.trickle * (1 + (skillValues("w_tallow").trickle ?? 0)) * dt);
}

/** a press the WX bar could not pay for: the shared refusal tick, and the bar flashes */
export function refuseWax(): void {
  wenna.waxFlash = DENY_FLASH;
  sfx.denied();
}
