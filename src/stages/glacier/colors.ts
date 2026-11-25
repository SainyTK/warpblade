import { hex, ramp } from "../../utils/color";

export const GLACIER = {
  void: hex("#04060d"),
  cave: ramp(["#060a16", "#0a1224", "#0e1b33", "#132842", "#183552", "#1d4262"]),
  ice: ramp(["#0f2a4a", "#173f68", "#22598a", "#3176ad", "#4f98cc", "#7cbde3", "#b2e0f4", "#e6f8ff"]),
  frostDeep: hex("#0c2140"),
  fossil: ramp(["#08162c", "#0d2140", "#173356"]),
  fossilBone: hex("#5d84a8"),
  snow: ramp(["#5d7ea6", "#8eaccc", "#bcd3ea", "#e2eefa", "#f6fbff"]),
  aurora: ramp(["#2fd49a", "#5cf0b0", "#7ff6d8", "#a4f0ff", "#b49cff", "#e494f0"]),
  water: ramp(["#020409", "#050b16", "#0a1828", "#163050"]),
  glint: hex("#f4fdff"),
  outline: hex("#060c1a"),
} as const;
