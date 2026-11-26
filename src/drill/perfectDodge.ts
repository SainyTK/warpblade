import { createFloorRing } from "../game/effects/floorRing";
import { rewardPerfectDodge } from "../game/hero/perfectDodge";
import { skin } from "../game/hero/skin";
import { game, hero, lights } from "../game/state";
import { sfx } from "../services/audio";
import type { Fighter } from "../types/drill";

export function perfectDrillDodge(h: Fighter): boolean {
  if (h.dashTime <= 0) {
    return false;
  }
  if (hero.perfectUsed) {
    return true;
  }
  hero.perfectUsed = true;
  rewardPerfectDodge();
  game.fx.push(createFloorRing(h.x, h.y, 28, skin.ramp, 0.4));
  lights.add(h.x, h.y - 18, 50, skin.ramp[4], 0.7, 0.4);
  sfx.perfect();
  return true;
}
