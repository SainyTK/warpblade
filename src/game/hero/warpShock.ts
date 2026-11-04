import { WARP_SHOCK } from "../../constants/shopSkills";
import { ownsSkill } from "../../store/meta";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { enemyCenter } from "../enemies/enemy";
import { game, hero, lights, progress } from "../state";
import { skin } from "./skin";

/** Warp Shock: a warp strike also sends a ring out from Kael that hits every foe close by */
export function warpShock(): void {
  if (!ownsSkill("warpShock")) return;
  game.fx.push(createFloorRing(hero.x, hero.y, WARP_SHOCK.radius, skin.ramp, 0.45));
  lights.add(hero.x, hero.y - 10, WARP_SHOCK.radius * 1.5, skin.ramp[3], 0.6, 0.35);
  for (const e of [...game.enemies]) {
    if (e.hp <= 0) continue;
    const [ex, ey] = enemyCenter(e);
    if (Math.hypot(ex - hero.x, ey - (hero.y - 16)) > WARP_SHOCK.radius) continue;
    dealDamage(e, progress.stats.ad * WARP_SHOCK.power, { stun: WARP_SHOCK.stun, kx: Math.sign(ex - hero.x) * 90 });
  }
}
