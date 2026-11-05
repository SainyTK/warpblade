import { ANIM_FPS } from "../../../constants/hero";
import { WINDUP } from "../../../constants/kael/motion";
import type { Hero } from "../../../types/hero";
import { clamp } from "../../../utils/math";
import { hero } from "../../state";
import { MOVES } from "../moves";

/** seconds of clip from the start of the current move to its first blow, or null outside a move with blows */
function firstHit(h: Hero): number | null {
  if (h.state !== "move" || !h.move) return null;
  return MOVES[h.move].hits[0]?.at ?? null;
}

/** the move clock's rate: a blow that comes early runs slowed until it is out, so its wind-up reads, then full speed */
export function windupRate(): number {
  const at = firstHit(hero);
  if (at == null || hero.hitIndex > 0 || at >= WINDUP.short) return 1;
  return hero.st < at ? WINDUP.rate : 1;
}

/** animation frames a move crosses in from the last pose over: the frames before its first blow, within limits */
export function windupCross(h: Hero): number {
  const at = firstHit(h);
  if (at == null) return WINDUP.minCross;
  return clamp(Math.floor(at * ANIM_FPS) - 1, WINDUP.minCross, WINDUP.maxCross);
}
