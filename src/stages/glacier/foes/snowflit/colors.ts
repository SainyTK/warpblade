import { ramp } from "../../../../utils/color";

export const FLIT_COLORS = {
  down: ramp(["#34446e", "#7487b4", "#bccbe6", "#f4f8ff"]),
  wing: ramp(["#0c1f40", "#1b3d6c", "#3569a0", "#9fd2f0"]),
} as const;
