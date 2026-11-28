import { hex, ramp } from "../../../../utils/color";

export const TUSK_COLORS = {
  wool: ramp(["#121830", "#222c4c", "#36456e", "#6a7fa8", "#c4d2ea"]),
  hide: ramp(["#0c1226", "#1a2442", "#2c3a60"]),
  tusk: ramp(["#4f88b8", "#8cc6e8", "#d4f2ff", "#ffffff"]),
  hoof: hex("#0c1226"),
} as const;
