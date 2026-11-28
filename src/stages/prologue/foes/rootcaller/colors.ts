import { DAY_COLORS } from "../../../../game/enemies/day/colors";
import { hex, ramp } from "../../../../utils/color";

export const ROOTCALLER_COLORS = {
  outline: DAY_COLORS.outline,
  bark: DAY_COLORS.bark,
  barkDeep: DAY_COLORS.barkDeep,
  barkGlint: DAY_COLORS.barkGlint,
  root: ramp(["#2a1c12", "#46301e", "#664830", "#8c6a46"]),
  mask: ramp(["#8a7a5c", "#bcab86", "#e2d4b0", "#f6eed6"]),
  antler: ramp(["#4a3a28", "#7a6446", "#a8906a", "#d6c49c"]),
  moss: ramp(["#1a3418", "#2c4c22", "#467634", "#6c9e44", "#a4d060"]),
  leaf: DAY_COLORS.leaf,
  seed: ramp(["#4a2470", "#7a3cb0", "#b673e8", "#ecc8ff"]),
  seedHusk: hex("#5a3a20"),
  eye: DAY_COLORS.eye,
  crack: DAY_COLORS.crack,
  crackHot: DAY_COLORS.crackHot,
  crackDeep: DAY_COLORS.crackDeep,
} as const;

export const ROOTCALLER_SPARKS = {
  rift: [hex("#ecc8ff"), hex("#b673e8"), hex("#7a3cb0"), hex("#4a2470")],
  bark: [hex("#c8a472"), hex("#a07c50"), hex("#5a3e26"), hex("#3c2818")],
  leaf: [hex("#d8f0a0"), hex("#7cbc44"), hex("#4c9234"), hex("#2e6a26")],
};
