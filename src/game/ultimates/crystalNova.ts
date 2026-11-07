import { PAL } from "../../constants/palette";
import { ULT_LEVELS } from "../../constants/ultimate";
import { ellipseRing, glow, place } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { ease, TAU } from "../../utils/math";
import { dealDamage } from "../damage";
import { createImpact } from "../effects/impact";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, particles, progress, rng } from "../state";

/** how far the ring runs at each level; level 4 crosses the whole screen */
const RADIUS = [60, 100, 150, 340] as const;
/** the special is the weakest ultimate: this share of a level's power */
const SHARE = 0.75;
const GROW = 0.4;

/** Crystal Nova, Kael's special from the start: a ring of crystal bursts out around him and throws foes up */
export function castCrystalNova(level: number): void {
  const x = hero.x;
  const y = hero.y - 16;
  const reach = RADIUS[level - 1];
  const damage = ULT_LEVELS[level - 1].power * progress.stats.ad * SHARE;
  const struck = new Set<Enemy>();
  let t = 0;
  for (let i = 0; i < 20 + level * 10; i++) {
    const a = rng.range(0, TAU);
    const sp = rng.range(80, 140 + level * 50);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * sp, Math.sin(a) * sp * 0.6, rng.range(0.4, 0.8), {
      col: rng.pick(PAL.crystal.slice(3)),
      size: rng.range(1, 2.5),
    });
  }
  const effect: Effect = {
    update(dt) {
      t += dt;
      const r = reach * ease.outCubic(Math.min(1, t / GROW));
      for (const e of game.enemies) {
        if (struck.has(e) || e.hp <= 0) continue;
        const [cx, cy] = enemyCenter(e);
        if (Math.hypot(cx - x, (cy - y) * 1.6) > r) continue;
        struck.add(e);
        const dir = Math.sign(cx - x) || hero.face;
        dealDamage(e, damage, { fromX: x, kx: dir * 140, launch: -170, heavy: true, source: "ultimate" });
        game.fx.push(createImpact(cx, cy, dir, level >= 3));
      }
      return t < GROW + 0.25;
    },
    draw() {
      place();
      const u = Math.min(1, t / GROW);
      const r = reach * ease.outCubic(u);
      const k = 1 - Math.max(0, (t - GROW) / 0.25);
      ellipseRing(x, y, r, r * 0.62, WHITE, k);
      ellipseRing(x, y, r - 2, (r - 2) * 0.62, PAL.crystal[4], k);
      ellipseRing(x, y, r - 5, (r - 5) * 0.62, PAL.crystal[2], k * 0.6);
      glow(x, y, 30 + level * 10, PAL.crystal[3], 0.5 * (1 - u));
    },
  };
  game.fx.push(effect);
}
