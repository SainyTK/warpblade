import { drillFighter } from "../../../../../drill";
import { createFloorRing } from "../../../../../game/effects/floorRing";
import { enemyCenter } from "../../../../../game/enemies/enemy";
import { addStacks, stacksOf } from "../../../../../game/enemies/skillStatus";
import { game, hero, progress } from "../../../../../game/state";
import type { Enemy } from "../../../../../types/enemy";
import { DUSK_RAMP } from "../../../look/colors";
import type { SkillNumbers, VesperDrillSkill } from "../../../types/drillSkill";
import { vesperFx } from "../../skillFx";
import { foesNear, skillStrike } from "../strike";

const ID = "ve_glow";
const GLOW = { every: 0.5, duration: 3, burst: 36, flareTicks: 3 } as const;
const watched = new Set<Enemy>();

function glow(foe: Enemy, n: number, values: SkillNumbers): void {
  const [x, y] = enemyCenter(foe);
  const ticks = GLOW.duration / GLOW.every;
  vesperFx(ID, { x, y, face: hero.face }, { damage: progress.stats.ad * (values.damage ?? 0) * n * ticks });
  addStacks(foe, ID, {
    stacks: n,
    max: values.max,
    damage: progress.stats.ad * values.damage,
    every: GLOW.every,
    duration: GLOW.duration,
  });
  watched.add(foe);
}

export const AFTERGLOW_DRILL: VesperDrillSkill = {
  id: ID,
  dashed(foes, { values, evolved }) {
    for (const foe of foes) {
      glow(foe, 1, values);
    }
    if (evolved) {
      for (const foe of game.enemies) {
        const n = stacksOf(foe, ID);
        if (n && foe.hp > 0) {
          const [x, y] = enemyCenter(foe);
          vesperFx(
            ID,
            { x, y, face: hero.face, reach: 13 },
            { damage: progress.stats.ad * values.damage * n * GLOW.flareTicks },
          );
          skillStrike(foe, values.damage * n * GLOW.flareTicks, ID, { dot: true });
        }
      }
    }
  },
  slashed(strike, _landed, { values }) {
    const h = drillFighter();
    if (strike !== "warp" || !h || !values.warp) {
      return;
    }
    for (const foe of foesNear(h.x, h.y - 16, 40)) {
      glow(foe, values.warp, values);
    }
  },
  spellHit(foe, _spell, { values }) {
    if (values.spells) {
      glow(foe, 1, values);
    }
  },
  tick(_dt, { values }) {
    for (const foe of [...watched]) {
      if (foe.hp > 0 && stacksOf(foe, ID)) {
        continue;
      }
      watched.delete(foe);
      if (foe.hp <= 0 && values.burst) {
        const [x, y] = enemyCenter(foe);
        game.fx.push(createFloorRing(x, y + 8, GLOW.burst, DUSK_RAMP, 0.35, 0.5));
        vesperFx(ID, { x, y, face: hero.face, reach: 15 }, { damage: progress.stats.ad * values.burst });
        for (const near of foesNear(x, y, GLOW.burst)) {
          skillStrike(near, values.burst, ID);
        }
      }
    }
  },
};
