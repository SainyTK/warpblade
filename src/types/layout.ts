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
