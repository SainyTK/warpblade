import { AFTERSHOCK } from "../../constants/shopSkills";
import { ownsSkill } from "../../store/meta";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, lights, progress } from "../state";
import { skin } from "./skin";

/** Aftershock, bought in the shop: a ring out from the hero that hits every foe close by */
export function aftershock(): void {
  if (!ownsSkill("warpShock")) return;
  game.fx.push(createFloorRing(hero.x, hero.y, AFTERSHOCK.radius, skin.ramp, 0.45));
  lights.add(hero.x, hero.y - 10, AFTERSHOCK.radius * 1.5, skin.ramp[3], 0.6, 0.35);
  for (const e of [...game.enemies]) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - hero.x, ey - (hero.y - 16)) > AFTERSHOCK.radius) continue;
    dealDamage(e, progress.stats.ad * AFTERSHOCK.power, { stun: AFTERSHOCK.stun, kx: Math.sign(ex - hero.x) * 90 });
  }
}
