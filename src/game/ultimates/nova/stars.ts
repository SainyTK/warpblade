import { NOVA_STARS, STAR_LOOK } from "../../../constants/kael/nova";
import { PAL, SPARKS } from "../../../constants/palette";
import { fleck, glow, glowLine, hairline, place, sparkle } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { createFloorRing } from "../../effects/floorRing";
import { createImpact } from "../../effects/impact";
import { enemyCenter } from "../../enemies/enemy";
import { game, lights, particles, rng } from "../../state";
import { shake } from "../../world";

const C = PAL.crystal;

/** the star lands: a crystal flash, shards, and its blow on every foe right under it */
function land(x: number, y: number, damage: number): void {
  lights.add(x, y, 34, C[4], 0.8, 0.25);
  lights.add(x, y, 12, WHITE, 0.9, 0.08);
  game.fx.push(createFloorRing(x, y + 6, NOVA_STARS.reach + 4, C, 0.25));
  for (let i = 0; i < 8; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(60, 140);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 40, rng.range(0.3, 0.5), {
      col: rng.pick(C.slice(3)),
      size: rng.range(1, 2),
    });
  }
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, ey - y) > NOVA_STARS.reach + 8) continue;
    dealDamage(e, damage, { fromX: x, kx: 0, ky: -60, heavy: true, source: "ultimate" });
    game.fx.push(createImpact(ex, ey, rng.chance(0.5) ? 1 : -1, false, SPARKS.crystal));
  }
  shake(0.08, 1.2);
  sfx.shatter();
}

/** one crystal star slanting down from the top of the screen onto a foe, landing where the foe is when it arrives */
function createStar(foe: Enemy, delay: number, damage: number): Effect {
  const slant = rng.range(-0.35, 0.35);
  const o = { x: 0, y: -16, t: -delay, aimed: false, vx: 0, vy: NOVA_STARS.speed };
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      const [ex, ey] = enemyCenter(foe);
      if (!o.aimed) {
        o.aimed = true;
        o.x = ex - slant * (ey - o.y);
        o.vx = slant * NOVA_STARS.speed;
      }
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      if (rng.chance(0.6))
        particles.spawn(PK.STREAK, o.x, o.y, -o.vx * 0.1, -o.vy * 0.1, rng.range(0.1, 0.2), { col: C[4] });
      if (o.y < ey) return true;
      land(o.x, o.y, damage);
      return false;
    },
    draw() {
      if (o.t < 0 || !o.aimed) return;
      place();
      const tx = o.x - o.vx * STAR_LOOK.tail;
      const ty = o.y - o.vy * STAR_LOOK.tail;
      hairline(
        tx,
        ty,
        o.x,
        o.y,
        (u) => C[Math.min(5, 2 + Math.round(u * 3))],
        (u) => u,
      );
      glowLine(tx, ty, o.x, o.y, 5, C[3], 0.4);
      sparkle(o.x, o.y, STAR_LOOK.head + 1.5, C[5], C[3], 0.6);
      fleck(o.x, o.y, WHITE);
      glow(o.x, o.y, 14, C[4], 0.5);
    },
  };
}

/** Crystal Nova's stars: `count` crystal stars fall on each struck foe, one after another */
export function novaStars(foes: readonly Enemy[], count: number, damage: number): void {
  const drops = foes.filter((e) => e.hp > 0).flatMap((foe) => Array<Enemy>(count).fill(foe));
  rng
    .shuffle(drops)
    .slice(0, NOVA_STARS.most)
    .forEach((foe, i) => {
      game.fx.push(createStar(foe, NOVA_STARS.start + i * NOVA_STARS.gap + rng.range(0, 0.03), damage));
    });
}
