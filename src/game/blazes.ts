import { PK } from "../types/particle";
import { dealDamage } from "./damage";
import { enemyBox } from "./enemies/enemy";
import { game, particles, progress, rng } from "./state";
import { boxHit } from "./world";

/** blaze damage per tick as a fraction of ability power */
const BLAZE_POWER = 0.3;

/** small fires left by burning chunks, which keep burning what walks through them */
export function updateBlazes(dt: number): void {
  for (const b of game.blazes) {
    b.life -= dt;
    if (rng.chance(0.5))
      particles.spawn(
        PK.FIRE,
        b.x + rng.range(-3, 3),
        b.y - 1,
        rng.range(-6, 6),
        -rng.range(10, 25),
        rng.range(0.2, 0.4),
        {
          col: 0,
          size: rng.range(1, 2) * (b.life / b.max + 0.4),
        },
      );
    b.tick -= dt;
    if (b.tick > 0) continue;
    b.tick = 0.3;
    for (const e of game.enemies)
      if (boxHit(enemyBox(e), [b.x - 7, b.y - 14, b.x + 7, b.y])) {
        dealDamage(e, progress.stats.ap * BLAZE_POWER, { dot: true, source: "abilities" });
        e.burn = Math.max(e.burn, 1);
      }
  }
  game.blazes = game.blazes.filter((b) => b.life > 0);
}
