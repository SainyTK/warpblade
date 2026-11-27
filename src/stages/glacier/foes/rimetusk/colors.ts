import { hex, ramp } from "../../../../utils/color";

export const TUSK_COLORS = {
  wool: ramp(["#222c48", "#3a4870", "#5e6f98", "#93a4c6", "#cfdbee"]),
  hide: ramp(["#1a223c", "#2c3858", "#465680"]),
  tusk: ramp(["#4f88b8", "#8cc6e8", "#d4f2ff", "#ffffff"]),
  hoof: hex("#0c1226"),
} as const;
