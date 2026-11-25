import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { heroClips } from "../../../motion";
import { ZAFIR_COMBAT_POSES } from "../../constants/drill/combatPoses";
import { ZAFIR_POSES } from "../../constants/drill/locomotion";
import { ZAFIR_MOTION } from "../../constants/drill/motion";
import { ZAFIR_STRIKES } from "../../constants/drill/strikes";
import { ZAFIR_TIERS } from "../../constants/drill/tiers";
import { drawZafirCutIn } from "../../ui/cutIn";
import { ZAFIR_DRILL_HOOKS, zafirModifiers } from "./hooks";
import { zafirRunPose } from "./runPose";
import { ZAFIR_SPELLS } from "./spells";

export const ZAFIR_DRILL: DrillProfile = {
  strikes: ZAFIR_STRIKES,
  attack: 10,
  spells: ZAFIR_SPELLS,
  known: () => ZAFIR_SPELLS,
  tiers: ZAFIR_TIERS,
  warpSlash: { cx: 0, cy: -18, R: 30, sy: 0.32, rot: 0, a0: 3.1, a1: -3.1, W: 8, sweep: 0.06, hold: 0.05, trail: 0.2 },
  enhancedParry: 0.25,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("zafir"),
  drawCutIn: drawZafirCutIn,
  text: {
    attack:
      "Spin the scimitar. Press again during the spin to chain up to three: the sweep turn, the rising turn and the twin turn. Every spin cuts in front and behind. In the air, a spinning descent.",
    ultimate: "Hold to charge Sandstorm through four levels. Release to use the highest level reached.",
    cast: "Prepare the selected spell. Press again when ready to cast, or press during a spin to pour it into the scimitar for three hits.",
    cycle: "Cycle Sandspout, Crescent and Glass Rain before preparing one.",
  },
  modifiers: () => zafirModifiers(NEUTRAL_MODIFIERS),
  motion: ZAFIR_MOTION,
  poses: { ...ZAFIR_POSES, ...ZAFIR_COMBAT_POSES, run: zafirRunPose },
  art: "zafir",
  hooks: ZAFIR_DRILL_HOOKS,
  clips: heroClips("zafir"),
};
