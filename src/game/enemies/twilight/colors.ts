import type { Ramp } from "../../../types/color";
import { hex, ramp, WHITE } from "../../../utils/color";

/** the foes leaking through the thinning veil: rune-cut stone and prism crystal */
export const TWILIGHT_COLORS = {
  outline: hex("#0b0a1a"),
  stoneDark: hex("#2a2b4c"),
  stoneShade: hex("#35375c"),
  stone: hex("#41436c"),
  stoneLight: hex("#5d608e"),
  stoneRim: hex("#8f93c4"),
  stoneDeep: hex("#191933"),
  stoneGlint: hex("#d4d8ff"),
  mossDark: hex("#1d5a62"),
  moss: hex("#2f8f8c"),
  mossTip: hex("#6ff0dc"),
  runeDim: hex("#2f7f96"),
  rune: hex("#5ee8f0"),
  runeHot: hex("#c8fff8"),
  crystalDeep: hex("#33185c"),
  crystalDark: hex("#5a2c8c"),
  crystal: hex("#9a5ae0"),
  crystalLight: hex("#d6a4ff"),
  crystalHot: hex("#f6e4ff"),
  eye: hex("#fff2a8"),
} as const;

/** the rune light: from cold teal to white hot */
export const RUNE_RAMP: Ramp = ramp(["#123a4a", "#1f6a80", "#36a8c4", "#5ee8f0", "#c8fff8"]);
/** spark ramp for rune bursts */
export const RUNE_SPARKS: Ramp = [WHITE, hex("#c8fff8"), hex("#5ee8f0"), hex("#2f7f96")];
/** the hues a prism splits light into, for wings and shards */
export const PRISM: Ramp = ramp(["#7ff6ff", "#ff8ae8", "#ffe27a", "#b08cff"]);
export const PRISM_SPARKS: Ramp = [WHITE, hex("#ffd8fa"), hex("#ff8ae8"), hex("#8a4ad0")];
