import { ramp } from "../../../../utils/color";

export const FLIT_COLORS = {
  down: ramp(["#7f93bc", "#b9c8e4", "#e6eefa", "#ffffff"]),
  wing: ramp(["#1e3f6e", "#2f6698", "#5b9ccb", "#a6d8f2"]),
} as const;
