import { NEUTRAL_MODIFIERS } from "../../../../drill";
import { drawThrownBlade } from "../../../../game/effects/thrownWeapon";
import { loadGeneratedHeroPortrait } from "../../../../generatedHeroArt";
import type { DrillProfile } from "../../../../types/drill";
import { heroClips } from "../../../motion";
import { SAYA_MOTION } from "../../constants/drill/motion";
import { SAYA_DRILL_POSES } from "../../constants/drill/poses";
import { SAYA_STRIKES } from "../../constants/drill/strikes";
import { INK_RAMP } from "../../look/ramp";
import { drawSayaCutIn } from "../../ui/cutIn";
import { SAYA_DRILL_HOOKS, sayaModifiers } from "./hooks";
import { sayaRun } from "./run";
import { SAYA_SPELLS } from "./spells";
import { SAYA_TIERS } from "./tiers";

export const SAYA_DRILL: DrillProfile = {
  strikes: SAYA_STRIKES,
  attack: 10,
  spells: SAYA_SPELLS,
  known: () => SAYA_SPELLS,
  tiers: SAYA_TIERS,
  warpSlash: {
    cx: 2,
    cy: -17,
    R: 30,
    sy: 0.18,
    rot: 0.02,
    a0: -2.6,
    a1: 0.5,
    W: 10,
    hold: 0.06,
    trail: 0.24,
    ramp: INK_RAMP,
  },
  enhancedParry: 0.23,
  drawThrown: drawThrownBlade,
  portrait: () => loadGeneratedHeroPortrait("saya"),
  drawCutIn: drawSayaCutIn,
  text: {
    attack:
      "Draw, return cut, sheathe. Each cut stores ink in the foe; the sheathe's click releases every stored cut at once.",
    ultimate: "Hold to charge Silent Moon through four levels. Release to use the highest level reached.",
    cast: "Cast the selected spell at once, or the next ready one. During a cut, ink the blade with it.",
    cycle: "Select the next of Crescent Wave, Ink Rain and Still Water.",
  },
  modifiers: () => sayaModifiers(NEUTRAL_MODIFIERS),
  hooks: SAYA_DRILL_HOOKS,
  motion: SAYA_MOTION,
  poses: { ...SAYA_DRILL_POSES, run: sayaRun },
  clips: heroClips("saya"),
};
