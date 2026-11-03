import { PAL } from "../constants/palette";
import { LAST_LIGHT_HP } from "../constants/shopSkills";
import { sfx } from "../services/audio";
import { ownsSkill } from "../store/meta";
import { createFloorRing } from "./effects/floorRing";
import { game, hero, lights, progress, showBanner } from "./state";

/** Last Light: the first fatal blow of a run leaves Kael standing with half his HP */
export function lastLight(): void {
  if (hero.hp > 0 || game.revived || !ownsSkill("lastLight")) return;
  game.revived = true;
  hero.hp = Math.round(progress.stats.hp * LAST_LIGHT_HP);
  hero.inv = 2;
  game.fx.push(createFloorRing(hero.x, hero.y, 40, PAL.heal, 0.7));
  lights.add(hero.x, hero.y - 18, 80, PAL.heal[3], 0.9, 0.8);
  showBanner("Last Light", 1.6);
  sfx.levelUp();
}
