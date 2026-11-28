import { hex, ramp } from "../../../../utils/color";

export const WRAITH_COLORS = {
  shroud: ramp(["#1b2a52", "#33508a", "#6a8fc4", "#a8c9ee", "#e2f2ff"]),
  hollow: hex("#080d20"),
  bone: ramp(["#5d7ea6", "#a9c3df", "#e8f3ff"]),
  eye: hex("#7ff6d8"),
} as const;
