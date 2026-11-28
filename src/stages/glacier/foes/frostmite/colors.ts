import { hex, ramp } from "../../../../utils/color";

export const MITE_COLORS = {
  shell: ramp(["#22406c", "#3f6a9c", "#78a4cf", "#bcd8ef", "#eef8ff"]),
  belly: hex("#1a2c50"),
  leg: hex("#16244a"),
} as const;
