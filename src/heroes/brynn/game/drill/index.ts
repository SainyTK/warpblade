import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { heroClips } from "../../../motion";
import { BRYNN_BODY } from "../../constants/drill/body";
import { BRYNN_STRIKES } from "../../constants/drill/strikes";
import { BRYNN_TIERS } from "../../constants/drill/tiers";
import { drawBrynnCutIn } from "../../ui/cutIn";
import { BRYNN_DRILL_HOOKS, brynnModifiers } from "./hooks";
import { BRYNN_SPELLS } from "./spells";
import { drawSpinningGreatsword } from "./thrown";

export const BRYNN_DRILL: DrillProfile = {
  strikes: BRYNN_STRIKES,
  attack: 10,
  spells: BRYNN_SPELLS,
  known: () => BRYNN_SPELLS,
  tiers: BRYNN_TIERS,
  warpSlash: { cx: 8, cy: -20, R: 28, sy: 0.85, rot: 0.1, a0: -2.3, a1: 1.1, W: 13, hold: 0.07, trail: 0.26 },
  enhancedParry: 0.21,
  drawThrown: drawSpinningGreatsword,
  portrait: () => loadGeneratedHeroPortrait("brynn"),
  drawCutIn: drawBrynnCutIn,
  text: {
    attack:
      "Swing Anvilheart. Press again during the swing to chain Wide Sweep, Rising Heave and Anvil Slam. In the air, the Falling Slam.",
    ultimate: "Hold to charge Crimson Fall through four levels. Release to use the highest level reached.",
    cast: "Prepare the selected spell. Press again when ready to cast, or press during a swing to pour it into the blade for three hits.",
    cycle: "Cycle Rend, Quake and Ember Arc before preparing one.",
  },
  modifiers: () => brynnModifiers(NEUTRAL_MODIFIERS),
  hooks: BRYNN_DRILL_HOOKS,
  ...BRYNN_BODY,
  art: "brynn",
  clips: heroClips("brynn"),
};
