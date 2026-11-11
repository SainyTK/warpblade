import { ENEMY_COLORS as EC } from "../../../constants/palette";
import { hex, ramp } from "../../../utils/color";

/** The night foes' own tones, beside the shared ENEMY_COLORS: moonlight on shadow flesh, and their inner fire. */

/** the cool light the moon lays along the edge that faces it, and the faint light on the far edge */
export const MOON_RIM = hex("#b4c0ff");
export const BACK_RIM = hex("#5a4a96");
/** shadow flesh between its lit tone and its rim */
export const FLESH_BRIGHT = hex("#5c4290");
/** the tones of a round volume of shadow flesh, deepest shadow to glint */
export const FLESH = {
  deep: EC.bodyDeep,
  dark: EC.bodyDark,
  base: EC.body,
  light: EC.bodyLight,
  rim: EC.rim,
  glint: EC.bodyGlint,
} as const;
/** the fire inside a night foe, seen in its eyes, cracks and maw: ember to white */
export const INNER_FIRE = ramp(["#5e2c8e", "#a04ad8", "#ff7ae0", "#ffd0ff", "#fff6ff"]);
/** a dimmed eye, when the foe is stunned */
export const EYE_DULL = hex("#8a6aa8");
/** the Warden's cloak, fold shadow to moonlit fold, and its lining */
export const CLOAK = ramp(["#0c0716", "#1a1030", "#2c1c4c", "#463070"]);
export const CLOAK_LINING = hex("#5a1f6e");
/** the Warden's halo of rift light, dim to hot */
export const HALO = ramp(["#6a2cb0", "#b673e8", "#f0d8ff"]);
/** bone gold on the Warden's crown tips and mask trim */
export const CROWN_TRIM = hex("#e8c890");
