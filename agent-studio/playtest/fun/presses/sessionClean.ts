import type { GameSnapshot } from "../../types/snapshot";

export const sessionClean = (state: GameSnapshot): boolean =>
  state.hero.hp >= state.hero.maxHp &&
  state.hero.state !== "dead" &&
  state.menu.context === null &&
  !state.enemies.some((foe) => foe.hp > 0);
