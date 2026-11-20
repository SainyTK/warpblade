import { BASE_HERO_COLORS, type HeroColors, PAL } from "../../../../constants/palette";
import { hex } from "../../../../utils/color";
import { KAEL_COLORS } from "../colors";

/**
 * The Prism Knight's colours over Kael's: a pale violet coat, a violet scarf with the shadow ramp's dark steps, silver
 * trim in the steel steps, pale blue eyes and the blade's fill in the prism ramp.
 */
export const PRISM_COLORS: HeroColors = {
  ...KAEL_COLORS,
  coatLight: hex("#e8e4f6"),
  coat: hex("#b9b0d8"),
  coatDark: hex("#7f74a8"),
  coatDeep: hex("#4a3f72"),
  scarfLight: hex("#b673e8"),
  scarf: hex("#7a3cb0"),
  scarfDark: PAL.shadow[2],
  trimLight: BASE_HERO_COLORS.steelLight,
  trim: BASE_HERO_COLORS.steel,
  trimDark: BASE_HERO_COLORS.steelDark,
  iris: hex("#a9c8ff"),
  bladeEdge: PAL.prism[5],
  blade: PAL.prism[3],
  bladeBack: PAL.prism[2],
  bladeDeep: PAL.prism[1],
};
