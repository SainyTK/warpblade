import { DAMAGE_NUMBERS } from "../constants/damageNumbers";

/** a number as the pixel font draws it: in thousands once it grows long */
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;

export function numberFigure(value: number): string {
  if (value < DAMAGE_NUMBERS.thousandsFrom) return String(value);
  if (value < MILLION) return `${Math.floor(value / 1000)}K`;
  if (value < BILLION) return `${Math.floor(value / MILLION)}M`;
  return `${Math.floor(value / BILLION)}B`;
}
