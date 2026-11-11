import type { HeroState } from "../../types/hero";
import { hero } from "../state";
import { loading } from "./takeoff";

export const FREE_STATES: ReadonlySet<HeroState> = new Set(["idle", "walk", "run", "jump", "fall"]);
/** the hero walks, stands, jumps or falls, steered by the player, also while a jump loads */
export const inFreeState = (): boolean => FREE_STATES.has(hero.state);
/** the hero may start something: in a free state with no jump loading */
export const isFree = (): boolean => inFreeState() && !loading();

export function setState(s: HeroState): void {
  hero.state = s;
  hero.st = 0;
  hero.hitDone = false;
}
/** back to standing or falling once an action is over */
export function settle(): void {
  setState(hero.ground ? "idle" : "fall");
}
export function leaveHang(): void {
  hero.anchor = null;
  hero.hasSword = true;
  hero.ground = false;
}
