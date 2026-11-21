import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { YUN_MOTION } from "../../constants/drill/motion";
import { YUN_STRIKES } from "../../constants/drill/strikes";
import { drawYunCutIn } from "../../ui/cutIn";
import { YUN_DRILL_HOOKS, yunModifiers } from "./hooks";
import { YUN_POSES } from "./poses";
import { YUN_SPELLS } from "./spells";
import { drawThrownDrillJian } from "./thrownJian";
import { YUN_TIERS } from "./tiers";

export const YUN_DRILL: DrillProfile = {
  strikes: YUN_STRIKES,
  attack: 10,
  spells: YUN_SPELLS,
  known: () => YUN_SPELLS,
  tiers: YUN_TIERS,
  warpSlash: { cx: 3, cy: -19, R: 28, sy: 0.4, rot: -0.3, a0: -2.8, a1: 0.9, W: 11, hold: 0.06, trail: 0.24 },
  enhancedParry: 0.23,
  drawThrown: drawThrownDrillJian,
  portrait: () => loadGeneratedHeroPortrait("yun"),
  drawCutIn: drawYunCutIn,
  text: {
    attack:
      "Cut with the jian. Press again during the cut to flow into the next, up to three: Willow Cut, Crane Wheel, Returning Tide.",
    ultimate: "Hold to charge Jade Rain through four levels. Release to call down the highest level reached.",
    cast: "Prepare the selected sword art. Press again when ready to send it, or press during a cut to fill the jian with it for the next three hits.",
    cycle: "Cycle Sword Stream, Sword Lotus and Qi Crescent before preparing one.",
  },
  modifiers: () => yunModifiers(NEUTRAL_MODIFIERS),
  hooks: YUN_DRILL_HOOKS,
  motion: YUN_MOTION,
  poses: YUN_POSES,
  art: "yun",
};
