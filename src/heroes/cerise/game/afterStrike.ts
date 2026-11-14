import { movePayoff } from "../../../game/skills/payoff";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import { hero, progress } from "../../../game/state";
import { POINTS } from "../constants/points";
import { STRING_POWER } from "../constants/string";
import type { CeriseMoveId } from "../types/moves";
import { keenLungeAgain, perfectMeasure } from "./measure";
import { CERISE_MOVES } from "./moves";
import { gainPoints } from "./points";
import { cerise } from "./state";

/**
 * A move's blow is out. When it was the move's last and the move was Keen and landed: a Point, Measured Touch holds the
 * foe it paid off on, the Keen streak grows, a Keen lunge strikes again with Measured Touch's seventh level, and Perfect Measure
 * counts toward its rose star. Any other move breaks the streak.
 */
export function afterStrike(id: CeriseMoveId, hits: number): void {
  if (hero.hitIndex < CERISE_MOVES[id].hits.length) return;
  if (!hero.keen || hits === 0) {
    cerise.keenStreak = 0;
    return;
  }
  const v = skillValues("ce_measure");
  gainPoints(POINTS.keen);
  if (v.hold) holdPayoffFoe(v.hold);
  const mp = skillValues("ce_grace").mp ?? 0;
  if (mp) hero.mp = Math.min(progress.stats.mp, hero.mp + mp);
  cerise.keenStreak++;
  if (id === "longLunge" && v.twin) keenLungeAgain(STRING_POWER.longLunge * v.twin);
  if (skillEvolved("ce_measure")) perfectMeasure();
}

/** Measured Touch's third level: the foe the Keen move paid off on stands held, and only that foe */
function holdPayoffFoe(seconds: number): void {
  const foe = [...movePayoff()].find((e) => e.hp > 0);
  if (foe) foe.halt = Math.max(foe.halt, seconds);
}
