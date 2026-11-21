import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PILLAR } from "../../constants/abilities";
import { createDawnGround } from "../effects/dawnGround";
import { createSunPillar } from "./pillar";

/** the nearest standing foe ahead within the pillar's reach */
function foeAhead(): Enemy | null {
  let best: Enemy | null = null;
  let bestD: number = PILLAR.reach;
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const d = (enemyCenter(e)[0] - hero.x) * hero.face;
    if (d >= -4 && d < bestD) {
      best = e;
      bestD = d;
    }
  }
  return best;
}

/** Lingering Dawn: a pillar leaves light on the floor that burns foes standing in it */
export function linger(x: number): void {
  const v = skillValues("al_dawn");
  if (!v.burn) return;
  game.fx.push(
    createDawnGround(x, withCharms("area", v.width), withCharms("duration", v.time), progress.stats.ap * v.burn),
  );
}

/** Sunpillar: one pillar on the nearest foe ahead, or held a row of three, each brought down at `power` */
export function callPillars(power: number, wide: boolean): void {
  const foe = foeAhead();
  const x0 = foe ? enemyCenter(foe)[0] : hero.x + hero.face * PILLAR.fallback;
  const xs = wide ? [x0 - hero.face * PILLAR.wideGap, x0, x0 + hero.face * PILLAR.wideGap] : [x0];
  const brand = skillValues("al_brand");
  xs.forEach((x, i) => {
    game.fx.push(
      createSunPillar({
        x,
        delay: PILLAR.delay + i * 0.08,
        damage: progress.stats.ap * PILLAR.power * power,
        stun: PILLAR.stun,
        half: PILLAR.half,
        source: "abilities",
        struck: (hit) => {
          if (brand.pillar) for (const e of hit) addStacks(e, "al_brand", brandSpec(brand));
        },
      }),
    );
    linger(x);
  });
}

/** Sunbrand's stacks as its row sets them */
export const brandSpec = (v: Readonly<Record<string, number>>) => ({
  stacks: 1,
  max: v.max ?? 3,
  damage: progress.stats.ad * (v.tick ?? 0),
  every: 0.5,
  duration: withCharms("duration", v.time ?? 3),
});
