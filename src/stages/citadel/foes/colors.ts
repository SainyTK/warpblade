import { hex, ramp } from "../../../utils/color";

export const ECLIPSE = ramp(["#2a0a12", "#6a1a1c", "#b8442a", "#f0a040", "#ffe6a8", "#fffaf0"]);

export const CITADEL_FOE = {
  ink: hex("#05020a"),
  iron: ramp(["#07040c", "#120b1c", "#1f152e", "#35284a", "#5c4a80", "#a894cc"]),
  tabard: ramp(["#12040c", "#2a0a1c", "#46122e", "#6e1c40"]),
  bone: ramp(["#4a3644", "#8c7084", "#cdb6c4", "#fbeef4"]),
  wing: ramp(["#0c0614", "#1e1230", "#36224e", "#5a3e7c"]),
  sigil: hex("#ff6a8a"),
} as const;
