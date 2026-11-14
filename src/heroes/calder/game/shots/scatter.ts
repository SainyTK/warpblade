import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { emitSkillEvent } from "../../../../game/skills/events";
import { game, hero, particles, rng } from "../../../../game/state";
import { boxAhead, boxBehind, boxHit, shake } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { PHOSPHOR, PHOSPHOR_SPARKS } from "../../constants/colors";
import { SCATTER } from "../../constants/shots";
import { roundBlast } from "../effects/roundBlast";

/**
 * Scatter Blast's pellets from (x, y) along `dir`: a cone of green streaks, and every foe inside its reach struck once
 * and thrown back. Returns the foes it struck.
 */
export function scatterBlast(x: number, y: number, dir: number, damage: number, reach = SCATTER.reach): Enemy[] {
  roundBlast(x, y, dir, false, true);
  for (let i = 0; i < SCATTER.pellets; i++) {
    const a = rng.range(-0.45, 0.45);
    const sp = rng.range(260, 420);
    particles.spawn(PK.STREAK, x, y, dir * Math.cos(a) * sp, Math.sin(a) * sp, rng.range(0.08, 0.14), {
      col: PHOSPHOR[rng.int(4, 6)],
    });
  }
  const half = SCATTER.height / 2;
  const box =
    dir === hero.face ? boxAhead(0, -18 - half, reach, -18 + half) : boxBehind(0, -18 - half, reach, -18 + half);
  const struck = game.enemies.filter((e) => e.hp > 0 && boxHit(box, enemyBox(e)));
  for (const e of struck) {
    dealDamage(e, damage, { fromX: hero.x, kx: dir * SCATTER.kx, ky: SCATTER.ky, heavy: true, source: "abilities" });
    game.fx.push(createImpact(...enemyCenter(e), dir, true, PHOSPHOR_SPARKS));
  }
  shake(0.18, 2.4);
  emitSkillEvent({ type: "calderBlast", x, y, foes: struck });
  return struck;
}
