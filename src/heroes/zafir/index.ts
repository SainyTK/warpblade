import type { HeroModule } from "../../types/heroModule";
import { ABILITY_COLOR } from "./constants/abilities";
import { ZAFIR_DRILL } from "./game/drill";
import { ZAFIR_KIT } from "./game/kit";
import { WHIRL_METER } from "./game/meter";
import { ZAFIR_MOVES } from "./game/moves";
import { ZAFIR_SKILLS } from "./game/skills";
import { castSandstorm } from "./game/ultimate/sandstorm";
import type { ZafirAbility } from "./types/abilities";
import { ZAFIR_SKILL_ICONS } from "./ui/icons";
import { zafirArt } from "./ui/touchArt";

/**
 * Zafir's code entry, read by the hero registry (src/heroes/index.ts): his kit, combo moves, skill code, ultimate,
 * icons, touch art and the Whirl meter. His data entry is `character.ts` beside it.
 */
export const ZAFIR_MODULE: HeroModule = {
  kit: ZAFIR_KIT,
  moves: ZAFIR_MOVES,
  skills: ZAFIR_SKILLS,
  castUltimate: castSandstorm,
  icons: ZAFIR_SKILL_ICONS,
  touch: {
    art: (action, ability, known) => zafirArt(action, ability as ZafirAbility, known as ZafirAbility[]),
    tint: (ability) => ABILITY_COLOR[(ability || "spout") as ZafirAbility],
  },
  meter: WHIRL_METER,
  drill: ZAFIR_DRILL,
};
