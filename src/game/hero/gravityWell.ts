import { ENEMY_AIR, GRAVITY_REACH } from "../../constants/combat";
import { PAL } from "../../constants/palette";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { skillValues } from "../skills/query";
import { game, hero } from "../state";

/** Sky Dance: every airborne foe near Kael is dragged down with his stomp */
export function gravityPull(): void {
  if (!skillValues("k_skydance").gravity) return;
  let pulled = 0;
  for (const e of game.enemies) {
    if (!e.air || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.hypot(cx - hero.x, cy - (hero.y - 18)) > GRAVITY_REACH) continue;
    e.vy = ENEMY_AIR.spike;
    pulled++;
  }
  if (pulled) game.fx.push(createFloorRing(hero.x, hero.y - 18, GRAVITY_REACH, PAL.shadow, 0.35, 0.6));
}
