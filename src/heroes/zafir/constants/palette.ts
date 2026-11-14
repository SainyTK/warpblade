import type { Color } from "../../../types/color";
import { hex, ramp, WHITE } from "../../../utils/color";

/** Zafir's colour family, saffron and sun-baked sand: his slashes, rings, afterimages and warp line, dark to bright */
export const SAND_RAMP = ramp(["#2a1408", "#5e2c10", "#a4501a", "#e08a2a", "#f8b84a", "#ffe4a0", "#fffbe8"]);
/** the sparks where his blows land, white to dark */
export const SAND_SPARKS = [WHITE, hex("#ffe4a0"), hex("#f8b84a"), hex("#c46a1a")];
/** the menu accent: his tile, frame, stat bars and ability tabs */
export const ZAFIR_ACCENT = "#f2a03a";
/** grains of sand in his wind, pale to deep */
export const GRAIN: readonly Color[] = [hex("#fff0c8"), hex("#f0cf8a"), hex("#d8a858"), hex("#a8763a")];
/** the red of an open wound: the drops a bleeding foe sheds */
export const WOUND_RED: readonly Color[] = [hex("#ffb0a0"), hex("#e0403a"), hex("#8e1a20")];
