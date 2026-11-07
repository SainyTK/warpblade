import { dealDamage } from "../../../damage";
import { createImpact } from "../../../effects/impact";
import { enemyCenter } from "../../../enemies/enemy";
import { skillValues } from "../../../skills/query";
import { game, hero, progress } from "../../../state";
import { shake } from "../../../world";

/** pixels ahead of the carried foe that it bowls into */
const BOWL_REACH = 40;

/** Warpath's bowl: the running impale's first foe is driven on into the foes ahead of it, striking each */
export function bowlOver(): void {
  const power = skillValues("y_warpath").bowl ?? 0;
  const first = hero.lastHit;
  if (!power || !first || first.hp <= 0) return;
  const [fx, fy] = enemyCenter(first);
  for (const e of game.enemies) {
    if (e === first || e.hp <= 0) continue;
    const ahead = (e.x - fx) * hero.face;
    if (ahead < 0 || ahead > BOWL_REACH) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: fx, kx: hero.face * 200, launch: -140, heavy: true });
    const [ex, ey] = enemyCenter(e);
    game.fx.push(createImpact(ex, ey, hero.face, false));
  }
  game.fx.push(createImpact(fx, fy, hero.face, true));
  shake(0.12, 1.8);
}
