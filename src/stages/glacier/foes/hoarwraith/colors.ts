import { hex, ramp } from "../../../../utils/color";

export const WRAITH_COLORS = {
  shroud: ramp(["#0a1130", "#172759", "#29427e", "#5279b4", "#cfe6ff"]),
  hollow: hex("#080d20"),
  bone: ramp(["#5d7ea6", "#a9c3df", "#e8f3ff"]),
  eye: hex("#5cf0b0"),
} as const;
