import type { HeroModule } from "../../types/heroModule";
import { ABILITY_COLOR, CALDER_ABILITIES } from "./constants/shots";
import { CALDER_DRILL } from "./game/drill";
import { CALDER_KIT } from "./game/kit";
import { CALDER_METER } from "./game/meter";
import { CALDER_MOVES } from "./game/moves";
import { CALDER_SKILLS } from "./game/skills";
import { castCylinderBreak } from "./game/ultimate/cylinderBreak";
import type { CalderAbility } from "./types/ability";
import { CALDER_ICONS } from "./ui/icons";
import { calderArt } from "./ui/touchArt";
import "./types/events";
import "./types/states";

const isAbility = (a: string): a is CalderAbility => (CALDER_ABILITIES as readonly string[]).includes(a);

/**
 * Calder's code entry, read by the hero registry (src/heroes/index.ts): his kit, combo moves, skill code, ultimate,
 * icons, touch art and the chamber on the HUD. His data entry is `character.ts` beside it.
 */
export const CALDER_MODULE: HeroModule = {
  kit: CALDER_KIT,
  moves: CALDER_MOVES,
  skills: CALDER_SKILLS,
  castUltimate: castCylinderBreak,
  icons: CALDER_ICONS,
  touch: {
    art: (action, ability, known) => calderArt(action, isAbility(ability) ? ability : "slug", known.filter(isAbility)),
    tint: (ability) => ABILITY_COLOR[isAbility(ability) ? ability : "slug"],
  },
  meter: CALDER_METER,
  drill: CALDER_DRILL,
};
