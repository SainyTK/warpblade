import { FIRE_RAMP } from "../../constants/palette";
import { W } from "../../constants/stage";
import { circle, glow, place, px } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { enemyBox } from "../enemies/enemy";
import { hasPerk } from "../progress";
import { game, particles, progress, rng } from "../state";
import { boxHit, surfaceBelow } from "../world";
import { explode } from "./explosion";

const RADIUS = 42;
/** damage as a multiple of ability power */
const POWER = 3.6;
const BURN = 2.5;

/** a flask of flame thrown in an arc that bursts on whatever it touches first */
export function castFire(x: number, y: number, face: number, power: number): Effect {
  const o = { x, y, vx: face * 210, vy: -140, t: 0 };
  const pyro = hasPerk("pyromancy");
  return {
    update(dt) {
      o.t += dt;
      o.vy += 520 * dt;
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      for (let i = 0; i < 2; i++)
        particles.spawn(
          PK.FIRE,
          o.x + rng.range(-1, 1),
          o.y + rng.range(-1, 1),
          -o.vx * 0.15 + rng.range(-10, 10),
          -o.vy * 0.1 - 10,
          rng.range(0.15, 0.3),
          {
            col: 0,
            size: rng.range(1.2, 2),
            flag: rng.chance(0.25) ? PF.SMOKES : 0,
          },
        );
      const hit = game.enemies.some((e) => boxHit(enemyBox(e), [o.x - 3, o.y - 3, o.x + 3, o.y + 3]));
      const floor = surfaceBelow(o.x, o.y - o.vy * dt - 1);
      if (hit || (o.vy > 0 && o.y >= floor) || o.x < 4 || o.x > W - 4) {
        explode(
          o.x,
          Math.min(o.y, floor),
          RADIUS * (pyro ? 1.5 : 1),
          POWER * progress.stats.ap * power,
          BURN * (pyro ? 1.8 : 1),
        );
        return false;
      }
      return o.t < 2;
    },
    draw() {
      place();
      circle(o.x, o.y, 2.6, FIRE_RAMP[4]);
      circle(o.x - 0.5, o.y - 0.5, 1.6, FIRE_RAMP[1]);
      px(o.x - 1, o.y - 1, WHITE);
      glow(o.x, o.y, 18, FIRE_RAMP[4], 0.5);
    },
  };
}
