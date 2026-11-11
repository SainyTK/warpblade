import { hex } from "../../../utils/color";

/** The Unblinking's ink-black hide, from its deepest shadow to the cold violet sheen where light grazes it */
export const UNB_HIDE = {
  deep: hex("#060208"),
  dark: hex("#100714"),
  body: hex("#1c0d24"),
  sheen: hex("#4c2c60"),
  /** the folds of the lid over the eye, a shade warmer than the hide */
  fold: hex("#180a1e"),
  foldLight: hex("#3e1c48"),
  /** the lower lid flushed and swollen with a tear */
  swollen: hex("#4a1034"),
  /** the thorn lashes, dark at the root to a pale bone glint at a lit edge */
  lash: hex("#22122c"),
  lashLight: hex("#6a4478"),
} as const;

/** the eyeball's white, five tones from the wet light under the sun to the shadow under the lid */
export const UNB_SCLERA = [hex("#3c1e30"), hex("#7c5468"), hex("#b8909e"), hex("#e2cad2"), hex("#fff4f6")] as const;

/** the eyeball once it strains: the white flushed toward blood at its corners */
export const UNB_FLUSH = hex("#a8485e");

/** the veins over the white: tired red, a swollen dark red once it strains, and burning void light below half health */
export const UNB_VEIN = { calm: hex("#b0344e"), strained: hex("#7a0e28"), burning: hex("#ff6a8a") } as const;

/** the wet line along the lower lid */
export const UNB_WATERLINE = hex("#e0708a");

/** the iris, ring by ring from the dark edge to the hot fire around the pupil */
export const UNB_IRIS = {
  limbal: hex("#1e030e"),
  outerDark: hex("#4a0820"),
  outer: hex("#7c1030"),
  outerLight: hex("#b42040"),
  /** the jagged ring between the outer and inner iris, an ember band */
  collar: hex("#ff7a44"),
  inner: hex("#e0403a"),
  innerHot: hex("#ffb45a"),
  core: hex("#ffe8a8"),
} as const;

/** the pupil: a black sun ringed by a thin limb of light, ember when calm and white hot as it gazes */
export const UNB_PUPIL = {
  disc: hex("#030104"),
  /** a dull red glint deep in the pupil */
  depth: hex("#2a0610"),
  limbDim: hex("#a8303a"),
  limbWarm: hex("#ffb070"),
  limbHot: hex("#fff0d8"),
} as const;

/** the specular glints on the wet eye */
export const UNB_GLINT = hex("#ffffff");
