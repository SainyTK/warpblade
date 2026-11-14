import { dealDamage, type HitOptions } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { game } from "../../../game/state";
import { boxHit } from "../../../game/world";
import type { Enemy } from "../../../types/enemy";
import type { Box } from "../../../types/world";
import { DAWN_SPARKS } from "../constants/light";

/** foes standing whose box meets `box`, nearest to `x` first, leaving out those in `skip` */
export function foesIn(box: Box, x: number, skip?: ReadonlySet<Enemy>): Enemy[] {
  return game.enemies
    .filter((e) => e.hp > 0 && !skip?.has(e) && boxHit(box, enemyBox(e)))
    .sort((a, b) => Math.abs(a.x - x) - Math.abs(b.x - x));
}

/** foes standing whose centre is within `r` of a point */
export function foesNear(x: number, y: number, r: number, skip?: ReadonlySet<Enemy>): Enemy[] {
  return game.enemies.filter((e) => {
    if (e.hp <= 0 || skip?.has(e)) return false;
    const [ex, ey] = enemyCenter(e);
    return Math.hypot(ex - x, ey - y) <= r;
  });
}

/**
 * Light or the shield strikes each of these foes for `damage`, knocked away from `fromX`, with sparks in his colours.
 * Returns the foes it struck.
 */
export function strikeEach(foes: readonly Enemy[], damage: number, o: HitOptions & { fromX: number }): Enemy[] {
  for (const e of foes) {
    const dir = Math.sign(e.x - o.fromX) || 1;
    dealDamage(e, damage, { ...o, kx: (o.kx ?? 0) * dir });
    const [ex, ey] = enemyCenter(e);
    game.fx.push(createImpact(ex, ey, dir, !!o.heavy, DAWN_SPARKS));
  }
  return [...foes];
}
