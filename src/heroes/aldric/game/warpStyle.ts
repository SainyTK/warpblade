import { usesDrill } from "../../../drill";
import { createImpact } from "../../../game/effects/impact";
import { sharedWarpStrike } from "../../../game/hero/warp";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { BULWARK } from "../constants/kit";
import { DAWN_SPARKS } from "../constants/light";
import { ARRIVAL_RING } from "../constants/skillNumbers";
import { raiseBarrier } from "./barrier";
import { createDelayedRing } from "./effects/delayedRing";
import { aldricFx } from "./fx";

/** the arrival: the shared blow, led by the shield striking first in a burst of sparks */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  game.fx.push(createImpact(hero.x + hero.face * 12, hero.y - 19, hero.face, true, DAWN_SPARKS));
  sharedWarpStrike(power, foe, sureCrit);
}

/** after the blow: Bulwark goes up, and with Bulwark Arrival a ring of light runs out from where he landed */
function arrived(): void {
  const v = skillValues("al_bulwark");
  if (!usesDrill() && hero.ground) {
    const damage = progress.stats.ad * 2 * (1 + (v.ring ?? 0));
    aldricFx(
      "al_bulwark",
      "pillar",
      { x: hero.x + hero.face * 6, y: hero.y, face: hero.face, reach: 28 },
      { damage, sigil: "sword", lift: 12 },
    );
    aldricFx("al_bulwark", "nova", { x: hero.x, y: hero.y, reach: ARRIVAL_RING }, { quiet: true, delay: 0.04 });
    if (skillEvolved("al_bulwark")) {
      aldricFx(
        "al_bulwark",
        "pillar",
        { x: hero.x - hero.face * 14, y: hero.y, reach: 24 },
        { quiet: true, delay: 0.1 },
      );
    }
  }
  raiseBarrier(BULWARK.time + (v.time ?? 0), 1 + (v.blows ?? 0));
  if (v.ring && hero.ground)
    game.fx.push(
      createDelayedRing(hero.x, hero.y, withBuild("area", ARRIVAL_RING), 0, progress.stats.ad * v.ring, {
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
