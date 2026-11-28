import { hex, ramp } from "../../../../utils/color";

export const COLOSSUS_COLORS = {
  stone: ramp(["#060b18", "#0b1528", "#13233e", "#1d3456", "#2b4a72", "#46698f"]),
  ice: ramp(["#0f2b4c", "#18436e", "#25609a", "#3f88c2", "#86c8ec", "#e6f8ff"]),
  snow: ramp(["#5d7ea6", "#8eaccc", "#bcd3ea", "#e2eefa"]),
  core: ramp(["#0c5a4a", "#2fd49a", "#5cf0b0", "#a8ffe0", "#f2fff9"]),
  ember: hex("#ffc85a"),
  emberHot: hex("#fff2c4"),
  socket: hex("#03060e"),
} as const;
