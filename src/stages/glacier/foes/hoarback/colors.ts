import { hex, ramp } from "../../../../utils/color";

export const HOARBACK_COLORS = {
  hide: ramp(["#0c1530", "#1a2a4e", "#2c4470", "#5a7aa6"]),
  plate: ramp(["#132a48", "#214a78", "#36689c", "#86bce2", "#e4f4ff"]),
  frost: ramp(["#8eaccc", "#c6dcf0", "#f2f9ff"]),
  claw: hex("#0e1630"),
} as const;
