import { hex, ramp } from "../../../../utils/color";

export const LORD_COLORS = {
  outline: hex("#06050c"),
  steel: ramp(["#0c0c1c", "#1c1e36", "#30355a", "#4c5680", "#7e8ab6", "#c4d0f6"]),
  dark: ramp(["#0c0b18", "#1a1a30", "#2c2e4a", "#444868"]),
  cloak: ramp(["#0a0814", "#181026", "#2a1c40", "#40305e"]),
  lining: hex("#6a2a7e"),
  leather: ramp(["#1c1210", "#3a2620", "#5c4030"]),
  brass: ramp(["#4a3418", "#8a6a34", "#d2a85c", "#f4dca0"]),
  rune: ramp(["#5e2c8e", "#a04ad8", "#ff7ae0", "#ffd0ff", "#fff6ff"]),
  slit: hex("#05040a"),
  rust: hex("#7a3e2a"),
} as const;
