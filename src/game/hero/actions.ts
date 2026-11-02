import type { HeroState } from "../../types/hero";
import { hero } from "../state";

export const FREE_STATES: ReadonlySet<HeroState> = new Set(["idle", "walk", "run", "jump", "fall"]);
export const isFree = (): boolean => FREE_STATES.has(hero.state);

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
