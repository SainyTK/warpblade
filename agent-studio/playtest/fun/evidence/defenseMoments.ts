import type { GameSnapshot } from "../../types/snapshot";
import type { DefenseView } from "../defense";
import { ENGAGE_RANGE, SIEGE_FOES } from "./constants";

export const bossUp = (_: GameSnapshot, view: DefenseView): boolean =>
  view.bigFoes.some((foe) => foe.kind === "boss" && foe.hp > 0);
export const underSiege = (state: GameSnapshot, view: DefenseView): boolean =>
  view.crystalStruck && state.enemies.filter((foe) => foe.hp > 0).length >= SIEGE_FOES;
export const foeEngaged = (state: GameSnapshot): boolean =>
  state.enemies.some((foe) => foe.hp > 0 && Math.abs(foe.x - state.hero.x) < ENGAGE_RANGE);
export const runOver = (state: GameSnapshot): boolean => state.menu.context === "title";
export const never = (): boolean => false;
