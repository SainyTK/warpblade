import type { HeroModule } from "../../types/heroModule";
import { ABILITY_COLOR } from "./constants/spells";
import { KAEL_KIT } from "./game/kit";
import { KAEL_MOVES } from "./game/moves";
import { KAEL_SKILLS } from "./game/skills";
import { castKaelUltimate } from "./game/ultimate/castUltimate";
import type { KaelAbility } from "./types/spell";
import { KAEL_SKILL_ICONS } from "./ui/icons";
import { kaelArt } from "./ui/touchArt";

/**
 * Kael's code entry, read by the hero registry (src/heroes/index.ts): his kit, combo moves, skill code, ultimate,
 * icons and touch art. His data entry is `character.ts` beside it.
 */
export const KAEL_MODULE: HeroModule = {
  kit: KAEL_KIT,
  moves: KAEL_MOVES,
  skills: KAEL_SKILLS,
  castUltimate: castKaelUltimate,
  icons: KAEL_SKILL_ICONS,
  touch: {
    art: (action, ability, known) => kaelArt(action, ability as KaelAbility, known as KaelAbility[]),
    tint: (ability) => ABILITY_COLOR[(ability || "lance") as KaelAbility],
  },
};
