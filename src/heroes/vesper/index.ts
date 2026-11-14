import type { HeroModule } from "../../types/heroModule";
import { ABILITY_COLOR } from "./constants/abilities";
import { VESPER_KIT } from "./game/kit";
import { TEMPO_METER } from "./game/meter";
import { VESPER_MOVES } from "./game/moves";
import { VESPER_SKILLS } from "./game/skills";
import { castDuskWaltz } from "./game/ultimate/duskWaltz";
import type { VesperAbility } from "./types/ability";
import { VESPER_SKILL_ICONS } from "./ui/icons";
import { vesperArt } from "./ui/touchArt";

/**
 * Vesper's code entry, read by the hero registry (src/heroes/index.ts): her kit, combo moves, skill code, ultimate,
 * icons, touch art and the Tempo meter. Her data entry is `character.ts` beside it.
 */
export const VESPER_MODULE: HeroModule = {
  kit: VESPER_KIT,
  moves: VESPER_MOVES,
  skills: VESPER_SKILLS,
  castUltimate: castDuskWaltz,
  icons: VESPER_SKILL_ICONS,
  touch: {
    art: (action, ability, known) => vesperArt(action, ability as VesperAbility, known as VesperAbility[]),
    tint: (ability) => ABILITY_COLOR[(ability || "crescent") as VesperAbility],
  },
  meter: TEMPO_METER,
};
