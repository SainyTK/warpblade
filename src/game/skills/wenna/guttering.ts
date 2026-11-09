import { ENEMIES } from "../../../constants/enemies";
import { PAL, WAX } from "../../../constants/palette";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import type { Wick } from "../../../types/wenna";
import { dealDamage } from "../../damage";
import { launchEnemy } from "../../enemies/airborne";
import { enemyCenter } from "../../enemies/enemy";
import { gainWax } from "../../hero/wenna/wax";
import { byWick } from "../../hero/wenna/wickKills";
import { game, lights, particles, progress, rng } from "../../state";
import { skillValues, withCharms } from "../query";

const ID = "w_gutter";
/** Wildfire's fire lasts this long */
const WILDFIRE = 2;

/** a Wick that died or burned out bursts where it stood */
function gutter(w: Wick): void {
  const v = skillValues(ID);
  const radius = withCharms("area", v.radius);
  const x = w.x;
  const y = w.y - 6;
  byWick(() => {
    for (const e of game.enemies) {
      if (e.hp <= 0) continue;
      const [cx, cy] = enemyCenter(e);
      if (Math.hypot(cx - x, (cy - y) * 1.2) > radius) continue;
      dealDamage(e, progress.stats.ap * v.power, { fromX: x, kx: Math.sign(cx - x || 1) * 60, source: ID });
      if (v.chill) e.chill = Math.max(e.chill, 1.2);
      if (v.launch && e.hp > 0 && ENEMIES[e.type].rank === "minion" && ENEMIES[e.type].launchable) launchEnemy(e, -180);
    }
  });
  if (v.wax) gainWax(v.wax);
  if (v.wildfire)
    for (const dx of [-10, 0, 10]) game.blazes.push({ x: x + dx, y: w.y, life: WILDFIRE, max: WILDFIRE, tick: 0 });
  for (let i = 0; i < 10; i++)
    particles.spawn(PK.SPARK, x, y, rng.range(-90, 90), -rng.range(20, 100), rng.range(0.25, 0.45), {
      col: rng.chance(0.5) ? PAL.wick[4] : WAX[3],
    });
  lights.add(x, y, radius * 1.4, PAL.wick[4], 0.7, 0.25);
}

/** Guttering: a Wick that dies or burns out bursts; Wildfire leaves fire on the floor */
export const gutteringSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    wick(_m, event) {
      if (event.lit || (event.cause !== "life" && event.cause !== "hp")) return;
      gutter(event.wick);
    },
  },
};
