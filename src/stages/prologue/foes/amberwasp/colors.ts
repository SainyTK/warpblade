import { hex, ramp } from "../../../../utils/color";

export const WASP_COLORS = {
  amber: ramp(["#5a3410", "#9a5a18", "#d88a28", "#f2b848", "#ffe08a"]),
  band: ramp(["#140c08", "#2a1a10", "#46301c"]),
  wing: hex("#cfe4ea"),
  wingEdge: hex("#7e98a4"),
  wingVein: hex("#a6c0c8"),
  wingSheen: hex("#f4fbff"),
  sting: ramp(["#4a2470", "#b673e8", "#ecc8ff"]),
} as const;
