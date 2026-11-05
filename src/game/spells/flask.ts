import { FLASK_THROW } from "../../constants/spells";
import { W } from "../../constants/stage";
import type { Flask } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { enemyBox } from "../enemies/enemy";
import { game, particles, rng } from "../state";
import { boxHit, surfaceBelow } from "../world";

/** fire puffs behind a flask, `n` of them a step, up to `size` across */
export function trailFlask(o: Flask, n: number, size: number): void {
  for (let i = 0; i < n; i++)
    particles.spawn(
      PK.FIRE,
      o.x + rng.range(-1, 1),
      o.y + rng.range(-1, 1),
      -o.vx * 0.15 + rng.range(-10, 10),
      -o.vy * 0.1 - 10,
      rng.range(0.15, 0.3),
      {
        col: 0,
        size: rng.range(size * 0.6, size),
        flag: rng.chance(0.25) ? PF.SMOKES : 0,
      },
    );
}

/** move a flask one step under gravity */
export function flyFlask(o: Flask, dt: number): void {
  o.t += dt;
  o.vy += FLASK_THROW.gravity * dt;
  o.x += o.vx * dt;
  o.y += o.vy * dt;
}

/** where a flask bursts: on the first foe it touches, on the floor or a ledge, or at a stage edge; null while it flies on */
export function flaskBurst(o: Flask, dt: number, half: number): number | null {
  const hit = game.enemies.some((e) => boxHit(enemyBox(e), [o.x - half, o.y - half, o.x + half, o.y + half]));
  const floor = surfaceBelow(o.x, o.y - o.vy * dt - 1);
  if (hit || (o.vy > 0 && o.y >= floor) || o.x < 4 || o.x > W - 4) return Math.min(o.y, floor);
  return null;
}
