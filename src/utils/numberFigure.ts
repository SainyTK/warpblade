import { DAMAGE_NUMBERS } from "../constants/damageNumbers";

/** a number as the pixel font draws it: in thousands once it grows long */
export const numberFigure = (value: number): string =>
  value < DAMAGE_NUMBERS.thousandsFrom ? String(value) : `${Math.floor(value / 1000)}K`;
