import { IRON_LIGHT } from "../../constants/hulda/look";
import { HERO_COLORS } from "../../constants/palette";
import { sfx } from "../../services/audio";
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
 * Per cast against Quake Drop at charge level 3 (7x on each foe it reaches), measured on a crowd: at level 8, eight
 * seconds in which every landed blow quakes the floor for 9x, all of it doubled, about 6 times; Iron Titan's twelve
 * seconds of 20x quakes, about 16 times. Most of it is the quakes: doubling her own blows alone is under 1 time.
 */
export function castUnbroken(level: number): void {
  const v = skillValues("h_unbroken");
  hulda.ironT = v.time + v.perLevel * (level - 1);
  hulda.iron = v.bonus;
  if (v.fill) hulda.grit = maxGrit();
  game.fx.push(createFloorRing(hero.x, hero.y, 30, skin.ramp, 0.5));
  lights.add(hero.x, hero.y - 18, IRON_LIGHT.radius, HERO_COLORS.steel, IRON_LIGHT.strength, IRON_LIGHT.life);
  shake(0.2, 2);
  sfx.block();
}
