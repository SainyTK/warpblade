import { W } from "../../../../constants/stage";
import { skillEvolved, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { calderFx } from "../skillFx";
import { floorShock } from "./floorShock";
import { layStacks } from "./stacks";

const SKILL = "ca_breech";
/** the second shock goes off this long after the first and reaches this much farther */
const SECOND = { delay: 0.25, grow: 1.6 } as const;
/** burn stacks a shock lays, and the most a foe carries */
const BURN = { stacks: 2, max: 6 } as const;

/** one shock of Breech Slam at x */
function shock(x: number, y: number, reach: number, quiet: boolean): void {
  const v = skillValues(SKILL);
  const damage = progress.stats.ad * v.power;
  calderFx(SKILL, "spikes", { x, y, face: hero.face, reach: reach * 0.5 }, { damage, quiet });
  calderFx(SKILL, "pillar", { x, y, face: hero.face, reach: 22 }, { damage, quiet: true });
  const struck = floorShock(x, y, { damage: progress.stats.ad * v.power, reach, launch: !!v.launch, stun: v.stun });
  if (v.burn) for (const e of struck) layStacks(e, SKILL, BURN.stacks, progress.stats.ad * v.burn, BURN.max);
}

/** a delayed shock, farther out */
function createSecondShock(x: number, y: number, reach: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < SECOND.delay) return true;
      shock(x, y, reach, true);
      return false;
    },
    draw() {},
  };
}

/**
 * Breech Slam: Breaker's blade meets the floor and a round goes off into it, a shock running out both ways; a second one
 * farther out from level 6. Faultline tears a fissure to both edges of the stage.
 */
export function breakerLanded(x: number): void {
  const v = skillValues(SKILL);
  if (!v.power || !hero.ground) return;
  const reach = withBuild("area", v.reach);
  shock(x, hero.y, reach, false);
  if (v.second) game.fx.push(createSecondShock(x, hero.y, reach * SECOND.grow));
  if (!skillEvolved(SKILL)) return;
  for (const dir of [-1, 1]) {
    calderFx(SKILL, "wave", { x, y: hero.y, face: dir, reach: W * 0.5 }, { damage: progress.stats.ad * v.fissure });
  }
  floorShock(x, hero.y, { damage: progress.stats.ad * v.fissure, reach: W, stun: v.stun });
}
