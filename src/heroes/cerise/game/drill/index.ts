import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { CERISE_STRIKES } from "../../constants/drill/strikes";
import { CERISE_TIERS } from "../../constants/drill/tiers";
import { drawCeriseCutIn } from "../../ui/cutIn";
import { tickMarks } from "../mark";
import { releaseTempest } from "./release";
import { CERISE_SPELLS } from "./spells";

export const CERISE_DRILL: DrillProfile = {
  strikes: CERISE_STRIKES,
  attack: 10,
  spells: CERISE_SPELLS,
  known: () => CERISE_SPELLS,
  tiers: CERISE_TIERS,
  warpSlash: { cx: 4, cy: -18, R: 30, sy: 0.18, rot: 0, a0: -0.5, a1: 0.35, W: 7, hold: 0.06, trail: 0.2 },
  enhancedParry: 0.23,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("cerise"),
  drawCutIn: drawCeriseCutIn,
  text: {
    attack: "Thrust with the rapier. Press again during the thrust to chain up to three, the last a lunge.",
    ultimate: "Hold to charge Rose Tempest through four levels. Release to use the highest level reached.",
    cast: "Prepare the selected ability. Press again when ready to cast, or press during a thrust for Rose Edge: the next three hits that land apply Rose Mark.",
    cycle: "Cycle Rose Line and Flurry before preparing one.",
  },
  modifiers: () => NEUTRAL_MODIFIERS,
  hooks: { tick: tickMarks, released: releaseTempest },
};
