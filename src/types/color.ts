/** A color as 0xRRGGBB. 0 means "nothing here" in sprite and frame buffers. */
export type Color = number;
/** Colors from dark to bright. */
export type Ramp = readonly Color[];
/** A color, or a color picked along a line or by pixel position. */
export type Paint = Color | ((u: number, v?: number) => Color);
export type Alpha = number | ((u: number) => number);
