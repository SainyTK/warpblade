import { SKY_FLASH } from "../../constants/effectLook";
import { sfx } from "../../services/audio";
import { WHITE } from "../../utils/color";
import { createFloorRing } from "../effects/floorRing";
import { heroCode } from "../hero/kits";
import { skin } from "../hero/skin";
import { game, hero, lights } from "../state";
import { shake } from "../world";

/** a burst of light from the hero, bigger each level, then the hero's own ultimate; level 4 lights up the sky */
export function castUltimate(level: number): void {
  game.fx.push(createFloorRing(hero.x, hero.y, 24 + level * 14, skin.ramp, 0.5));
  lights.add(hero.x, hero.y - 18, 50 + level * 25, skin.ramp[3], 0.9, 0.5);
  lights.add(hero.x, hero.y - 18, 20, WHITE, 0.9, 0.12);
  shake(0.2 + level * 0.08, 1.5 + level);
  if (level >= 4) game.flash = SKY_FLASH * 2;
  sfx.ultimate(level);
  heroCode().castUltimate(level);
}
