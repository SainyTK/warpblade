import { hex, ramp } from "../../../../utils/color";

export const SLIME_COLORS = {
  outline: hex("#140c10"),
  gel: ramp(["#1e3414", "#3a6420", "#5e9230", "#8cbc44", "#c8e47a"]),
  gelDeep: hex("#142410"),
  shine: hex("#f4fcd0"),
  moss: ramp(["#2a4a1a", "#3e6a24", "#5c9a36", "#90c850"]),
  stem: hex("#4a6a2a"),
  leaf: ramp(["#2e6a26", "#4c9234", "#7cbc44", "#b4e070"]),
  core: hex("#7a3cb0"),
  coreHot: hex("#ecc8ff"),
  eye: hex("#140c10"),
  eyeGlint: hex("#fff4d8"),
} as const;

export const SLIME_SPARKS = [hex("#c8e47a"), hex("#8cbc44"), hex("#5e9230"), hex("#3a6420")];
