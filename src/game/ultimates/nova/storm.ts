import { NOVA_FOLLOW } from "../../../constants/kael/nova";
import type { Effect } from "../../../types/effect";
import { kael } from "../../hero/kael/state";
import { game, hero } from "../../state";
import { edgeCut } from "./edges";

/** Supernova's storm: for a while the edges follow Kael and cut every foe close to him; each Keen blow he lands in it
 *  adds a volley to the next cut */
export function createNovaStorm(seconds: number, damage: number): Effect {
  let t = 0;
  let next = 0;
  kael.stormLeft = seconds;
  kael.stormVolleys = 0;
  return {
    update(dt) {
      t += dt;
      next -= dt;
      kael.stormLeft = Math.max(0, seconds - t);
      if (next <= 0) {
        next = NOVA_FOLLOW.every;
        const volleys = 1 + kael.stormVolleys;
        kael.stormVolleys = 0;
        for (const foe of game.enemies) {
          if (foe.hp <= 0 || Math.abs(foe.x - hero.x) > NOVA_FOLLOW.reach) continue;
          edgeCut(foe, damage * volleys);
        }
      }
      return t < seconds;
    },
    draw() {},
  };
}
