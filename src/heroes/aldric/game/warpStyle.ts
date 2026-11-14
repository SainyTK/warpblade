import { createImpact } from "../../../game/effects/impact";
import { sharedWarpStrike } from "../../../game/hero/warp";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, lights } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle } from "../../../types/moveset";
import { BULWARK } from "../constants/kit";
import { DAWN_RAMP, DAWN_SPARKS } from "../constants/light";
import { aldric } from "./state";

/** the arrival: the shared blow, led by the shield striking first in a burst of sparks */
function strike(power: number, foe: Enemy | null, sureCrit: boolean): void {
  game.fx.push(createImpact(hero.x + hero.face * 12, hero.y - 19, hero.face, true, DAWN_SPARKS));
  sharedWarpStrike(power, foe, sureCrit);
}

/** Bulwark: a barrier of light that takes the next blow, longer and stronger with Bulwark Arrival */
function raiseBulwark(): void {
  const v = skillValues("al_bulwark");
  aldric.barrier = withCharms("duration", BULWARK.time + (v.time ?? 0));
  aldric.barrierBlows = 1 + (v.blows ?? 0);
  lights.add(hero.x, hero.y - 18, 30, DAWN_RAMP[4], 0.5, 0.25);
}

/** Aldric's warp: the arming sword thrown, and he lands shield first behind a Bulwark */
export const ALDRIC_WARP: WarpStyle = {
  strike,
  arrived: () => raiseBulwark(),
  tune: () => skillValues("al_bulwark"),
};
