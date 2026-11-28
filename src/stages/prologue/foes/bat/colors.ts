import { hex, ramp } from "../../../../utils/color";

export const BAT_COLORS = {
  outline: hex("#140c10"),
  fur: ramp(["#1e120e", "#3a2418", "#5c3a26", "#86583a"]),
  furGlint: hex("#b48a60"),
  membrane: ramp(["#2a1420", "#46242e", "#6a3a3e", "#8e5650"]),
  bone: hex("#24140e"),
  belly: hex("#c8b08a"),
  bellyLit: hex("#ecdcb4"),
  bellyDark: hex("#8a7458"),
  ear: ramp(["#1e4a1c", "#2e6a26", "#4c9234", "#7cbc44"]),
  eye: hex("#ff8ad8"),
  eyeHot: hex("#ffe8fa"),
  eyeDim: hex("#b673e8"),
  fang: hex("#f2ead0"),
} as const;

export const BAT_SPARKS = [hex("#ecc8ff"), hex("#ff8ad8"), hex("#b673e8"), hex("#7a3cb0")];
