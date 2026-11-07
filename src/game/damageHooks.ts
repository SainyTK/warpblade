import type { Enemy } from "../types/enemy";
import type { KitId } from "../types/kit";
import { character } from "./state";

/** a blow of the hero's own, as a kit's damage bonus reads it */
export interface OwnHit {
  back: boolean;
  keen: boolean;
  melee: boolean;
}

/** what a kit's skills add to damage: on the hero's own hits, and on what a foe takes from every source */
export interface DamageHooks {
  /** extra damage one of the hero's own hits deals, added together (0.5 is +50%) */
  hitBonus(e: Enemy, hit: OwnHit): number;
  /** extra damage a foe takes from every source, added together and to a mark, at most `DAMAGE.takenCap` */
  takenBonus(e: Enemy): number;
}

/** each kit's hooks, registered by the kit's own module; kept apart from the kits so `dealDamage` does not load them */
const hooks: Partial<Record<KitId, DamageHooks>> = {};

export function registerDamageHooks(kit: KitId, h: DamageHooks): void {
  hooks[kit] = h;
}

/** the hero in play's kit bonus on one of their own hits */
export const hitBonus = (e: Enemy, hit: OwnHit): number => hooks[character.kit]?.hitBonus(e, hit) ?? 0;

/** the hero in play's kit bonus on what a foe takes */
export const takenBonus = (e: Enemy): number => hooks[character.kit]?.takenBonus(e) ?? 0;
