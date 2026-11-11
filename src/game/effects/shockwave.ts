import { WORLD_COLORS } from "../../constants/palette";
import { W } from "../../constants/stage";
import { QUAKE } from "../../constants/ysra/stance";
import { fleck, glow, hairline, line, place, px } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { dealDamage } from "../damage";
import { enemyBox } from "../enemies/enemy";
import { game, particles, rng } from "../state";
import { boxHit } from "../world";

/** the heave at the front: a jagged hump of floor, tallest at the front and falling away behind it */
const HUMP = [5, 4, 4, 3, 2, 2, 1] as const;

/**
 * Vault Strike's shockwave: two fronts run out along the floor from where she landed, one each way. Each lifts a hump of floor,
 * leaves a glowing crack behind it and throws up chips of stone, and trips every foe on the floor it passes once.
 */
export function createShockwave(x: number, y: number, damage: number, ramp: Ramp, range: number, stun: number): Effect {
  const struck = new Set<Enemy>();
  const life = range / QUAKE.speed;
  let t = 0;
  const front = (side: number) => x + side * QUAKE.speed * t;
  const hit = (side: number) => {
    const fx = front(side);
    for (const e of game.enemies) {
      if (struck.has(e) || e.hp <= 0 || e.air || !boxHit([fx - 4, y - QUAKE.height, fx + 4, y + 1], enemyBox(e)))
        continue;
      struck.add(e);
      dealDamage(e, damage, { fromX: x, kx: side * 50, stun, heavy: true });
    }
  };
  const chips = (side: number) => {
    const fx = front(side);
    if (fx < 0 || fx > W || !rng.chance(0.55)) return;
    particles.spawn(PK.SHARD, fx, y - 1, side * rng.range(10, 50), -rng.range(60, 130), rng.range(0.35, 0.6), {
      col: WORLD_COLORS.stoneTop,
      size: rng.range(1.5, 2.5),
    });
  };
  const drawSide = (side: number, k: number) => {
    const fx = Math.round(front(side));
    // the crack: hot near the front, cooling to a dull line back toward her
    line(
      x,
      y,
      fx,
      y,
      (u) => ramp[Math.max(1, Math.min(ramp.length - 2, Math.round(u * 4)))],
      (u) => k * (0.3 + 0.7 * u),
    );
    // a white hot seam in the crack close behind the front
    hairline(fx - side * 14, y + 0.25, fx, y + 0.25, WHITE, (u) => k * u);
    HUMP.forEach((h, i) => {
      const hx = fx - side * i;
      const lift = Math.round(h * k);
      for (let j = 1; j <= lift; j++) px(hx, y - j, j === lift ? WORLD_COLORS.stoneTop : WORLD_COLORS.stone);
      // the light from the crack catches the lifted stone on the side facing the front
      if (lift > 0) fleck(hx + (side > 0 ? 0.75 : 0.25), y - lift + 0.25, ramp[ramp.length - 2], k);
    });
    px(fx, y - 1, ramp[4]);
    px(fx + side, y, WHITE, k);
    // light thrown ahead of the front along the floor
    hairline(fx + side, y - 0.25, fx + side * 7, y - 0.25, ramp[ramp.length - 2], (u) => k * (1 - u));
    glow(fx, y - 2, 9, ramp[3], 0.5 * k);
  };
  return {
    update(dt) {
      t += dt;
      hit(1);
      hit(-1);
      chips(1);
      chips(-1);
      return t < life;
    },
    draw() {
      place();
      const k = 1 - (t / life) ** 2;
      drawSide(1, k);
      drawSide(-1, k);
    },
  };
}
