import { DAY_COLORS } from "../../../../game/enemies/day/colors";
import { hex, ramp } from "../../../../utils/color";

export const BASILISK_COLORS = {
  outline: DAY_COLORS.outline,
  scale: ramp(["#2e1e0c", "#5a3c14", "#8a6020", "#bc8a2e", "#e2b84c", "#fae49a"]),
  belly: ramp(["#5a4428", "#8a6e46", "#b8986a", "#e0c896"]),
  frill: ramp(["#3a1410", "#7a2a1c", "#b84a28", "#e8803e"]),
  spine: ramp(["#8c7c5a", "#d8c89c", "#fff4d8"]),
  stone: ramp(["#2c2620", "#4a4136", "#6c6150", "#94876e", "#bcae8e"]),
  moss: ramp(["#1a3418", "#2c4c22", "#467634", "#6c9e44", "#a4d060"]),
  sun: ramp(["#c87a2a", "#f2c25a", "#ffe890", "#fff8e0"]),
  maw: hex("#1e0a0c"),
  gum: hex("#7a2a30"),
  tooth: DAY_COLORS.tusk,
  toothShade: DAY_COLORS.tuskShade,
  claw: hex("#2a1d1a"),
  clawLit: hex("#5a4a44"),
  crack: DAY_COLORS.crack,
  crackHot: DAY_COLORS.crackHot,
  crackDeep: DAY_COLORS.crackDeep,
} as const;

export const BASILISK_SPARKS = {
  sun: [hex("#fff8e0"), hex("#ffe890"), hex("#f2c25a"), hex("#c87a2a")],
  rift: [hex("#ecc8ff"), hex("#b673e8"), hex("#7a3cb0"), hex("#4a2470")],
  grit: [hex("#e2d6b4"), hex("#bcae8e"), hex("#94876e"), hex("#6c6150")],
};
