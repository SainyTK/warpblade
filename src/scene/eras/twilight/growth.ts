import { clamp } from "../../../utils/math";

/** how strongly the veil shows at era progress k: already there on the first wave, full by the last */
export const veilAt = (k: number): number => 0.4 + 0.6 * k;

/** whether something that appears at progress `from` is there yet */
export const grownBy = (k: number, from: number): boolean => k + 0.01 >= from;

/** the size of something that appears at `from`, as a share of its full size: 0 before, then growing for half the era */
export const sizeAt = (k: number, from: number): number =>
  grownBy(k, from) ? 0.65 + 0.35 * clamp((k - from) / 0.5) : 0;
