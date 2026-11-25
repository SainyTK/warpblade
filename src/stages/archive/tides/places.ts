import { W } from "../../../constants/stage";
import type { Platform } from "../../../types/world";
import { ARCHIVE_AREAS, ARCHIVE_TIDES } from "../layout";

const starts = ARCHIVE_AREAS.map((_, i) =>
  ARCHIVE_AREAS.slice(0, i).reduce((sum, previous) => sum + previous.length + W, 0),
);

export const POOLS: readonly Platform[] = ARCHIVE_TIDES.flatMap((tide, i) =>
  tide.pools.map((p) => ({ x0: p.x0 + starts[i], x1: p.x1 + starts[i], y: p.y })),
);

export const BOOK_SPOTS: readonly number[] = ARCHIVE_TIDES.flatMap((tide, i) => tide.books.map((x) => x + starts[i]));

export const inPool = (x: number): boolean => POOLS.some((p) => x > p.x0 + 2 && x < p.x1 - 2);
