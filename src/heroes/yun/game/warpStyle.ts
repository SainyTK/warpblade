import { enemyCenter, walks } from "../../../game/enemies/enemy";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { WarpStyle, WarpTune } from "../../../types/moveset";
import { ARRIVAL_SWORD } from "../constants/guard";
import { SKILL } from "../constants/skillIds";
import { echoBlow } from "./echo";
import { createArrivalSword } from "./effects/arrivalSword";
import { drawThrownJian } from "./effects/thrownJian";
import { RAIN, yunFx } from "./fx";
import { hoverPlace } from "./hover";
import { yun } from "./state";
import { gainSwords } from "./swords";
import { settleTassel } from "./tassel";

/** the foes the arrival swords strike: the one he reached, and with Sword Riding at level 8 the foes near it */
function marks(foe: Enemy, spread: number): Enemy[] {
  if (!spread) return [foe];
  const reach = withBuild("area", spread);
  return [foe, ...game.enemies.filter((e) => e !== foe && e.hp > 0 && Math.abs(e.x - foe.x) < reach)];
}

/** after the shared arrival blow, each held spirit sword dives onto the foe and strikes it once, as Sword Riding
 *  shapes it; Riding the Wind echoes the arrival */
function arrived(foe: Enemy | null): void {
  settleTassel();
  const v = skillValues(SKILL.ride);
  if (v.gain) gainSwords(v.gain);
  if (skillEvolved(SKILL.ride)) echoBlow(false);
  if (!foe) {
    yunFx(SKILL.ride, "burst", { x: hero.x, y: hero.y - 16, face: hero.face, reach: 10 }, { quiet: true });
    return;
  }
  const damage = progress.stats.ad * ARRIVAL_SWORD.power * (v.arrive ?? 1);
  const targets = marks(foe, v.spread ?? 0);
  targets.slice(0, 3).forEach((t, i) => {
    const floor = walks(t) ? t.y : enemyCenter(t)[1] + 10;
    yunFx(
      SKILL.ride,
      "pillar",
      { x: t.x, y: floor, reach: 30 },
      { damage: damage * Math.max(1, yun.swords), quiet: i > 0, delay: 0.04 + i * 0.05, signature: RAIN },
    );
  });
  for (let i = 0; i < yun.swords; i++) {
    const from = hoverPlace(i);
    const target = targets[i % targets.length];
    game.fx.push(createArrivalSword(target, from.x, from.y - ARRIVAL_SWORD.rise, i * ARRIVAL_SWORD.gap, damage));
  }
}

/** Sword Riding's numbers for the shared warp */
function tune(): WarpTune {
  const v = skillValues(SKILL.ride);
  return { recharge: v.recharge, charges: v.charges, path: v.path, cost: v.cost };
}

/** Yun's warp: the jian thrown with its tassel streaming and his wisp riding it; the spirit swords arrive with him */
export const YUN_WARP: WarpStyle = { drawThrown: drawThrownJian, arrived, tune };
