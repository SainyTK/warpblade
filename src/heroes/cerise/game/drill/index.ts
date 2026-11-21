import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { CERISE_STRIKES } from "../../constants/drill/strikes";
import { drawCeriseCutIn } from "../../ui/cutIn";
import { CERISE_DRILL_HOOKS, ceriseModifiers } from "./hooks";
import { CERISE_POSES } from "./poses";
import { CERISE_SPELLS } from "./spells";
import { CERISE_TIERS } from "./tiers";

export const CERISE_DRILL: DrillProfile = {
  strikes: CERISE_STRIKES,
  attack: 10,
  spells: CERISE_SPELLS,
  known: () => CERISE_SPELLS,
  tiers: CERISE_TIERS,
  warpSlash: { cx: 4, cy: -18, R: 30, sy: 0.18, rot: 0, a0: -0.5, a1: 0.35, W: 7, hold: 0.06, trail: 0.2 },
  enhancedParry: 0.25,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("cerise"),
  drawCutIn: drawCeriseCutIn,
  text: {
    attack: "Thrust with the rapier. Press again during the thrust to chain up to three, the last a lunge.",
    ultimate:
      "Hold to charge Rose Tempest: Rose Thrust, Rising Rose, Thorn Gale, then Rose Tempest itself. Release to use the highest reached.",
    cast: "Prepare the selected spell. Press again when ready to cast, or press during a thrust for Rose Edge: the next three hits carry the spell.",
    cycle: "Cycle Rose Line, Flurry and Rose Bloom before preparing one.",
  },
  modifiers: () => ceriseModifiers(NEUTRAL_MODIFIERS),
  hooks: CERISE_DRILL_HOOKS,
  motion: { run: 118, groundAccel: 3500, dash: 292, dashRecovery: 0.23, rise: 338, fallGravity: 1150, wallKick: 184 },
  poses: CERISE_POSES,
  art: "cerise",
};
