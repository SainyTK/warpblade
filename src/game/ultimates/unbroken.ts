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
 * and her damage is up by the skill's share. What happens while it lasts is the skill's behavior
 * (src/game/skills/hulda/unbroken.ts). Design: docs/skills/hulda.md
 *
 * Per cast against Quake Drop at charge level 3 (7x on each foe it reaches): at level 8, eight seconds of +100% on her
 * own damage (about 2 AD/s base, so about 16x on the foe she fights) plus haymaker quakes at 2x and the closing Quake
 * Drop, about 6 times; Iron Titan's ten seconds and stride quakes, about 14 times.
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
