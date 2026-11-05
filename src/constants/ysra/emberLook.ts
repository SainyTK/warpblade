import { hex } from "../../utils/color";
import { EMBER } from "../characters/ysra/look";

/** Ysra's ember ramp, dark to white, for her rites */
export const RITE_RAMP = EMBER;
/** the same ramp hottest first, for sparks and embers that cool as they fly */
export const RITE_SPARKS = [EMBER[6], EMBER[5], EMBER[4], EMBER[3]];
/** the brazier's iron and bronze */
export const BRAZIER_COLORS = {
  outline: hex("#140a10"),
  iron: hex("#3a2a2c"),
  ironLight: hex("#5e4440"),
  bronze: hex("#d08a3c"),
} as const;
