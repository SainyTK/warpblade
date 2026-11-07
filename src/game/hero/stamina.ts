import { STAMINA } from "../../constants/combat";
import { sfx } from "../../services/audio";
import type { HeroState } from "../../types/hero";
import { skillValues } from "../skills/query";
import { hero, progress } from "../state";

/** states in which stamina comes back at the slower attacking rate */
const BUSY: ReadonlySet<HeroState> = new Set<HeroState>(["move", "cast", "throw", "warpStrike", "charge", "ultimate"]);

/** stamina one dash costs; Phantom Rush halves it */
const dashCost = (): number => STAMINA.dashCost * (skillValues("k_passing").staminaCost ?? 1);

export const canPayDash = (): boolean => hero.stamina >= dashCost();

/** pay for one dash; the bar waits a moment before it refills */
export function spendDashStamina(): void {
  hero.stamina = Math.max(0, hero.stamina - dashCost());
  hero.staminaWait = STAMINA.delay;
}

/** a dash the bar could not pay for: the bar flashes and a dull note plays, once per refusal */
export function refuseDash(): void {
  if (hero.staminaFlash > 0) return;
  hero.staminaFlash = STAMINA.emptyFlash;
  sfx.tired();
}

export function refundStamina(amount: number): void {
  hero.stamina = Math.min(progress.stats.stamina, hero.stamina + amount);
}

/** stamina waits while Kael dashes and just after, then comes back, slower while he attacks */
export function regenStamina(dt: number): void {
  const h = hero;
  h.staminaFlash = Math.max(0, h.staminaFlash - dt);
  if (h.state === "dash") return;
  if (h.staminaWait > 0) {
    h.staminaWait -= dt;
    return;
  }
  const rate = BUSY.has(h.state) ? STAMINA.regenBusy : STAMINA.regen;
  refundStamina(rate * dt);
}
