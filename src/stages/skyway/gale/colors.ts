import { hex, ramp } from "../../../utils/color";

export const GALE_COLORS = {
  bolt: ramp(["#2f6cb0", "#4aa8f0", "#a8e4ff", "#f4fbff"]),
  wind: ramp(["#5a6a96", "#9aaed8", "#d4e2f8", "#ffffff"]),
  core: hex("#ffffff"),
  glow: hex("#6ab8ff"),
  dark: hex("#1a2448"),
} as const;
