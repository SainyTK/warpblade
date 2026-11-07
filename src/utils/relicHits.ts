import type { Enemy } from "../types/enemy";

/** one projectile or shard that struck a foe, and when it may strike that foe again */
export interface RelicHit {
  e: Enemy;
  /** the projectile or shard */
  key: number;
  until: number;
}

/** true when this projectile may strike this foe now; marks the strike when it may */
export function takeHit(hits: RelicHit[], e: Enemy, key: number, now: number, gap: number): boolean {
  for (const h of hits) {
    if (h.e !== e || h.key !== key) continue;
    if (h.until > now) return false;
    h.until = now + gap;
    return true;
  }
  hits.push({ e, key, until: now + gap });
  return true;
}

/** drop the strikes whose wait is over or whose foe is gone */
export function pruneHits(hits: RelicHit[], now: number): void {
  let n = 0;
  for (const h of hits) if (h.until > now && h.e.hp > 0) hits[n++] = h;
  hits.length = n;
}
