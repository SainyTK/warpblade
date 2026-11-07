import { sfx } from "../../services/audio";
import { WHITE } from "../../utils/color";
import { createFloorRing } from "../effects/floorRing";
import { maxGrit } from "../hero/hulda/grit";
import { hulda } from "../hero/hulda/memory";
import { skin } from "../hero/skin";
import { skillValues } from "../skills/query";
import { game, hero, lights } from "../state";
import { shake } from "../world";

/**
 * Unbroken, Hulda's iron form: for a few seconds (more for each charge level) no blow breaks a plate or flinches her,
 * and her damage is up by the skill's share. Design: docs/skills/hulda.md
 */
export function castUnbroken(level: number): void {
  const v = skillValues("h_unbroken");
  hulda.ironT = v.time + v.perLevel * (level - 1);
  hulda.iron = v.bonus;
  if (v.fill) hulda.grit = maxGrit();
  game.fx.push(createFloorRing(hero.x, hero.y, 30, skin.ramp, 0.5));
  lights.add(hero.x, hero.y - 18, 40, WHITE, 0.8, 0.3);
  shake(0.2, 2);
  sfx.block();
}
