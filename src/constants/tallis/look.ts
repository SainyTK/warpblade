import { hex } from "../../utils/color";
import { PAL } from "../palette";

const G = PAL.gloam;

/**
 * His shadow form, worn in the Veil, while he pours into the pool, and by his shades: the body turns to ink the scene
 * shows through, his lit edges stay as dusk rose line work, and a rose rim runs round him, brightest at the hood.
 */
export const SHADOW_FORM = {
  /** the body's tones from its darkest to its lightest part, and the tones kept for anything brighter */
  body: [G[0], G[1], G[2]],
  lines: [G[3], G[4], G[5]],
  /** how bright a sprite pixel must be, 0 to 1, to count as a line at each of the three tones */
  lineAt: [0.3, 0.46, 0.7],
  /** how solid the ink body is; the lines are drawn in full */
  solid: 0.74,
  /** the rim from his feet to his hood, and the share of his height below which it breaks up */
  rim: [G[3], G[4], G[5]],
  rimBreak: 0.3,
  /** the lowest share of his height frays into rising wisps */
  fray: 0.34,
} as const;

/** the ink pool: its body, the wet highlights along its far edge, and the eyes looking out of it */
export const POOL = {
  deep: G[0],
  body: G[1],
  lip: G[2],
  shine: G[4],
  eye: G[5],
  eyeCore: hex("#fff0f8"),
} as const;

/** Smoke Knot's cloud: shadowed underside, body, the lit upper billows, and the dusk rose caught along the top */
export const SMOKE = {
  under: G[0],
  body: G[1],
  mid: G[2],
  lit: G[3],
  rim: G[4],
  /** how solid the cloud's heart is: a foe inside still shows through as a shape */
  solid: 0.74,
} as const;

/** the dark of Gloaming: the ink the scene sinks into and the dusk band left along the horizon */
export const DARK = {
  ink: G[0],
  dusk: hex("#4a2450"),
  /** how much deeper the dark is at the stage's edges than at its middle, and how much lighter in the dusk band */
  edge: 0.3,
  band: 0.22,
} as const;
