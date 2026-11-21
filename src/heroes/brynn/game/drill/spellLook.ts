import { createFloorRing } from "../../../../game/effects/floorRing";
import { game, lights } from "../../../../game/state";
import { dust } from "../../../../game/world";
import type { DrillSpell } from "../../../../types/drill";
import type { Enemy } from "../../../../types/enemy";
import { CRIMSON } from "../../constants/colors";

const QUAKE_RING = 30;
const REND_RING = 14;

export function showSpellHit(foe: Enemy, spell: DrillSpell): void {
  if (spell.id === "quake") {
    game.fx.push(createFloorRing(foe.x, foe.y, QUAKE_RING, CRIMSON, 0.4));
    dust(foe.x - 6, foe.y, 5, -1);
    dust(foe.x + 6, foe.y, 5, 1);
    lights.add(foe.x, foe.y - 6, 30, CRIMSON[4], 0.6, 0.25);
  } else if (spell.id === "rend") {
    game.fx.push(createFloorRing(foe.x, foe.y, REND_RING, CRIMSON, 0.25, 0.4));
  }
}
