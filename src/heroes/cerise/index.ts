import type { HeroModule } from "../../types/heroModule";
import { ABILITY_COLOR } from "./constants/abilities";
import { CERISE_KIT } from "./game/kit";
import { POINTS_METER } from "./game/meter";
import { CERISE_MOVES } from "./game/moves";
import { CERISE_SKILLS } from "./game/skills";
import { castRoseTempest } from "./game/tempest";
import type { CeriseAbility } from "./types/ability";
import { CERISE_SKILL_ICONS } from "./ui/icons";
import { ceriseArt } from "./ui/touchArt";

/**
 * Cerise's code entry, read by the hero registry (src/heroes/index.ts): her kit, combo moves, skill code, Rose Tempest,
 * icons, touch art and the PT bar. Her data entry is `character.ts` beside it.
 */
export const CERISE_MODULE: HeroModule = {
  kit: CERISE_KIT,
  moves: CERISE_MOVES,
  skills: CERISE_SKILLS,
  castUltimate: castRoseTempest,
  icons: CERISE_SKILL_ICONS,
  touch: {
    art: (action, ability, known) => ceriseArt(action, (ability || "flurry") as CeriseAbility, known),
    tint: (ability) => ABILITY_COLOR[(ability || "flurry") as CeriseAbility] ?? ABILITY_COLOR.flurry,
  },
  meter: POINTS_METER,
};

export * from "./game/adventure";
