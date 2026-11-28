import { hex, ramp } from "../../../../utils/color";

export const BELL_COLORS = {
  ice: ramp(["#0c1f3e", "#183866", "#285892", "#5d9fd4", "#cff4ff"]),
  hollow: hex("#071022"),
  rune: ramp(["#2fd49a", "#7ff6d8", "#c8fff0"]),
  clapper: ramp(["#5d84a8", "#b2e0f4", "#f4fdff"]),
} as const;
