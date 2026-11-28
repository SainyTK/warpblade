import { hex, ramp } from "../../../../utils/color";

export const BELL_COLORS = {
  ice: ramp(["#173f68", "#2a6898", "#4f98cc", "#8fd0ef", "#d8f6ff"]),
  hollow: hex("#071022"),
  rune: ramp(["#2fd49a", "#7ff6d8", "#c8fff0"]),
  clapper: ramp(["#5d84a8", "#b2e0f4", "#f4fdff"]),
} as const;
