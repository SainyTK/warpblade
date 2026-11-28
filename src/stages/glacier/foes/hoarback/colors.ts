import { hex, ramp } from "../../../../utils/color";

export const HOARBACK_COLORS = {
  hide: ramp(["#1b2a4a", "#2d4470", "#4a6a9a", "#7a9cc6"]),
  plate: ramp(["#25406a", "#3c6898", "#6d9cc8", "#a9cfec", "#e4f4ff"]),
  frost: ramp(["#8eaccc", "#c6dcf0", "#f2f9ff"]),
  claw: hex("#0e1630"),
} as const;
