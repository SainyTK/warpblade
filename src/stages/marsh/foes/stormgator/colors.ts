import { hex, ramp } from "../../../../utils/color";

export const GATOR_COLORS = {
  hideDeep: hex("#0f1712"),
  hideDark: hex("#1b281e"),
  hide: hex("#2c3e2e"),
  hideLight: hex("#4a6044"),
  hideRim: hex("#8ba272"),
  hideGlint: hex("#d8ecb8"),
  scute: hex("#232a36"),
  scuteLight: hex("#4a5470"),
  scuteDark: hex("#12151e"),
  throat: hex("#a89c6c"),
  throatLight: hex("#d0c494"),
  throatDark: hex("#5e5638"),
  throatHot: hex("#e8c0e8"),
  mouth: hex("#3a1420"),
  gum: hex("#8a3a4a"),
  tooth: hex("#ece4cc"),
  toothDark: hex("#a09478"),
  eye: hex("#ffb84a"),
  eyeHot: hex("#fff2c0"),
  weed: hex("#4e6a2c"),
  weedLight: hex("#8aa040"),
} as const;

export const SCUTE_SPARKS = ramp(["#fbe8ff", "#e09cff", "#b04ae0", "#6a1c9a"]);
