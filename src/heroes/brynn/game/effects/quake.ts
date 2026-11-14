import { WORLD_COLORS } from "../../../../constants/palette";
import { dealDamage } from "../../../../game/damage";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { createImpact } from "../../../../game/effects/impact";
import { game, lights, particles, rng } from "../../../../game/state";
import { dust, shake } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { CRIMSON, CRIMSON_SPARKS } from "../../constants/colors";

/** what one quake does: where, how far, how hard, after how long, how high it throws foes and how far up it reaches */
export interface Quake {
  x: number;
  y: number;
  reach: number;
  damage: number;
  delay: number;
  launch: number;
  height: number;
  source?: SourceId;
  /** a foe it passes by: the one a crash comes from */
  skip?: Enemy;
  onHit?: (e: Enemy) => void;
}

/**
 * The floor round Brynn heaves: two crimson rings run out, rubble jumps, and every foe near the floor within reach is
 * struck and thrown up. A quake with a delay waits, then goes off where it was set (Quake's aftershock).
 */
export function createQuake(q: Quake): Effect {
  let t = 0;
  let gone = false;
  return {
    update(dt) {
      t += dt;
      if (gone || t < q.delay) return !gone;
      gone = true;
      game.fx.push(createFloorRing(q.x, q.y, q.reach, CRIMSON, 0.45));
      game.fx.push(createFloorRing(q.x, q.y, q.reach * 0.55, CRIMSON, 0.3));
      lights.add(q.x, q.y - 6, q.reach * 0.7, CRIMSON[4], 0.7, 0.3);
      dust(q.x - 8, q.y, 6, -1);
      dust(q.x + 8, q.y, 6, 1);
      for (let i = 0; i < 12; i++)
        particles.spawn(
          PK.SHARD,
          q.x + rng.range(-q.reach, q.reach) * 0.8,
          q.y - 1,
          rng.range(-30, 30),
          rng.range(-220, -90),
          rng.range(0.4, 0.8),
          {
            col: i % 3 ? WORLD_COLORS.rubble : CRIMSON[3],
            size: rng.range(1.2, 2.8),
          },
        );
      shake(0.3, 3.5);
      for (const e of game.enemies) {
        if (e.hp <= 0 || e === q.skip || Math.abs(e.x - q.x) > q.reach || e.y < q.y - q.height || e.y > q.y + 6)
          continue;
        dealDamage(e, q.damage, {
          fromX: q.x,
          kx: Math.sign(e.x - q.x) * 30,
          launch: q.launch,
          heavy: true,
          source: q.source,
        });
        game.fx.push(createImpact(e.x, e.y - 6, Math.sign(e.x - q.x) || 1, false, CRIMSON_SPARKS));
        q.onHit?.(e);
      }
      return false;
    },
    draw() {},
  };
}
