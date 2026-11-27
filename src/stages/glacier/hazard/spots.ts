import { W } from "../../../constants/stage";
import type { Approach } from "../../../types/campaign";
import { frozenCorridor, icicleCavern, lynxDen } from "../layout";

const AREAS: readonly Approach[] = [frozenCorridor, icicleCavern, lynxDen];

const AREA_ICICLES: readonly (readonly number[])[] = [
  [280, 540, 760, 1000, 1240, 1480],
  [200, 420, 600, 790, 1000, 1200, 1380, 1560, 1720],
  [360, 640, 900, 1180, 1420],
];

const AREA_SLICK: readonly (readonly (readonly [number, number])[])[] = [
  [
    [540, 596],
    [1080, 1136],
  ],
  [
    [420, 470],
    [760, 812],
    [1290, 1346],
  ],
  [
    [600, 672],
    [1200, 1256],
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
