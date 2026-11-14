import type { HeroModule } from "../../types/heroModule";
import { hex } from "../../utils/color";
import { ABILITY_TAB } from "./constants/abilities";
import { SAYA_KIT } from "./game/kit";
import { FOCUS_METER } from "./game/meter";
import { SAYA_MOVES } from "./game/moves";
import { SAYA_SKILLS } from "./game/skills";
import { castSilentMoon } from "./game/ultimate/silentMoon";
import type { SayaAbility } from "./types/ability";
import { SAYA_SKILL_ICONS } from "./ui/icons";
import { sayaArt } from "./ui/touchArt";

/** the ability the touch buttons follow, its first one when none is selected yet */
const abilityOf = (ability: string): SayaAbility => (ability in ABILITY_TAB ? (ability as SayaAbility) : "line");

/**
 * Saya's code entry, read by the hero registry (src/heroes/index.ts): her kit, combo moves, skill code, ultimate,
 * icons, touch art and the Focus meter. Her data entry is `character.ts` beside it.
 */
export const SAYA_MODULE: HeroModule = {
  kit: SAYA_KIT,
  moves: SAYA_MOVES,
  skills: SAYA_SKILLS,
  castUltimate: castSilentMoon,
  icons: SAYA_SKILL_ICONS,
  touch: {
    art: (action, ability, known) => sayaArt(action, abilityOf(ability), known),
    tint: (ability) => hex(ABILITY_TAB[abilityOf(ability)].tint),
  },
  meter: FOCUS_METER,
};
