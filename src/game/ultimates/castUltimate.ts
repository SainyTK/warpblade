import { sfx } from "../../services/audio";
import type { UltimateId } from "../../types/skill";
import { WHITE } from "../../utils/color";
import { createFloorRing } from "../effects/floorRing";
import { castBerserk } from "../hero/brannoc/berserk";
import { castDrumroll } from "../hero/jory/drumroll";
import { castHourOfStillness } from "../hero/mirel/hour";
import { castGrandPendulum } from "../hero/orrin/pendulum";
import { skin } from "../hero/skin";
import { castEclipse, castGloaming } from "../hero/tallis/gloaming";
import { castGreatWick, castThousandCandles } from "../hero/wenna/greatWick";
import { SKY_FLASH } from "../spells/lightning";
import { game, hero, lights } from "../state";
import { shake } from "../world";
import { castBoltStorm } from "./boltStorm";
import { castCrystalNova } from "./crystalNova";
import { castDeadeye } from "./deadeye";
import { castPhantomLegion } from "./phantomLegion";
import { castPyreWave } from "./pyreWave";
import { castQuakeDrop } from "./quakeDrop";
import { castStarfall } from "./starfall";
import { castTempest } from "./tempest";
import { castThousandEdges } from "./thousandEdges";

const ULTIMATES: Record<UltimateId, (level: number) => void> = {
  crystalNova: castCrystalNova,
  pyreWave: castPyreWave,
  thousandEdges: castThousandEdges,
  phantomLegion: castPhantomLegion,
  starfall: castStarfall,
  tempest: castTempest,
  sunspear: castPyreWave,
  volcanicRift: castPyreWave,
  boltStorm: castBoltStorm,
  deadeye: castDeadeye,
  quakeDrop: castQuakeDrop,
  titanThrow: castQuakeDrop,
  unbroken: castQuakeDrop,
  grandPendulum: castGrandPendulum,
  maelstrom: castGrandPendulum,
  hourOfStillness: castHourOfStillness,
  eternalNoon: castHourOfStillness,
  greatWick: castGreatWick,
  thousandCandles: castThousandCandles,
  gloaming: castGloaming,
  eclipse: castEclipse,
  drumroll: castDrumroll,
  grandFinale: castDrumroll,
  berserk: castBerserk,
  unendingRage: castBerserk,
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
