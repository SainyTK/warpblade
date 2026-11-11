import { REACH } from "../../constants/combo";
import type { Enemy } from "../../types/enemy";
import type { Situation } from "../../types/move";
import { enemyBox } from "../enemies/enemy";
import { game, hero, progress } from "../state";
import { MOVES } from "./moves";

/** how far a foe is in front of Kael (negative behind), edge to edge, or null when it is out of his height band */
function gapAhead(e: Enemy): number | null {
  const [x0, y0, x1, y1] = enemyBox(e);
  if (y1 < hero.y - REACH.above || y0 > hero.y + REACH.below) return null;
  if (hero.x >= x0 && hero.x <= x1) return 0;
  return hero.face > 0 ? (x0 > hero.x ? x0 - hero.x : x1 - hero.x) : x1 < hero.x ? hero.x - x1 : hero.x - x0;
}

/** edge-to-edge distance to the nearest live foe in front at Kael's height, or infinity */
export function nearestGapAhead(): number {
  let best = Number.POSITIVE_INFINITY;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const gap = gapAhead(e);
    if (gap !== null && gap >= 0) best = Math.min(best, gap);
  }
  return best;
}

/** what the hero is doing when J is pressed, for the kit to pick the string's next blow from */
export function readSituation(): Situation {
  const h = hero;
  return {
    ground: h.ground || (h.state === "move" && !!h.move && !!MOVES[h.move].hop),
    next: h.chain + 1,
    limit: progress.comboLimit,
    running: h.running && h.state === "run",
    hanging: h.state === "hang",
    airHits: h.airHits,
    airLimit: progress.airLimit,
    doubleJumped: h.jumps >= 2,
    whirled: h.whirled,
    keen: h.keenNext,
    skills: progress.build.skills,
  };
}
