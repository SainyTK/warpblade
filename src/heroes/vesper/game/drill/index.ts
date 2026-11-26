import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { heroClips } from "../../../motion";
import { VESPER_MOTION } from "../../constants/drill/motion";
import { VESPER_POSES } from "../../constants/drill/poses";
import { VESPER_STRIKES } from "../../constants/drill/strikes";
import { VESPER_TIERS } from "../../constants/drill/tiers";
import { DUSK_RAMP } from "../../look/colors";
import { drawVesperCutIn } from "../../ui/cutIn";
import { VESPER_DRILL_HOOKS, vesperModifiers } from "./hooks";
import { vesperRun } from "./locomotion/run";
import { VESPER_SPELLS } from "./spells";

export const VESPER_DRILL: DrillProfile = {
  strikes: VESPER_STRIKES,
  attack: 10,
  spells: VESPER_SPELLS,
  known: () => VESPER_SPELLS,
  tiers: VESPER_TIERS,
  warpSlash: {
    cx: 2,
    cy: -19,
    R: 26,
    sy: 0.85,
    rot: 0.8,
    a0: -2.6,
    a1: 0.9,
    W: 11,
    hold: 0.06,
    trail: 0.24,
    ramp: DUSK_RAMP,
  },
  enhancedParry: 0.26,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("vesper"),
  drawCutIn: drawVesperCutIn,
  text: {
    attack:
      "Cut with both blades. Press again during the cut to chain the dusk cross, the rising pair and the moonrise, which throws foes up and lifts you after them.",
    ultimate: "Hold to charge Dusk Waltz through four levels. Release to use the highest level reached.",
    cast: "Cast the selected spell at once, or the next ready one. During a cut, pour it into the blades for three hits that each leave a night echo.",
    cycle: "Select the next of Falling Moon, Dusk Gale and Dusk Thread.",
  },
  modifiers: () => vesperModifiers(NEUTRAL_MODIFIERS),
  motion: VESPER_MOTION,
  poses: { ...VESPER_POSES, run: vesperRun },
  hooks: VESPER_DRILL_HOOKS,
  clips: heroClips("vesper"),
};
