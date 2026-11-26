import { fitRunFeet, NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { heroClips } from "../../../motion";
import { CALDER_MOTION } from "../../constants/drill/motion";
import { CALDER_POSES, calderRunUpperBody } from "../../constants/drill/poses";
import { CALDER_STRIKES } from "../../constants/drill/strikes";
import { CALDER_DRILL_HOOKS, calderModifiers } from "./hooks";
import { CALDER_SPELLS } from "./spells";
import { CALDER_DRILL_TIERS } from "./tiers";

export const CALDER_DRILL: DrillProfile = {
  strikes: CALDER_STRIKES,
  attack: 10,
  spells: CALDER_SPELLS,
  known: () => CALDER_SPELLS,
  tiers: CALDER_DRILL_TIERS,
  warpSlash: { cx: 4, cy: -22, R: 26, sy: 0.9, rot: 0.1, a0: -3, a1: 0.8, W: 14, hold: 0.07, trail: 0.24 },
  enhancedParry: 0.23,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("calder"),
  text: {
    attack:
      "Cut with the trigger blade. Press again during the cut to chain up to three; the third fires a round into the wound.",
    warp: "Throw the blade at the nearest foe ahead and warp to it, firing a round as you land.",
    ultimate:
      "Hold to charge through Breach Cut, Buckshot Wall, Green Line and Cylinder Break. Release to use the highest reached.",
    cast: "Fire the selected shell at once, or the next ready one. During a cut, load it into the blade for the next hits.",
    cycle: "Select the next of Phosphor Shell, Chain Shot and Blast Charge.",
  },
  modifiers: () => calderModifiers(NEUTRAL_MODIFIERS),
  hooks: CALDER_DRILL_HOOKS,
  motion: CALDER_MOTION,
  poses: { ...CALDER_POSES, run: fitRunFeet(calderRunUpperBody) },
  clips: heroClips("calder"),
};
