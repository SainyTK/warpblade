import { ramp } from "../../../../utils/color";
import { GLACIER } from "../../colors";

export const COLOSSUS_COLORS = {
  stone: ramp(["#0e1d34", "#16304e", "#22476c", "#336490", "#5389b4", "#8dbcdc"]),
  ice: ramp(["#22598a", "#3176ad", "#4f98cc", "#7cbde3", "#b2e0f4", "#e6f8ff"]),
  snow: GLACIER.snow,
  core: GLACIER.aurora,
  bone: GLACIER.fossilBone,
} as const;
