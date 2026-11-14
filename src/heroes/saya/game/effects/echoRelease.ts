import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { HeroSource } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import { ECHO_DELAY } from "../../constants/release";
import type { ReleasedCut } from "../../types/events";
import { sayaSound } from "../sound";
import { createInkBurst } from "./inkBurst";

/** a second release a beat after the first: each foe still standing takes `share` of what it took, a sure crit */
export function createEchoRelease(cuts: readonly ReleasedCut[], share: number, source: HeroSource): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < ECHO_DELAY) return true;
      for (const c of cuts) {
        if (c.foe.hp <= 0) continue;
        const [cx, cy] = enemyCenter(c.foe);
        game.fx.push(createInkBurst(cx, cy, [0.6, -0.6], true));
        dealDamage(c.foe, c.amount * share, { fromX: c.foe.x + c.foe.face * 10, sureCrit: true, heavy: true, source });
      }
      if (cuts.length) sayaSound.release(true);
      return false;
    },
    draw() {
      // the bursts it makes draw themselves
    },
  };
}
