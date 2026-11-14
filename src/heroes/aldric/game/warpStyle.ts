import { createImpact } from "../../../game/effects/impact";
import { sharedWarpStrike } from "../../../game/hero/warp";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { BULWARK } from "../constants/kit";
import { DAWN_SPARKS } from "../constants/light";
import { ARRIVAL_RING } from "../constants/skillNumbers";
import { raiseBarrier } from "./barrier";
import { createDelayedRing } from "./effects/delayedRing";

/** the arrival: the shared blow, led by the shield striking first in a burst of sparks */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  game.fx.push(createImpact(hero.x + hero.face * 12, hero.y - 19, hero.face, true, DAWN_SPARKS));
  sharedWarpStrike(power, foe, sureCrit);
}

/** after the blow: Bulwark goes up, and with Bulwark Arrival a ring of light runs out from where he landed */
function arrived(): void {
  const v = skillValues("al_bulwark");
  raiseBarrier(BULWARK.time + (v.time ?? 0), 1 + (v.blows ?? 0));
  if (v.ring && hero.ground)
    game.fx.push(
      createDelayedRing(hero.x, hero.y, withCharms("area", ARRIVAL_RING), 0, progress.stats.ad * v.ring, {
        kx: 50,
        ky: -40,
        stagger: 0.4,
      }),
    );
}

/** Aldric's warp: the arming sword thrown, and he lands shield first behind a Bulwark */
export const ALDRIC_WARP: WarpStyle = {
  strike,
  arrived,
  tune: () => skillValues("al_bulwark"),
};
