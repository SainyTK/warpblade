import { hex, ramp } from "../../../../utils/color";

export const MITE_COLORS = {
  shell: ramp(["#0c1b38", "#1b365f", "#2c5588", "#6497c4", "#d6efff"]),
  belly: hex("#0a1530"),
  leg: hex("#16244a"),
} as const;
