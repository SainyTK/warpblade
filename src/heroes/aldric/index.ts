import type { HeroModule } from "../../types/heroModule";
import { hex } from "../../utils/color";
import { ABILITY_TAB } from "./constants/abilities";
import { DAWN_CSS } from "./constants/light";
import { ALDRIC_DRILL } from "./game/drill";
import { ALDRIC_KIT } from "./game/kit";
import { ALDRIC_MOVES } from "./game/moves";
import { ALDRIC_SKILLS } from "./game/skills";
import { castSanctuary } from "./game/ultimate/sanctuary";
import { radiant, valorShare } from "./game/valor";
import type { AldricAbility } from "./types/state";
import { ALDRIC_ICONS } from "./ui/icons";
import { aldricArt } from "./ui/touchArt";

/** Aldric's code entry: his kit, moves, skill code, ultimate, icons, touch art and the Valor bar */
export const ALDRIC_MODULE: HeroModule = {
  kit: ALDRIC_KIT,
  moves: ALDRIC_MOVES,
  skills: ALDRIC_SKILLS,
  castUltimate: castSanctuary,
  icons: ALDRIC_ICONS,
  touch: {
    art: (action, ability, known) => aldricArt(action, (ability || "rush") as AldricAbility, known),
    tint: (ability) => hex(ABILITY_TAB[(ability || "rush") as AldricAbility].tint),
  },
  meter: {
    label: "VL",
    tint: DAWN_CSS,
    share: valorShare,
    lit: radiant,
  },
  drill: ALDRIC_DRILL,
};
