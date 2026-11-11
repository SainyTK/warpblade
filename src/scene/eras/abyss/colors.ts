import { hex, ramp } from "../../../utils/color";

/** The colours of the abyss scene that the shared palette has no name for. */

/** the black sun's corona, from its faint outer reach to the white heat at the limb */
export const CORONA = ramp(["#1c0610", "#3c0a1a", "#6e1024", "#a81c2a", "#e4442e", "#ff8a4a", "#ffc890"]);
export const SUN = {
  core: hex("#030105"),
  /** the faint ember light just inside the black disc's edge */
  limb: hex("#3a0a14"),
  ring: hex("#fff0d8"),
  ringOuter: hex("#ffb070"),
  prominence: hex("#ff6a5a"),
  glow: hex("#b8202e"),
  shimmer: hex("#ff7a40"),
} as const;

/** the rift across the sky, from its dark lips to the white seam */
export const TEAR = ramp(["#3a0c2a", "#7a1848", "#c02a6a", "#ff6aa0", "#ffe0f0"]);

/** dim clouds of void dust behind everything */
export const NEBULA = { violet: hex("#3a1658"), crimson: hex("#6a1434"), ember: hex("#8a2a2a") } as const;

/** the tendrils that rise behind the far ridge */
export const TENDRIL = {
  body: hex("#0a040c"),
  rim: hex("#3a1028"),
  glint: hex("#7a2448"),
  bud: hex("#ff6aa0"),
} as const;

/** rift light in two hues: the white heart of a vein, its lit body, its dim end and the light it sheds on stone */
export const CRIMSON = {
  hot: hex("#ffc0d0"),
  lit: hex("#ff4a78"),
  body: hex("#9a1a40"),
  glow: hex("#c02048"),
} as const;
export const VIOLET = { hot: hex("#f0d0ff"), lit: hex("#b060f0"), body: hex("#5a2090"), glow: hex("#7a36c8") } as const;
export type RiftHue = typeof CRIMSON;
/** the dark lip of a crack in stone */
export const CRACK_EDGE = hex("#06020a");

/** thorned growth creeping over the ruins */
export const THORN = { dark: hex("#1c0a1a"), body: hex("#3e1430"), lit: hex("#7a2a4c"), tip: hex("#c8507a") } as const;

/** the torn edge of a tower top that floats loose, and the light that holds it up */
export const CHUNK = { rim: hex("#c8508a"), rimHot: hex("#ff9ac0"), glow: hex("#8a2a6a") } as const;

/** the low violet fire in the dead braziers */
export const VOID_FLAME = ramp(["#f4dcff", "#c48af0", "#7a3cc0", "#3e1a70"]);
export const VOID_FLAME_GLOW = hex("#8a4ad8");

/** ash and embers drifting up toward the rift */
export const ASH = ramp(["#3a2c3e", "#54445a", "#6e5a6a"]);
export const EMBER = ramp(["#ff9a6a", "#ff5a5a", "#d82a4a"]);
export const EMBER_GLOW = hex("#e0303a");
