import { hex, ramp } from "../../../utils/color";

export const SHADE_COLORS = {
  outline: hex("#08060f"),
  cloakDeep: hex("#0e0c1a"),
  cloakDark: hex("#1a1830"),
  cloak: hex("#2a2a4a"),
  cloakLight: hex("#46487a"),
  rim: hex("#a8b4f0"),
  tatter: hex("#22203c"),
  hollow: hex("#05040a"),
  mask: hex("#d6cfbd"),
  maskLight: hex("#f4eedc"),
  maskShade: hex("#948a78"),
  brassDark: hex("#4a3418"),
  brass: hex("#8a6a34"),
  brassLight: hex("#d2a85c"),
  glass: hex("#2a6a64"),
  flameDeep: hex("#1f7a6c"),
  flame: hex("#5fe0c0"),
  flameLight: hex("#bff7e6"),
  flameCore: hex("#f4fffa"),
  gloom: hex("#04030a"),
} as const;

export const GHOST_SPARKS = ramp(["#f4fffa", "#bff7e6", "#5fe0c0", "#1f7a6c"]);

export const SHADE_HITS = {
  flame: 14,
} as const;
