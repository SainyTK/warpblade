import { hex, ramp } from "../../../../utils/color";

export const VINE_COLORS = {
  petal: ramp(["#3a1630", "#6a2a52", "#a24a78", "#d87aa2", "#f6b8cc"]),
  heart: hex("#2a0e3a"),
} as const;
