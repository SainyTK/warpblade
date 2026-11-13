import { sfx } from "../../services/audio";
import type { UltimateId } from "../../types/skill";
import { WHITE } from "../../utils/color";
import { createFloorRing } from "../effects/floorRing";
import { castBerserk } from "../hero/brannoc/berserk";
import { castDrumroll } from "../hero/jory/drumroll";
import { castHourOfStillness } from "../hero/mirel/hour";
import { castGrandPendulum } from "../hero/orrin/pendulum";
import { skin } from "../hero/skin";
import { castGloaming } from "../hero/tallis/gloaming";
import { castGreatWick } from "../hero/wenna/greatWick";
import { SKY_FLASH } from "../spells/lightning";
import { game, hero, lights } from "../state";
import { shake } from "../world";
import { castBoltStorm } from "./boltStorm";
import { castCrystalNova } from "./crystalNova";
import { castPyreWave } from "./pyreWave";
import { castQuakeDrop } from "./quakeDrop";

const ULTIMATES: Record<UltimateId, (level: number) => void> = {
  crystalNova: castCrystalNova,
  pyreWave: castPyreWave,
  boltStorm: castBoltStorm,
  quakeDrop: castQuakeDrop,
  grandPendulum: castGrandPendulum,
  hourOfStillness: castHourOfStillness,
  greatWick: castGreatWick,
  gloaming: castGloaming,
  drumroll: castDrumroll,
  berserk: castBerserk,
};

/** a burst of light from the hero, bigger each level, then the ultimate itself; level 4 lights up the sky */
export function castUltimate(id: UltimateId, level: number): void {
  game.fx.push(createFloorRing(hero.x, hero.y, 24 + level * 14, skin.ramp, 0.5));
  lights.add(hero.x, hero.y - 18, 50 + level * 25, skin.ramp[3], 0.9, 0.5);
  lights.add(hero.x, hero.y - 18, 20, WHITE, 0.9, 0.12);
  shake(0.2 + level * 0.08, 1.5 + level);
  if (level >= 4) game.flash = SKY_FLASH * 2;
  sfx.ultimate(level);
  ULTIMATES[id](level);
}
