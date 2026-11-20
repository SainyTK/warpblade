import { PAL, SPARKS } from "../../../../constants/palette";
import type { HeroSkin } from "../../../../types/character";
import { KAEL_SKIN } from "..";
import { PRISM_COLORS } from "./colors";
import { drawPrismArm } from "./pauldron";

/**
 * How Kael looks as the Prism Knight: his own figure, hair and crystal longsword in a pale violet coat with a violet
 * scarf and silver trim, a crystal pauldron on the sword arm and the blade, trails, warp line and sparks in prism light.
 */
export const PRISM_SKIN: HeroSkin = {
  ...KAEL_SKIN,
  colors: PRISM_COLORS,
  parts: { ...KAEL_SKIN.parts, arm: drawPrismArm },
  ramp: PAL.prism,
  glow: PAL.prism[3],
  sparks: SPARKS.prism,
};
