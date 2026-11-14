import type { HeroModule } from "../../types/heroModule";
import { hex } from "../../utils/color";
import { BRYNN_ACCENT } from "./constants/colors";
import { BRYNN_KIT } from "./game/kit";
import { BRYNN_METER } from "./game/meter";
import { BRYNN_MOVES } from "./game/moves";
import { BRYNN_SKILLS } from "./game/skills";
import { castCrimsonFall } from "./game/ultimate/crimsonFall";
import { BRYNN_ICONS } from "./ui/icons";
import { brynnArt } from "./ui/touchArt";

/** Brynn's code entry, read by the hero registry (src/heroes/index.ts): her kit, moves, skill code, ultimate, icons,
 *  touch art and the HF bar. Her data entry is `character.ts` beside it */
export const BRYNN_MODULE: HeroModule = {
  kit: BRYNN_KIT,
  moves: BRYNN_MOVES,
  skills: BRYNN_SKILLS,
  castUltimate: castCrimsonFall,
  icons: BRYNN_ICONS,
  touch: { art: brynnArt, tint: () => hex(BRYNN_ACCENT) },
  meter: BRYNN_METER,
};
