import type { Enemy } from "../../types/enemy";
import { kit } from "../hero/kits";
import { game, hero } from "../state";

/**
 * The shared foe awareness rule. A hero is hidden while their kit says so (`HeroKit.hidden`, Tallis's Veil and shadow
 * pool); a foe is blind while its `blind` status runs (Smoke Knot). A minion or elite that cannot see the hero in play
 * neither turns toward them nor starts a wind-up at them; a mini boss still sees a hidden hero but turns slower, and the
 * Rift Warden ignores the rule. Anything that hides a hero or blinds a foe reuses these hooks.
 */
export const heroHidden = (): boolean => hero.state !== "dead" && (kit().hidden?.() ?? false);

/** whether a foe can see the hero in play: not while it is blind, and a minion not while the hero is hidden */
export function foeSees(e: Enemy): boolean {
  if (e.blind > 0) return false;
  return e.rank !== "minion" || !heroHidden();
}

/**
 * A blow at the hero from this x was only a foe brushing past while it walked on, unaware of them: a foe that cannot see
 * the hero does no harm by touch, so a hidden hero can stand in a husk's path and let it walk by.
 */
export function unseenTouch(fromX: number): boolean {
  const e = game.enemies.find((f) => f.x === fromX && f.hp > 0);
  return !!e && e.state === "walk" && !foeSees(e);
}
