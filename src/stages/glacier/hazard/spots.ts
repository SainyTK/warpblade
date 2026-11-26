import { W } from "../../../constants/stage";
import type { Approach } from "../../../types/campaign";
import { frozenCorridor, icicleCavern, lynxDen } from "../layout";

const AREAS: readonly Approach[] = [frozenCorridor, icicleCavern, lynxDen];

const AREA_ICICLES: readonly (readonly number[])[] = [
  [158, 302, 456, 598, 764],
  [138, 214, 332, 404, 558, 642, 784, 868],
  [150, 330, 520, 640, 764],
];

const AREA_SLICK: readonly (readonly (readonly [number, number])[])[] = [
  [
    [376, 428],
    [688, 742],
  ],
  [
    [296, 346],
    [556, 604],
    [876, 930],
  ],
  [
    [326, 398],
    [636, 690],
  ],
];

const starts = AREAS.reduce<number[]>(
  (acc, _area, i) => [...acc, i === 0 ? 0 : acc[i - 1] + AREAS[i - 1].length + W],
  [],
);

export const ICICLE_SPOTS: readonly number[] = AREA_ICICLES.flatMap((xs, i) => xs.map((x) => starts[i] + x));

export const SLICK_STRIPS: readonly (readonly [number, number])[] = AREA_SLICK.flatMap((strips, i) =>
  strips.map(([x0, x1]) => [starts[i] + x0, starts[i] + x1] as const),
);
