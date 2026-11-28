import { hex, ramp } from "../../../../utils/color";

export const SEER = {
  outline: hex("#0b0a10"),
  skinDeep: hex("#13212a"),
  skinDark: hex("#23404c"),
  skin: hex("#386270"),
  skinLight: hex("#5e8e98"),
  skinRim: hex("#9cc4c8"),
  throat: hex("#c07a34"),
  throatLight: hex("#eaa85a"),
  throatDark: hex("#7a4420"),
  spot: hex("#182a32"),
  gill: hex("#7a4aa8"),
  gillLight: hex("#b07ae0"),
  gillDeep: hex("#3e2260"),
  weave: hex("#262c12"),
  sash: hex("#6a3a22"),
  sashLight: hex("#9a5a32"),
  staff: hex("#3e2a1a"),
  staffLight: hex("#6e4c2e"),
  staffDark: hex("#1e140c"),
  eye: hex("#e8d4ff"),
} as const;

export const SPEAR = ramp(["#2e4058", "#5c7896", "#9ab4d0", "#d2e2f2", "#f4faff"]);

export const SEER_HITS = { spear: 20, touch: 8 } as const;
