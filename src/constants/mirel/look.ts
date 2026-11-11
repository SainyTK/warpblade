import { hex, WHITE } from "../../utils/color";
import { PAL, SAND } from "../palette";

const T = PAL.hour;

/**
 * Her clock faces, drawn to the image pixel: a bezel of two fine rings, minute marks between them, hour marks with the
 * quarters longer and brighter, a hub, and hands. The same parts dress the Stillfield, the face over a stopped foe, an
 * echo's ring and the great clock of her special.
 */
export const DIAL = {
  bezel: T[3],
  bezelInner: T[2],
  minute: T[2],
  hour: T[4],
  quarter: T[5],
  hand: T[5],
  handShade: T[3],
  hub: T[5],
  hubRing: T[3],
  /** the face's faint fill, and the light it gives off */
  fill: T[2],
  light: T[3],
  /** the flash as a face opens or tolls */
  flash: WHITE,
  /** sand hanging still inside a field */
  sand: SAND.light,
  sandShade: SAND.shade,
} as const;

/** the rim round a foe stopped in time: pale glass with brighter glints */
export const STOPPED_RIM = { glass: T[4], glint: hex("#f2fffb") } as const;
