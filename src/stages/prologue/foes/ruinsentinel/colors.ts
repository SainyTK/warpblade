import { DAY_COLORS } from "../../../../game/enemies/day/colors";
import { hex, ramp } from "../../../../utils/color";

export const SENTINEL_COLORS = {
  outline: DAY_COLORS.outline,
  stone: ramp(["#2c2620", "#4a4136", "#6c6150", "#94876e", "#bcae8e"]),
  stoneDeep: hex("#1a1612"),
  stoneGlint: hex("#e2d6b4"),
  shield: ramp(["#30281f", "#544534", "#7a6648", "#a08a62"]),
  sun: hex("#d8a848"),
  sunLit: hex("#f2d080"),
  sunDim: hex("#8a6a34"),
  moss: ramp(["#1a3418", "#2c4c22", "#3e662c", "#5c8a3a", "#86b04e"]),
  shaft: DAY_COLORS.bark,
  crack: DAY_COLORS.crack,
  crackHot: DAY_COLORS.crackHot,
  crackDeep: DAY_COLORS.crackDeep,
  eye: DAY_COLORS.eye,
} as const;

export const SENTINEL_SPARKS = {
  grit: [hex("#e2d6b4"), hex("#bcae8e"), hex("#94876e"), hex("#6c6150")],
  rift: [hex("#ecc8ff"), hex("#b673e8"), hex("#7a3cb0"), hex("#4a2470")],
};
