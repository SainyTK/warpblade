import { SEAT_COLORS } from "../../constants/coop";
import { ellipseRing, place } from "../../engine/frame";
import { hex } from "../../utils/color";
import { hero } from "../state";
import { surfaceBelow } from "../world";

/** the ring on the floor under a player's hero, in art pixels across and deep */
const RING = { rx: 9, ry: 2.5, alpha: 0.85 } as const;

/** a ring in the player's colour on the floor under the hero in play, so heroes who look alike can be told apart */
export function drawMark(slot: number): void {
  if (hero.state === "dead") return;
  place();
  const floor = hero.ground ? hero.y : surfaceBelow(hero.x, hero.y);
  ellipseRing(hero.x, floor, RING.rx, RING.ry, hex(SEAT_COLORS[slot]), RING.alpha);
}
