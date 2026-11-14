import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { game, hero } from "../../../game/state";
import { boxHit, hitStop, markStruck, shake, struckThisSwing } from "../../../game/world";
import type { HeroSource } from "../../../types/build";
import type { Enemy } from "../../../types/enemy";
import type { HitFeel } from "../../../types/move";
import type { Box } from "../../../types/world";
import { lerp } from "../../../utils/math";

/** a thrust of an ability or the ultimate: its damage, push and feel, and the source it counts for */
export interface PointHit {
  damage: number;
  source: HeroSource;
  kx: number;
  ky?: number;
  launch?: number;
  stagger?: number;
  stun?: number;
  heavy?: boolean;
  sureCrit?: boolean;
  feel?: HitFeel;
}

/**
 * Strike every foe in the boxes that this swing has not struck yet, nearest first, as a blow of Cerise's own that
 * counts for an ability or the ultimate (a combo blow goes through `meleeHit`). Returns the foes struck.
 */
export function pointStrike(boxes: readonly Box[], hit: PointHit): Enemy[] {
  const struck = game.enemies
    .filter((e) => e.hp > 0 && !struckThisSwing(e) && boxes.some((b) => boxHit(b, enemyBox(e))))
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  for (const e of struck) {
    markStruck(e);
    const dir = Math.sign(e.x - hero.x) || hero.face;
    dealDamage(e, hit.damage, {
      fromX: hero.x,
      kx: hit.kx * dir,
      ky: hit.ky ?? 0,
      launch: hit.launch,
      stagger: hit.stagger,
      stun: hit.stun,
      heavy: hit.heavy,
      melee: true,
      sureCrit: hit.sureCrit,
      source: hit.source,
    });
    const [ex, ey] = enemyCenter(e);
    game.fx.push(createImpact(lerp(hero.x + dir * 10, ex, 0.7), ey, dir, !!hit.heavy));
  }
  if (struck.length && hit.feel) {
    hitStop(hit.feel.stop);
    shake(hit.feel.shake[0], hit.feel.shake[1]);
  }
  return struck;
}
