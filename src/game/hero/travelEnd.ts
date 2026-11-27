import { aftershock } from "./aftershock";

/**
 * Every kit calls this when one of its travel moves ends: a dash, a warp, a dive, a hop. It is the one place
 * where Armory gear that answers a hero's movement hook in, so they work for every hero without naming any move.
 */
export function travelEnded(): void {
  aftershock();
}
