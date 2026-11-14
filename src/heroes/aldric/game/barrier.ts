import { withCharms } from "../../../game/skills/query";
import { hero, lights } from "../../../game/state";
import { DAWN_RAMP } from "../constants/light";
import { aldric } from "./state";

/** raise Bulwark for `seconds`, taking `blows`; one already up keeps whichever is longer and stronger */
export function raiseBarrier(seconds: number, blows: number): void {
  aldric.barrier = Math.max(aldric.barrier, withCharms("duration", seconds));
  aldric.barrierBlows = Math.max(aldric.barrierBlows, blows);
  lights.add(hero.x, hero.y - 18, 30, DAWN_RAMP[4], 0.5, 0.25);
}
