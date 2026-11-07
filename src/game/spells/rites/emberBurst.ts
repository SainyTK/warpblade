import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { glow, line, place, px } from "../../../engine/frame";
import type { SourceId } from "../../../types/build";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { game, particles, rng } from "../../state";
import { crackle } from "./riteSound";

const LIFE = 0.18;
const RAYS = 8;

/** a small burst of flame on a struck foe: rays of fire, sparks, and a hit on every foe within the radius, counted for
 *  the hero's blows or a skill's own source */
export function burstEmbers(
  x: number,
  y: number,
  damage: number,
  radius: number,
  burn: number,
  source: SourceId = "attacks",
): void {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - x, ey - y) > radius) continue;
    dealDamage(e, damage, { dot: true, source });
    e.burn = Math.max(e.burn, burn);
  }
  for (let i = 0; i < 6; i++)
    particles.spawn(PK.SPARK, x, y, rng.range(-120, 120), rng.range(-160, 40), rng.range(0.15, 0.3), {
      sparks: RITE_SPARKS,
    });
  crackle(0.7);
  const spin = rng.range(0, TAU);
  let t = 0;
  const effect: Effect = {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      for (let i = 0; i < RAYS; i++) {
        const a = spin + (i / RAYS) * TAU;
        const r0 = radius * 0.2 + u * radius * 0.5;
        const r1 = r0 + radius * 0.4 * (1 - u);
        line(
          x + Math.cos(a) * r0,
          y + Math.sin(a) * r0,
          x + Math.cos(a) * r1,
          y + Math.sin(a) * r1,
          (s) => RITE_RAMP[s < 0.5 ? 5 : 4],
        );
      }
      if (u < 0.3) px(x, y, WHITE);
      glow(x, y, radius, RITE_RAMP[4], 0.5 * (1 - u));
    },
  };
  game.fx.push(effect);
}
