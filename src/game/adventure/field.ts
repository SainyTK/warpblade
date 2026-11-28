import { FIELD } from "../../constants/defense";
import type { Approach } from "../../types/campaign";
import type { Platform } from "../../types/world";

export interface Field {
  width: number;
  center: number;
  platforms: readonly Platform[];
}

const overlaps = (p: Platform, x0: number, x1: number): boolean => p.x1 > x0 && p.x0 < x1;

export function buildField(approach: Approach): Field {
  const width = approach.length;
  const center = Math.round(width / 2);
  const platforms = approach.slabs.filter(
    (slab) =>
      !overlaps(slab, center - FIELD.crystalClear, center + FIELD.crystalClear) &&
      !overlaps(slab, 0, FIELD.edgeClear) &&
      !overlaps(slab, width - FIELD.edgeClear, width),
  );
  return { width, center, platforms };
}
