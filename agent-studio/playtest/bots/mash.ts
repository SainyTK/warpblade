import { STRIKE_REACH } from "../constants/bot";
import { KEYS } from "../constants/keys";
import type { Policy } from "../types/bot";
import { nearestFoe, sideOf } from "../utils/foes";
import { directionKey } from "./directionKey";

/** walk to the nearest foe and mash J; take the first card of every pick */
export const mashPolicy: Policy = {
  name: "mash",
  decide(state) {
    const foe = nearestFoe(state.hero, state.enemies);
    if (!foe) {
      return { hold: [], tap: [] };
    }
    const side = sideOf(state.hero, foe);
    const walk = Math.abs(foe.x - state.hero.x) > STRIKE_REACH / 2 || state.hero.face !== side;
    return { hold: walk ? [directionKey(side)] : [], tap: [KEYS.attack] };
  },
  choosePick: () => 0,
};
