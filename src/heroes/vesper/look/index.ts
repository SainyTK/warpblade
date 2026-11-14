import type { HeroSkin } from "../../../types/character";
import { drawVesperArm } from "./arm";
import { LONG_BLADE } from "./blade";
import { drawVesperCoatTails } from "./coatTails";
import { DUSK_RAMP, DUSK_SPARKS, VESPER_COLORS } from "./colors";
import { VESPER_HEAD, VESPER_HEAD_BACK } from "./head";
import { SHORT_BLADE } from "./shortBlade";
import { drawVesperTorso } from "./torso";
import { drawVesperTrails } from "./trails";

/**
 * How Vesper looks on the shared rig: pale long hair with a fringe over one eye, a plum coat with one long sleeve and one
 * bare wrapped arm, an uneven coat tail, a long violet scarf, the pale long blade in her sword hand and the dark short
 * blade in the other. Her effects are violet dusk.
 */
export const VESPER_SKIN: HeroSkin = {
  colors: VESPER_COLORS,
  head: VESPER_HEAD,
  headBack: VESPER_HEAD_BACK,
  blade: LONG_BLADE,
  offhand: SHORT_BLADE,
  parts: {
    trails: drawVesperTrails,
    arm: drawVesperArm,
    torso: drawVesperTorso,
    coatTails: drawVesperCoatTails,
  },
  ramp: DUSK_RAMP,
  glow: DUSK_RAMP[4],
  sparks: DUSK_SPARKS,
};
