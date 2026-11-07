import { HERO_MOVE } from "../../constants/combat";
import { REACH } from "../../constants/combo";
import { ENEMIES } from "../../constants/enemies";
import type { Enemy } from "../../types/enemy";
import type { Situation } from "../../types/move";
import { enemyBox } from "../enemies/enemy";
import { isHeld } from "../input";
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

const isDown = (e: Enemy): boolean => !e.air && e.stun > 0 && ENEMIES[e.type].launchable;

/** the nearest live foe in front within reach, and whether any is within reach behind */
function foesAround(): { ahead: Enemy | null; behind: boolean } {
  let ahead: Enemy | null = null;
  let best = Number.POSITIVE_INFINITY;
  let behind = false;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const gap = gapAhead(e);
    if (gap === null) continue;
    if (gap >= 0 && gap < REACH.front && gap < best) {
      best = gap;
      ahead = e;
    } else if (gap < 0 && -gap < REACH.back) behind = true;
  }
  return { ahead, behind };
}

/** a foe within reach behind Kael and none in front, so a move that can turn should */
export function foeOnlyBehind(): boolean {
  const { ahead, behind } = foesAround();
  return behind && !ahead;
}

/** a foe in the air above the blade, in front of Kael and close enough to chase */
function airborneAhead(): boolean {
  return game.enemies.some(
    (e) =>
      e.hp > 0 &&
      e.air &&
      hero.y - e.y > REACH.airAbove &&
      hero.y - e.y < REACH.airHigh &&
      (e.x - hero.x) * hero.face > -4 &&
      Math.abs(e.x - hero.x) < REACH.airFront,
  );
}

/** read the world and the held keys for the combo to branch on */
export function readSituation(): Situation {
  const h = hero;
  const { ahead, behind } = foesAround();
  return {
    ground: h.ground || (h.state === "move" && !!h.move && !!MOVES[h.move].hop),
    next: h.chain + 1,
    limit: progress.comboLimit,
    up: isHeld("up"),
    down: isHeld("down"),
    running: h.running && h.state === "run",
    dashing: h.state === "dash" || h.sinceDash < HERO_MOVE.dashLink,
    hanging: h.state === "hang",
    airHits: h.airHits,
    airLimit: progress.airLimit,
    doubleJumped: h.jumps >= 2,
    whirled: h.whirled,
    foeBehindOnly: behind && !ahead,
    surrounded: behind && !!ahead,
    foeDown: !!ahead && isDown(ahead),
    foeAirborne: h.ground && airborneAhead(),
    previous: h.chain > 0 ? h.lastMove : null,
    stabbed: h.stabbed,
    keen: h.keenNext,
    skills: progress.build.skills,
  };
}
