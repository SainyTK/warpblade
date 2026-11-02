import { ENEMY_AIR, FUSION } from "../../constants/combat";
import { PAL } from "../../constants/palette";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { hasPerk } from "../progress";
import { game, hero } from "../state";

/** Gravity Well: every airborne foe near Kael is dragged down with the one he spiked */
export function gravityPull(): void {
  if (!hasPerk("gravityWell")) return;
  let pulled = 0;
  for (const e of game.enemies) {
    if (!e.air || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - hero.x, cy - (hero.y - 18)) > FUSION.gravityReach) continue;
    e.vy = ENEMY_AIR.spike;
    pulled++;
  }
  if (pulled) game.fx.push(createFloorRing(hero.x, hero.y - 18, FUSION.gravityReach, PAL.shadow, 0.35, 0.6));
}
