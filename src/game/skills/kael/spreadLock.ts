import type { Enemy } from "../../../types/enemy";
import { game } from "../../state";

/** after a spread or a death burst reaches a foe, it cannot pass anything on again for this long (balance rule G5) */
const LOCK = 0.5;

/** the foes a skill's spread or burst reached lately, and until when they are locked */
export type SpreadLock = Map<Enemy, number>;

/** the foe was reached by a spread or a burst too lately to pass it on */
export const isLocked = (lock: SpreadLock, e: Enemy): boolean => (lock.get(e) ?? 0) > game.t;

/** a spread or a burst reached the foe: it passes nothing on for a moment */
export function lockFoe(lock: SpreadLock, e: Enemy, seconds = LOCK): void {
  lock.set(e, game.t + seconds);
}

/** forget foes that fell or whose lock ran out */
export function pruneLock(lock: SpreadLock): void {
  for (const [e, until] of lock) if (e.hp <= 0 || until <= game.t) lock.delete(e);
}
