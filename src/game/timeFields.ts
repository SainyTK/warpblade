import type { EnemyRank } from "../types/enemy";
import type { Point } from "../types/world";

/**
 * An area where time runs slow for foes and their shots: a circle round a point, held open by the effect that made it
 * (Mirel's Stillfield, the clock face of her special). Foes inside act at their rank's pace and foe shots fly at
 * `shot`; a pace of 1 leaves them alone and 0 stops them. Anything that slows foes or foe shots in an area reuses this.
 */
export interface TimeField {
  at(): Point;
  radius(): number;
  /** the pace of a minion or elite, a mini boss, the Rift Warden, and a foe shot inside */
  pace: Readonly<Record<EnemyRank, number>> & { shot: number };
}

const fields = new Set<TimeField>();

/** hold a field open until `lowerField` is called with it */
export function raiseField(f: TimeField): void {
  fields.add(f);
}

export function lowerField(f: TimeField): void {
  fields.delete(f);
}

/** a new run: no field stands */
export function clearFields(): void {
  fields.clear();
}

/** the field covers this point */
export function fieldCovers(f: TimeField, x: number, y: number): boolean {
  const c = f.at();
  return Math.hypot(x - c.x, y - c.y) <= f.radius();
}

/**
 * The pace time runs at for something at this point: the slowest of every field covering it, 1 elsewhere. A foe passes
 * its rank; a foe shot passes none.
 */
export function fieldPace(x: number, y: number, rank?: EnemyRank): number {
  let pace = 1;
  for (const f of fields) {
    if (!fieldCovers(f, x, y)) continue;
    pace = Math.min(pace, rank ? f.pace[rank] : f.pace.shot);
  }
  return pace;
}
