import { dealDamage } from "../../../game/damage";
import { enemyCenter } from "../../../game/enemies/enemy";
import { game, hero } from "../../../game/state";
import type { SourceId } from "../../../types/build";
import type { Enemy } from "../../../types/enemy";
import { roundBlast } from "./effects/roundBlast";

/** a round's blast on a foe: its damage there, a splash on foes close by, and how it throws them */
export interface RoundBlast {
  damage: number;
  /** damage to each other foe within `reach` of the blast */
  splash: number;
  reach: number;
  kx: number;
  ky?: number;
  stagger?: number;
  /** breaks a guard and a wind-up */
  heavy?: boolean;
  /** drawn hot (gold) */
  hot: boolean;
  /** drawn and heard as a heavy round */
  big?: boolean;
  /** what dealt it: the hero's own press when left out, a skill's id when the skill fires on its own */
  source?: SourceId;
}

/** the other foes inside the splash of a blast at (x, y) */
function splashed(x: number, y: number, reach: number, skip: Enemy | null): Enemy[] {
  return game.enemies.filter((e) => {
    if (e === skip || e.hp <= 0) return false;
    const [ex, ey] = enemyCenter(e);
    return Math.hypot(ex - x, ey - y) <= reach;
  });
}

/**
 * A round goes off in a foe, or at a point when `foe` is null: the blast's look and sound there, its damage on the foe,
 * and its splash on every other foe close by. Returns the foes it struck, the first foe first.
 */
export function blastAt(foe: Enemy | null, x: number, y: number, b: RoundBlast): Enemy[] {
  const dir = Math.sign(x - hero.x) || hero.face;
  roundBlast(x, y, dir, b.hot, !!b.big);
  const struck: Enemy[] = [];
  const opts = { fromX: hero.x, ky: b.ky ?? -30, stagger: b.stagger, heavy: b.heavy, source: b.source };
  if (foe && foe.hp > 0) {
    dealDamage(foe, b.damage, { ...opts, kx: dir * b.kx });
    struck.push(foe);
  }
  if (b.splash <= 0) return struck;
  for (const e of splashed(x, y, b.reach, foe)) {
    dealDamage(e, b.splash, { ...opts, kx: (Math.sign(e.x - x) || dir) * b.kx * 0.6 });
    struck.push(e);
  }
  return struck;
}

/** a round goes off in a foe, at its centre */
export function blastFoe(foe: Enemy, b: RoundBlast): Enemy[] {
  const [x, y] = enemyCenter(foe);
  return blastAt(foe, x, y, b);
}
