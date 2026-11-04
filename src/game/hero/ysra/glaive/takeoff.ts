import { hero } from "../../../state";

/** where her feet last stood on a floor or a ledge */
let floorY = hero.y;

/** each frame: remember the floor under her while she stands on it */
export function noteFloor(): void {
  if (hero.ground) floorY = hero.y;
}

/** a Skyhook took over a jump just begun: she drops back onto the floor she left to wind the hook up from there, and
 *  the jump's air blow is not spent */
export function backToFloor(): void {
  const h = hero;
  if (h.ground) return;
  Object.assign(h, { y: floorY, vy: 0, ground: true, airHits: Math.max(0, h.airHits - 1) });
}
