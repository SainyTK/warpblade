import { game, hero, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { RAIN } from "../../constants/rain";
import { createRainSword } from "./rainSword";

/** Endless Rain: for `seconds` after Jade Rain strikes, a sword keeps falling on a foe near Yun */
export function createLingeringRain(seconds: number, each: number): Effect {
  let t = 0;
  let next = RAIN.lingerEvery;
  return {
    update(dt) {
      t += dt;
      next -= dt;
      if (next <= 0) {
        next = RAIN.lingerEvery;
        const near = game.enemies.filter((e) => e.hp > 0 && Math.abs(e.x - hero.x) < RAIN.lingerReach);
        if (near.length)
          game.fx.push(createRainSword({ foe: rng.pick(near) }, 0, rng.range(-30, 30), each, "ultimate"));
      }
      return t < seconds;
    },
    draw() {},
  };
}
