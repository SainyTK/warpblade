import { PAL } from "../constants/palette";
import { LAST_LIGHT_HP } from "../constants/shopSkills";
import { sfx } from "../services/audio";
import { ownedLevel } from "../store/meta";
import { createFloorRing } from "./effects/floorRing";
import { game, hero, lights, progress, showBanner } from "./state";

/** Last Light: a fatal blow leaves the hero standing with half their HP, once per run for each level bought */
export function lastLight(): void {
  if (hero.hp > 0 || game.revives >= ownedLevel("lastLight")) return;
  game.revives++;
  hero.hp = Math.round(progress.stats.hp * LAST_LIGHT_HP);
  hero.inv = 2;
  game.fx.push(createFloorRing(hero.x, hero.y, 40, PAL.heal, 0.7));
  lights.add(hero.x, hero.y - 18, 80, PAL.heal[3], 0.9, 0.8);
  showBanner("Last Light", 1.6);
  sfx.levelUp();
}
