import type { GameSnapshot } from "../../types/snapshot";
import { ENGAGE_RANGE } from "./constants";
import type { TrailView } from "./types";

export const inRoom = (trail: TrailView): boolean => trail.gate !== null;
export const bossUp = (trail: TrailView): boolean =>
  trail.beatKind === "boss" && trail.bigFoeHp !== null && trail.bigFoeHp > 0;
export const foeEngaged = (state: GameSnapshot): boolean =>
  state.enemies.some((foe) => foe.hp > 0 && Math.abs(foe.x - state.hero.x) < ENGAGE_RANGE);
export const runOver = (state: GameSnapshot): boolean => state.menu.context === "title";
export const never = (): boolean => false;
