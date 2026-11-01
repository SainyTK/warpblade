import { FIRE_RAMP } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { circle, glow, place, px } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { hex, WHITE } from "../../utils/color";
import { TAU } from "../../utils/math";
import { damageEnemy } from "../combat";
import { createBlastCore } from "../effects/flash";
import { createFloorRing } from "../effects/floorRing";
import { enemyBox, enemyCenter } from "../enemies/enemy";
import { game, lights, particles, rng } from "../state";
import { boxHit, dust, hitStop, shake, surfaceBelow } from "../world";

const RADIUS = 42;
const DAMAGE = 36;

/** a flask of flame thrown in an arc that bursts on whatever it touches first */
export function castFire(x: number, y: number, face: number): Effect {
  const o = { x, y, vx: face * 210, vy: -140, t: 0 };
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
        explode(o.x, Math.min(o.y, floor));
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

/** a white core, rolling flame that cools into smoke, sparks, burning chunks that set the floor alight */
function explode(x: number, y: number): void {
  const R = rng;
  lights.add(x, y - 6, 80, hex("#ff8a2a"), 1, 0.6);
  lights.add(x, y - 6, 26, WHITE, 0.9, 0.12);
  for (let i = 0; i < 30; i++) {
    const a = R.range(Math.PI, TAU) + R.range(-0.4, 0.4);
    const sp = R.range(30, 150);
    const flag = R.chance(0.7) ? PF.SMOKES | (R.chance(0.4) ? PF.BIG : 0) : 0;
    particles.spawn(PK.FIRE, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp * 0.8, R.range(0.3, 0.7), {
      col: 0,
      size: R.range(2, 3.6),
      flag,
    });
  }
  for (let i = 0; i < 20; i++) {
    const a = R.range(Math.PI * 1.05, Math.PI * 1.95);
    const sp = R.range(160, 400);
    particles.spawn(PK.SPARK, x, y - 4, Math.cos(a) * sp, Math.sin(a) * sp, R.range(0.25, 0.7));
  }
  for (let i = 0; i < 4; i++)
    particles.spawn(PK.BRAND, x, Math.min(y - 6, GROUND - 6), R.range(-130, 130), R.range(-240, -130), 3);
  for (let i = 0; i < 8; i++)
    particles.spawn(
      PK.EMBER,
      x + R.range(-10, 10),
      y - R.range(2, 14),
      R.range(-30, 30),
      R.range(-60, -20),
      R.range(0.8, 1.6),
      { delay: R.range(0.1, 0.4) },
    );
  dust(x, y, 8);
  game.fx.push(createFloorRing(x, y, 46, [...FIRE_RAMP].reverse(), 0.45));
  game.fx.push(createBlastCore(x, y - 6, FIRE_RAMP[1]));
  for (const e of game.enemies) {
    const [ex, ey] = enemyCenter(e);
    const d = Math.hypot(ex - x, ey - y);
    if (d >= RADIUS) continue;
    damageEnemy(e, Math.round(DAMAGE * (1 - d / (RADIUS * 2))), Math.sign(ex - x) * 200, -120);
    e.burn = 2.5;
  }
  hitStop(0.06);
  shake(0.28, 3);
  sfx.boom();
}
