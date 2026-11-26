import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { heroClips } from "../../../motion";
import { KAEL_SPELLS } from "../../constants/drill/spells";
import { KAEL_STRIKES } from "../../constants/drill/strikes";
import { KAEL_TIERS } from "../../constants/drill/tiers";
import { KAEL_DRILL_HOOKS, kaelModifiers } from "./hooks";
import { drawThrownSword } from "./thrownSword";

export const KAEL_DRILL: DrillProfile = {
  strikes: KAEL_STRIKES,
  attack: 10,
  spells: KAEL_SPELLS,
  known: () => KAEL_SPELLS,
  tiers: KAEL_TIERS,
  warpSlash: { cx: 2, cy: -20, R: 24, sy: 0.5, rot: -0.5, a0: -2.6, a1: 0.8, W: 10, hold: 0.06, trail: 0.24 },
  enhancedParry: 0.23,
  drawThrown: drawThrownSword,
  portrait: () => loadGeneratedHeroPortrait("kael"),
  text: {
    cycle: "Select the next of Fire, Ice and Thunder.",
    cast: "Cast the selected spell at once, or the next ready one. During a slash, infuse the sword with it.",
  },
  modifiers: () => kaelModifiers(NEUTRAL_MODIFIERS),
  hooks: KAEL_DRILL_HOOKS,
  clips: heroClips("kael"),
};
