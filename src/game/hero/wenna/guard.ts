import { WICK } from "../../../constants/wenna/wick";
import type { Wick } from "../../../types/wenna";
import { hero } from "../../state";
import { heroGuarded } from "../guard";
import { hurtWick, isUp, liveWicks } from "./wicks";

/** her Wick that stands between her and a blow from this side, nearest her first, or null */
function shield(fromX: number): Wick | null {
  // a shot dropping from straight above has no side: a Wick on either side may take it
  const side = Math.abs(fromX - hero.x) <= WICK.fromAbove ? 0 : Math.sign(fromX - hero.x);
  let best: Wick | null = null;
  for (const w of liveWicks()) {
    if (!isUp(w) || w.guard > 0) continue;
    const dx = w.x - hero.x;
    if (Math.abs(dx) > WICK.guardReach || Math.abs(w.y - hero.y) > 16) continue;
    if (side !== 0 && Math.sign(dx) !== side && Math.abs(dx) > 2) continue;
    if (!best || Math.abs(dx) < Math.abs(best.x - hero.x)) best = w;
  }
  return best;
}

/**
 * A blow or shot about to land on her from a side where her Wick stands near her lands on the Wick instead, which takes
 * all of it while she takes nothing. One Wick takes at most one blow each `WICK.guard` seconds, so a fast flurry still
 * reaches her through a single Wick.
 */
export function interceptBlow(dmg: number, fromX: number): boolean {
  if (heroGuarded()) return false;
  const w = shield(fromX);
  if (!w) return false;
  w.guard = WICK.guard;
  hurtWick(w, dmg);
  hero.inv = Math.max(hero.inv, 0.05);
  return true;
}
