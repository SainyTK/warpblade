import { CLIPS } from "../../../constants/clips";
import { CANDLE_WARP } from "../../../constants/wenna/warp";
import type { Enemy } from "../../../types/enemy";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { shake, surfaceBelow } from "../../world";
import { releaseWeapon } from "../warp";
import { flareSparks, thread, wickLeaves } from "./candleWarpLook";
import { wenna, wennaHost } from "./memory";
import { markQuarry } from "./quarry";
import { cappedWicks, isUp, liveWicks, spawnWick, weakestWick, wickCap } from "./wicks";

/** Changeling Step, the skill that shapes her warp */
export const STEP = "w_swap";

type Spot = { x: number; y: number };

/** her farthest standing Wick ahead within reach of a warp: Changeling Step reaches further */
function farthestWickAhead(): Wick | null {
  const reach = skillValues(STEP).range ?? CANDLE_WARP.wickReach;
  const ahead = liveWicks().filter(
    (w) => isUp(w) && (w.x - hero.x) * hero.face > 2 && Math.hypot(w.x - hero.x, w.y - hero.y) <= reach,
  );
  if (!ahead.length) return null;
  return ahead.reduce((a, b) => ((b.x - hero.x) * hero.face > (a.x - hero.x) * hero.face ? b : a));
}

/** the shared throw found no foe ahead: the candle goes to her farthest Wick ahead instead, and she trades places */
function aimAtWick(): void {
  const target = hero.warpTarget;
  if (!target || target.enemy || target.aim) return;
  const w = farthestWickAhead();
  if (!w) return;
  wennaHost.swapWick = w;
  // the shared warp lands her this far under the point it threw at
  hero.warpTarget = { x: w.x, y: w.y - 18 };
}

/**
 * Before the shared throw lets go: she keeps where she stands, where the candle's Wick is left, and a throw with no foe
 * to go to goes to her farthest Wick ahead. Out of the throw both are forgotten.
 */
export function tickCandleWarp(): void {
  const h = hero;
  if (h.state !== "throw" && h.state !== "throwWait") {
    wenna.warpFrom = null;
    wennaHost.swapWick = null;
    return;
  }
  const first = !wenna.warpFrom;
  wenna.warpFrom = { x: h.x, y: h.y };
  if (first) aimAtWick();
}

/**
 * The throw's release frame, run by her kit before the shared runner: the candle leaves her hand through the shared
 * release, and her lamp pole stays in her other hand, where the shared release would put the weapon away. True when it
 * let go.
 */
export function releaseCandle(): boolean {
  if (hero.state !== "throw" || hero.st < CLIPS.throw.hit) return false;
  releaseWeapon();
  hero.hasSword = true;
  return true;
}

/** a Wick she traded places with arrives where she stood in a flare that throws the foes near it away */
function arriveInFlare(w: Wick, from: Spot): void {
  const v = skillValues(STEP);
  wickLeaves(w.x, w.y);
  Object.assign(w, { x: from.x, y: surfaceBelow(from.x, from.y - 1), vx: 0, vy: 0, ground: true, target: null });
  if (v.heal) w.hp = w.max;
  const power = CANDLE_WARP.flare * (1 + (v.flare ?? 0));
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - w.x, cy - (w.y - 8)) > CANDLE_WARP.flareReach + 6) continue;
    const kx = Math.sign(cx - w.x) * CANDLE_WARP.flareKnock;
    dealDamage(e, progress.stats.ap * power, { fromX: w.x, kx, ky: -40, source: "abilities" });
  }
  flareSparks(w.x, w.y);
  shake(0.1, 1.5);
}

/** the thrown candle stands up as a short-lived Wick where she stood; at the cap her weakest Wick takes her place */
function leaveCandle(from: Spot): Wick | null {
  if (cappedWicks().length < wickCap()) {
    const life = skillValues(STEP).life ?? CANDLE_WARP.wickLife;
    return spawnWick(from.x, from.y, "warp", { life });
  }
  const w = weakestWick();
  if (!w) return null;
  wickLeaves(w.x, w.y);
  Object.assign(w, { x: from.x, y: surfaceBelow(from.x, from.y - 1), vx: 0, vy: 0, ground: true, target: null });
  return w;
}

/**
 * The warp's arrival extra: the foe she warped to becomes her Quarry, and a Wick stands where she stood, the one she
 * traded places with (arriving in a flare) or the candle she threw. A thread of flame joins the two spots. With Mirror
 * Wick a free Wick lights beside her too.
 */
export function candleArrived(foe: Enemy | null): void {
  const to = { x: hero.x, y: hero.y };
  const from = wenna.warpFrom ?? to;
  if (foe) markQuarry(foe);
  const traded = wennaHost.swapWick && wennaHost.swapWick.melt < 0 ? wennaHost.swapWick : null;
  wennaHost.swapWick = null;
  if (traded) arriveInFlare(traded, from);
  const wick = traded ?? leaveCandle(from);
  thread(from.x, from.y, to.x, to.y);
  if (skillValues(STEP).mirror && cappedWicks().length < wickCap()) spawnWick(to.x - hero.face * 8, to.y, "skill");
  if (wick) emitSkillEvent({ type: "swap", from, to, wick });
}
