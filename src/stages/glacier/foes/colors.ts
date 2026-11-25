import { hex, ramp } from "../../../utils/color";

export const FOE = {
  outline: hex("#070b18"),
  frost: ramp(["#2b4a78", "#5378a8", "#8eb2d8", "#c8e0f4", "#f2f9ff"]),
  frostDeep: hex("#1a2c50"),
  crystal: ramp(["#1d6a9e", "#3fa6d8", "#7fdcf6", "#c4f6ff", "#f4feff"]),
  eye: hex("#8ff6ff"),
  eyeHot: hex("#ffffff"),
  nose: hex("#141c30"),
  robe: ramp(["#1e1640", "#33286a", "#4c3e96", "#6e5cc0"]),
  fur: ramp(["#9aa8c8", "#cdd8ec", "#f2f6ff"]),
  mask: ramp(["#5a86b4", "#9cc6e6", "#dff2ff"]),
  staff: ramp(["#2a1e34", "#4a3850", "#6e5878"]),
  lynx: ramp(["#30425e", "#5a6f92", "#8ea2c2", "#bfcde2", "#e8eff8"]),
  stripe: hex("#263652"),
  amber: hex("#ffc85a"),
  amberHot: hex("#fff2c4"),
  spine: ramp(["#4b3ca8", "#7a6ae0", "#b4a8ff", "#ece6ff"]),
} as const;
