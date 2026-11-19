/** distances in CSS pixels, such as the safe area a phone keeps clear of its notch and home bar */
export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** where the stage and the backdrop around it go, in device pixels */
export interface StageLayout {
  /** device pixels per art pixel, a whole number */
  scale: number;
  stageX: number;
  stageY: number;
  /** the backdrop covers the whole screen in art pixels; the stage sits at (artLeft, artTop) inside it */
  cols: number;
  rows: number;
  artLeft: number;
  artTop: number;
  backdropX: number;
  backdropY: number;
}

/**
 * the HUD sits over the top of the stage, or above the stage in the room the screen leaves there: in full under the
 * pause button, or compact on either side of it
 */
export type HudPlace = "inside" | "compact" | "outside";

/** the HUD's height in CSS pixels in each layout above the stage, at its largest in the run */
export interface HudHeights {
  outside: number;
  compact: number;
}
