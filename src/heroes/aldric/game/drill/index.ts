import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { ALDRIC_MOTION, ALDRIC_POSES } from "../../constants/drill/body";
import { ALDRIC_STRIKES } from "../../constants/drill/strikes";
import { ALDRIC_TIERS } from "../../constants/drill/tiers";
import { DAWN_RAMP } from "../../constants/light";
import { drawAldricCutIn } from "../../ui/cutIn";
import { ALDRIC_DRILL_HOOKS, aldricModifiers } from "./hooks";
import { aldricRun } from "./run";
import { ALDRIC_SPELLS } from "./spells";
import { ALDRIC_WARP_POSES } from "./warp";

export const ALDRIC_DRILL: DrillProfile = {
  strikes: ALDRIC_STRIKES,
  attack: 10,
  spells: ALDRIC_SPELLS,
  known: () => ALDRIC_SPELLS,
  tiers: ALDRIC_TIERS,
  warpSlash: {
    cx: 6,
    cy: -18,
    R: 22,
    sy: 0.4,
    rot: -0.3,
    a0: -2.2,
    a1: 0.9,
    W: 13,
    hold: 0.07,
    trail: 0.24,
    ramp: DAWN_RAMP,
  },
  enhancedParry: 0.27,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("aldric"),
  drawCutIn: drawAldricCutIn,
  text: {
    attack:
      "Strike with sword and shield. Press again during a blow to chain Oath cut, Shield bash and Crest breaker. In the air, Sky cut.",
    guard:
      "Hold the kite shield up to block from the front. Tap just before impact to parry with a shield punch. Press during a ground blow for an enhanced parry.",
    ultimate:
      "Hold to charge through Dawn Ward, Sunpillar Rank, Noon Verdict and Sanctuary. Release to use the highest reached.",
    cast: "Prepare the selected light spell. Press again when ready to cast, or press during a blow to pour it into the sword.",
    cycle: "Cycle Dawn Lance, Sunpillar and Mending Light before preparing one.",
  },
  modifiers: () => aldricModifiers(NEUTRAL_MODIFIERS),
  hooks: ALDRIC_DRILL_HOOKS,
  motion: ALDRIC_MOTION,
  poses: { ...ALDRIC_POSES, ...ALDRIC_WARP_POSES, run: aldricRun },
  art: "aldric",
};
