import type { Enemy } from "../../types/enemy";
import { coop } from "../coopHooks";

/** in a co-op room, remember the hero in play as the one who set this foe burning */
export function markBurner(e: Enemy): void {
  const room = coop();
  if (!room) return;
  e.burner = {};
  room.owner(e.burner);
}

/** set a foe burning for at least this long, lit by the hero in play */
export function ignite(e: Enemy, seconds: number): void {
  e.burn = Math.max(e.burn, seconds);
  markBurner(e);
}

/** in a co-op room, act on the hero who set this foe burning, so its burn ticks hit with their power */
export function actAsBurner(e: Enemy): void {
  if (e.burner) coop()?.owner(e.burner);
}
