import { hex, ramp, WHITE } from "../../../utils/color";

export const VEIL = {
  outline: hex("#0b0a1a"),
  stone: ramp(["#141428", "#232445", "#35375c", "#4b4e7c", "#6e72a6", "#a6aadc"]),
  crystal: ramp(["#33185c", "#5a2c8c", "#9a5ae0", "#d6a4ff", "#f6e4ff"]),
  rune: ramp(["#123a4a", "#1f6a80", "#36a8c4", "#5ee8f0", "#c8fff8"]),
  aurora: ramp(["#123c4a", "#1f8a7a", "#3fe0a8", "#a8ffd8", "#f0fff6"]),
  veil: ramp(["#2a1048", "#5a2a9a", "#b06ae8", "#ff9ae8"]),
  prism: ramp(["#7ff6ff", "#ff8ae8", "#ffe27a", "#b08cff"]),
  robe: ramp(["#1e1238", "#38246a", "#5a3e98", "#8a6ccc"]),
  eye: hex("#fff2a8"),
  eyeHot: WHITE,
} as const;

export const CRYSTAL_SPARKS = [WHITE, hex("#f6e4ff"), hex("#d6a4ff"), hex("#9a5ae0")];
export const RUNE_SPARKS = [WHITE, hex("#c8fff8"), hex("#5ee8f0"), hex("#2f7f96")];
export const AURORA_SPARKS = [WHITE, hex("#a8ffd8"), hex("#3fe0a8"), hex("#b06ae8")];
