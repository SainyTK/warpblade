import { PAL, SPARKS } from "../../../constants/palette";
import type { HeroSkin } from "../../../types/character";
import { KAEL_BLADE } from "./blade";
import { KAEL_COLORS } from "./colors";
import { KAEL_HEAD, KAEL_HEAD_BACK } from "./head";

/**
 * How Kael looks on the shared rig: his colours, head rows and crystal longsword. He wears the shared parts as they
 * are (coat, breastplate, pauldron, scarf and ponytail), so he sets no `parts`, `extras` or `offhand`.
 */
export const KAEL_SKIN: HeroSkin = {
  colors: KAEL_COLORS,
  head: KAEL_HEAD,
  headBack: KAEL_HEAD_BACK,
  blade: KAEL_BLADE,
  ramp: PAL.crystal,
  glow: PAL.crystal[3],
  sparks: SPARKS.crystal,
};
