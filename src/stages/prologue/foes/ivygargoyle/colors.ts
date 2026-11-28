import { DAY_COLORS } from "../../../../game/enemies/day/colors";
import { hex, ramp } from "../../../../utils/color";

export const GARGOYLE_COLORS = {
  outline: DAY_COLORS.outline,
  slate: ramp(["#1c2026", "#33393f", "#4f565c", "#737b80", "#9fa6a6"]),
  slateGlint: hex("#d6dcd2"),
  wing: ramp(["#202429", "#2e3439", "#454c50", "#61686a"]),
  ivy: ramp(["#16301a", "#24482a", "#386636", "#5a8c42", "#8cb85a"]),
  crack: DAY_COLORS.crack,
  crackHot: DAY_COLORS.crackHot,
  crackDeep: DAY_COLORS.crackDeep,
  eye: DAY_COLORS.eye,
  horn: ramp(["#3a3428", "#6a604a", "#9a8e70", "#c8bc98"]),
  claw: hex("#d8d0b8"),
} as const;

export const GARGOYLE_SPARKS = {
  chip: [hex("#d6dcd2"), hex("#9fa6a6"), hex("#737b80"), hex("#4f565c")],
  rift: [hex("#ecc8ff"), hex("#b673e8"), hex("#7a3cb0"), hex("#4a2470")],
};
