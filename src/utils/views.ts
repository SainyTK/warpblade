import { W } from "../constants/stage";

export const inView = (left: number, x: number, margin: number): boolean => x > left - margin && x < left + W + margin;

export const inAnyView = (lefts: readonly number[], x: number, margin: number): boolean =>
  lefts.some((left) => inView(left, x, margin));
