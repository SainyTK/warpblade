import { dealDamage } from "../../../game/damage";
import { createImpact } from "../../../game/effects/impact";
import { enemyCenter } from "../../../game/enemies/enemy";
import { skillValues } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { DAWN_SPARKS } from "../constants/light";
import { FORTRESS_LANCE } from "../constants/skillNumbers";
import { createDawnLance } from "./effects/lance";

/** Iron Fortress: a block throws a lance of light straight back at the attacker */
export function fortressLance(foe: Enemy): void {
  const damage = progress.stats.ad * (skillValues("al_vow").lance ?? 0);
  const dir = Math.sign(enemyCenter(foe)[0] - hero.x) || hero.face;
  game.fx.push(
    createDawnLance(hero.x + dir * 8, hero.y - 20, dir, {
      pierce: FORTRESS_LANCE.pierce,
      rise: 0,
      size: 1,
      hit: (e, x, y) => {
        dealDamage(e, damage, { source: "al_vow", fromX: x - dir * 8, kx: dir * 40 });
        game.fx.push(createImpact(x, y, dir, false, DAWN_SPARKS));
      },
    }),
  );
}
