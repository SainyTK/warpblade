import { PAL } from "../../../constants/palette";
import { FADE, TALLIS_GUARD } from "../../../constants/tallis/moveset";
import type { GuardStyle } from "../../../types/moveset";
import { createFloorRing } from "../../effects/floorRing";
import { game, hero, lights } from "../../state";
import { fadeIn } from "./veil";

/**
 * Tallis's guard: two knives crossed before his chest, a thin block that lets much through but costs little. His parry
 * is Fade: he is gone into the Veil for free, minions lose sight of him, and his first blow out of it is an Ambush.
 */
export const TALLIS_GUARD_STYLE: GuardStyle = {
  chip: TALLIS_GUARD.chip,
  blockCost: TALLIS_GUARD.blockCost,
  parried() {
    fadeIn(FADE.time, "fade", true);
    game.fx.push(createFloorRing(hero.x, hero.y, 18, PAL.gloam, 0.3, 0.3));
    lights.add(hero.x, hero.y - 16, 30, PAL.gloam[4], 0.6, 0.25);
  },
};
