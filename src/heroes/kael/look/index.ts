import { PAL, SPARKS } from "../../../constants/palette";
import type { HeroSkin } from "../../../types/character";
import { drawKaelArm } from "./arm";
import { KAEL_BLADE } from "./blade";
import { drawKaelCoatTails } from "./coat";
import { KAEL_COLORS } from "./colors";
import { KAEL_BACK_HAIR, KAEL_FRINGE } from "./hair";
import { KAEL_HEAD, KAEL_HEAD_BACK } from "./head";
import { KAEL_STRAP } from "./strap";
import { drawKaelTrails } from "./trails";

/**
 * How Kael looks on the shared rig: spiked silver hair with a long tied tail, a midnight blue long coat split into a
 * cyan-lined tail and a short front panel, a strap with a crystal clasp, his split red scarf and the crystal longsword.
 */
export const KAEL_SKIN: HeroSkin = {
  colors: KAEL_COLORS,
  head: KAEL_HEAD,
  headBack: KAEL_HEAD_BACK,
  blade: KAEL_BLADE,
  parts: {
    trails: drawKaelTrails,
    arm: drawKaelArm,
    coatTails: drawKaelCoatTails,
  },
  extras: [KAEL_BACK_HAIR, KAEL_STRAP, KAEL_FRINGE],
  ramp: PAL.crystal,
  glow: PAL.crystal[3],
  sparks: SPARKS.crystal,
};
