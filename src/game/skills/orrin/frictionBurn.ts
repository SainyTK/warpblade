import { FRICTION } from "../../../constants/orrin/skillEffects";
import { PAL } from "../../../constants/palette";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { stacksOf } from "../../enemies/skillStatus";
import { burnSwept } from "../../hero/orrin/blowSkills";
import { game, hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";
import { drawTrail, type FlameTrail, layFlame, newTrail, stepTrail } from "./flameTrail";

const ID = "o_friction";

const trailOf = (m: SkillMemory): FlameTrail => m.trail as FlameTrail;

/** the nearest standing foe to a fallen one, within reach */
function nearest(foe: Enemy, reach: number): Enemy | null {
  const [x, y] = enemyCenter(foe);
  let best: Enemy | null = null;
  let bestD = reach;
  for (const e of game.enemies) {
    if (e === foe || e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    const d = Math.hypot(cx - x, cy - y);
    if (d > bestD) continue;
    best = e;
    bestD = d;
  }
  return best;
}

/** a foe passing through the burning arc is burnt and set alight */
function scorch(e: Enemy): void {
  const v = skillValues(ID);
  dealDamage(e, progress.stats.ad * v.damage, { fromX: e.x, kx: 0, dot: true, source: ID });
  burnSwept(e);
}

/**
 * Friction Burn: foes the chain sweeps burn (the sweep itself is in the kit). Here: from level 3 a burning foe that falls
 * passes its burn to the nearest foe, and Scorched Arc leaves a burning arc in the air along every swing.
 */
export const frictionBurn: SkillBehavior = {
  create: () => ({ trail: newTrail() }),
  update(memory, state, dt) {
    const trail = trailOf(memory);
    if (state.evolved && hero.state === "swing")
      layFlame(trail, hero.x, hero.y - 14, withCharms("duration", FRICTION.scorch.life), FRICTION.scorch.drop, dt);
    stepTrail(trail, dt, withCharms("area", FRICTION.scorch.reach), FRICTION.scorch.every, scorch);
  },
  drawBack(memory) {
    drawTrail(trailOf(memory), PAL.brass);
  },
  on: {
    kill(_memory, event) {
      if (!skillValues(ID).spread) return;
      const foe = event.foe;
      if (foe.burn <= 0 && !stacksOf(foe, ID)) return;
      const next = nearest(foe, withCharms("area", FRICTION.spreadReach));
      if (next) burnSwept(next);
    },
  },
};
