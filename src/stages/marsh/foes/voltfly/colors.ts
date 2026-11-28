import { hex, ramp } from "../../../../utils/color";

export const VOLTFLY_COLORS = {
  shellDeep: hex("#0e1426"),
  shellDark: hex("#1a2546"),
  shell: hex("#2c3f72"),
  shellLight: hex("#4f6aa8"),
  shellRim: hex("#9fb8ec"),
  ring: hex("#121a34"),
  vein: hex("#b673e8"),
  veinHot: hex("#ecd2ff"),
  veinDeep: hex("#5e3292"),
  eyeDark: hex("#1c4a3a"),
  eye: hex("#3f9a6e"),
  eyeLight: hex("#8ee0a8"),
  eyeGlint: hex("#e8fff0"),
  wing: hex("#5b6d90"),
  wingLight: hex("#b4c6e4"),
  wingDark: hex("#3a4864"),
  wingVein: hex("#2c3a56"),
  leg: hex("#141a2c"),
  outline: hex("#0b0a10"),
  wetSky: hex("#a9bace"),
} as const;

export const VOLT_SPARKS = ramp(["#fbe8ff", "#e09cff", "#b04ae0", "#6a1c9a"]);
