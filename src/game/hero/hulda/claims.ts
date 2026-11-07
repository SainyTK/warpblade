import { HOLD } from "../../../constants/hulda/grab";
import type { Enemy } from "../../../types/enemy";
import { game } from "../../state";

/**
 * Foes in someone's hands, shared by every Hulda in a room: the game time each was last held. A hold counts only while
 * its owner keeps refreshing it, so a hero who falls or leaves the room lets go without having to say so.
 */
const claims = new Map<Enemy, number>();

/** this foe is in a hero's hands right now */
export const isClaimed = (e: Enemy): boolean => game.t - (claims.get(e) ?? Number.NEGATIVE_INFINITY) < HOLD.claim;

/** keep this foe claimed for another moment */
export function claim(e: Enemy): void {
  claims.set(e, game.t);
}

/** let go of the claim */
export function unclaim(e: Enemy): void {
  claims.delete(e);
}

/** a fresh run holds nothing */
export function clearClaims(): void {
  claims.clear();
}
