import type { HeroModule } from "../../types/heroModule";
import { YUN_ABILITIES } from "./constants/abilities";
import { abilityColor } from "./game/abilities";
import { YUN_KIT } from "./game/kit";
import { YUN_METER } from "./game/meter";
import { YUN_MOVES } from "./game/moves";
import { YUN_SKILLS } from "./game/skills";
import { castJadeRain } from "./game/ultimate/jadeRain";
import type { YunAbility } from "./types/ability";
import { YUN_ICONS } from "./ui/icons";
import { yunArt } from "./ui/touchArt";

/** an ability id the HUD hands back, read as one of Yun's */
const asAbility = (a: string): YunAbility =>
  (YUN_ABILITIES as readonly string[]).includes(a) ? (a as YunAbility) : "stream";

/**
 * Yun's code entry, read by the hero registry: his kit, combo moves, skill code, ultimate, icons, touch art and the SW
 * meter. His data entry is `character.ts` beside it.
 */
export const YUN_MODULE: HeroModule = {
  kit: YUN_KIT,
  moves: YUN_MOVES,
  skills: YUN_SKILLS,
  castUltimate: castJadeRain,
  icons: YUN_ICONS,
  touch: {
    art: (action, ability, known) => yunArt(action, asAbility(ability), known),
    tint: (ability) => abilityColor(asAbility(ability)),
  },
  meter: YUN_METER,
};
