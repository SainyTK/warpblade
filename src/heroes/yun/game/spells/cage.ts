import { GROUND } from "../../../../constants/stage";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { CAGE } from "../../constants/abilities";
import { RAIN } from "../../constants/rain";
import { SKILL } from "../../constants/skillIds";
import { createRainSword } from "../effects/rainSword";
import type { SwordPlace } from "../hover";

/** the foes ahead within reach, nearest first */
function foesAhead(n: number): Enemy[] {
  const reach = withBuild("area", CAGE.reach);
  return game.enemies
    .filter((e) => e.hp > 0 && (e.x - hero.x) * hero.face > -4 && Math.abs(e.x - hero.x) < reach)
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))
    .slice(0, n);
}

/**
 * Sword Cage: the swords fall from above round the foes ahead, nearest first, and pin each one where it stands; with
 * no foe ahead they fall a little in front of him
 */
export function castCage(places: readonly SwordPlace[], _wide: boolean): void {
  const v = skillValues(SKILL.cage);
  const foes = foesAhead(v.foes);
  const damage = progress.stats.ap * v.power;
  if (!foes.length) {
    places.forEach((_p, i) => {
      const mark = { x: hero.x + hero.face * (30 + i * 8), y: Math.min(hero.y, GROUND) };
      game.fx.push(createRainSword(mark, i * RAIN.gap, CAGE.leans[i % CAGE.leans.length], damage, "abilities"));
    });
    return;
  }
  const each = Math.max(1, Math.ceil(places.length / foes.length)) + (v.extra ?? 0);
  foes.forEach((foe, f) => {
    foe.pinned = Math.max(foe.pinned, withBuild("duration", v.pin));
    if (v.mark) markFoe(foe, SKILL.cage, withBuild("duration", v.pin), v.mark);
    for (let i = 0; i < each; i++)
      game.fx.push(
        createRainSword(
          { foe },
          (f + i * foes.length) * RAIN.gap,
          CAGE.leans[i % CAGE.leans.length],
          damage,
          "abilities",
        ),
      );
  });
}
