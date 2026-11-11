import { hex } from "../../../utils/color";

/** the Sovereign's plate: black iron with a cold violet sheen, from its deepest seam to the glint on a lit edge */
export const ARMOUR = {
  deep: hex("#06030a"),
  dark: hex("#0f0917"),
  base: hex("#1a1126"),
  light: hex("#33254a"),
  sheen: hex("#5a4880"),
  glint: hex("#b4a0d8"),
  /** the engraved trim along its plates, dull wine until the void light wakes in it */
  trim: hex("#3c0a22"),
} as const;

/** the mantle: heavy wine-dark cloth, its folds in shadow and a crimson lining that shows where it turns */
export const MANTLE = {
  deep: hex("#090207"),
  dark: hex("#150510"),
  base: hex("#23091b"),
  fold: hex("#380f29"),
  lining: hex("#5e0c2c"),
} as const;

/** the crown: ash-pale bone, the brightest thing on its body after its eyes and its blade */
export const CROWN = {
  dark: hex("#5e4656"),
  base: hex("#a88a9e"),
  light: hex("#e2cede"),
  glint: hex("#fff4fa"),
} as const;

/** the blade's grip, wrapped in dark hide */
export const GRIP = hex("#2a0c1c");
